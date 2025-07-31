# Repository Layer 리팩토링 계획서

## 📋 프로젝트 개요

**목표**: 각 모듈 내에 Repository 파일을 추가하여 Service에서 데이터 액세스 로직을 분리하고 ORM 교체가 용이한 구조 구축

**현재 상태**: Service 계층에서 Prisma ORM을 직접 사용하여 데이터 액세스와 비즈니스 로직이 혼재됨

**예상 기간**: 5-7일 (개발자 1명 기준)

## 🔍 현재 문제점 분석

### 1. Service Layer의 혼합된 책임

- **AuthService**: 비즈니스 로직 + Prisma를 통한 직접적인 데이터 액세스
- **CalendarService**: 복잡한 Prisma 쿼리들이 서비스 계층에 직접 구현
- **UserService**: 사용자 CRUD 작업을 서비스에서 직접 처리
- **CompanyService, FavoriteService, SubscriptionService**: 동일한 패턴

### 2. Repository Pattern 부재

- 데이터 액세스 로직이 서비스 계층에 분산
- ORM 변경 시 Service 전체 수정 필요
- 쿼리 로직의 재사용성 부족
- 단위 테스트 시 데이터베이스 의존성 문제

## 🏗️ Repository Layer 설계

### 모듈별 디렉토리 구조

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.repository.ts        # 새로 추가
│   └── dto/
├── user/
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.repository.ts        # 새로 추가
│   └── dto/
├── calendar/
│   ├── calendar.controller.ts
│   ├── calendar.service.ts
│   ├── calendar.repository.ts    # 새로 추가
│   └── dto/
├── company/
│   ├── company.controller.ts
│   ├── company.service.ts
│   ├── company.repository.ts     # 새로 추가
├── favorite/
│   ├── favorite.controller.ts
│   ├── favorite.service.ts
│   ├── favorite.repository.ts    # 새로 추가
│   └── dto/
└── subscription/
    ├── subscription.controller.ts
    ├── subscription.service.ts
    ├── subscription.repository.ts # 새로 추가
    └── dto/
```

### Repository 설계 (Interface는 선택사항)

Repository는 단순하게 클래스로만 구현하고, 필요한 경우에만 Interface를 추가하는 방식:
기본적으로 "방법 1: 단순한 Repository 클래스"를 이용할 것.

```typescript
// 방법 1: 단순한 Repository 클래스 (추천)
@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async create(userData: CreateUserData): Promise<User> {
    return await this.prisma.user.create({ data: userData });
  }

  // 기타 메서드들...
}

// 방법 2: Interface 사용 (ORM 교체가 확실한 경우)
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserData): Promise<User>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  // 구현...
}
```

**Interface 사용 판단 기준:**

- ✅ **Interface 없이**: 단순하게 Repository만 분리하고 싶은 경우
- ✅ **Interface 사용**: ORM 교체 계획이 확실한 경우

## 📚 Repository별 메서드 설계

### UserRepository

```typescript
@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByOAuthId(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        oauthAccounts: {
          some: { provider, providerId },
        },
      },
      include: { oauthAccounts: true },
    });
  }

  async create(userData: CreateUserData): Promise<User> {
    return await this.prisma.user.create({ data: userData });
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async updateProfile(
    userId: number,
    profileData: Partial<User>,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: profileData,
    });
  }

  async delete(userId: number): Promise<void> {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  async setRefreshTokenHash(userId: number, hash: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { currentHashedRefreshToken: hash },
    });
  }

  async removeRefreshTokenHash(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { currentHashedRefreshToken: null },
    });
  }
}
```

### AuthRepository

```typescript
interface IAuthRepository {
  storeVerificationToken(token: string, email: string): Promise<void>;
  findEmailFromVerificationToken(token: string): Promise<string>;
  storeVerificationCode(email: string, code: string): Promise<void>;
  verifyEmailCode(email: string, code: string): Promise<boolean>;
  createOAuthAccount(userId: number, oauthData: OAuthData): Promise<void>;
  linkOAuthAccount(userId: number, oauthData: OAuthData): Promise<void>;
  findOAuthAccount(
    provider: string,
    providerId: string,
  ): Promise<OAuthAccount | null>;
}
```

### CalendarRepository

```typescript
interface ICalendarRepository {
  findEarningsByDateRange(
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<Earnings[]>;
  findDividendsByDateRange(
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<Dividend[]>;
  findEconomicIndicatorsByDateRange(
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<EconomicIndicator[]>;
  findEarningsWithCompanyByDateRange(
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<EarningsWithCompany[]>;
  findCompanyEarningsHistory(
    companyId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedEarnings>;
  findCompanyDividendHistory(
    companyId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedDividends>;
  findIndicatorGroupHistory(
    baseName: string,
    country?: string,
    page: number,
    limit: number,
  ): Promise<PaginatedIndicators>;
}
```

### FavoriteRepository

```typescript
interface IFavoriteRepository {
  addFavoriteCompany(
    userId: number,
    companyId: number,
  ): Promise<FavoriteCompany>;
  removeFavoriteCompany(userId: number, companyId: number): Promise<void>;
  getFavoriteCompanies(userId: number): Promise<FavoriteCompany[]>;
  addFavoriteIndicatorGroup(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<FavoriteIndicatorGroup>;
  removeFavoriteIndicatorGroup(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<void>;
  getFavoriteIndicatorGroups(userId: number): Promise<FavoriteIndicatorGroup[]>;
  getAllFavorites(userId: number): Promise<AllFavorites>;
}
```

### SubscriptionRepository

```typescript
interface ISubscriptionRepository {
  subscribeCompany(userId: number, companyId: number): Promise<void>;
  unsubscribeCompany(userId: number, companyId: number): Promise<void>;
  getSubscriptionCompanies(userId: number): Promise<SubscriptionCompany[]>;
  isCompanySubscribed(userId: number, companyId: number): Promise<boolean>;
  getCompanySubscribers(companyId: number): Promise<{ userId: number }[]>;
  subscribeIndicatorGroup(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<void>;
  unsubscribeIndicatorGroup(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<void>;
  getSubscriptionIndicatorGroups(
    userId: number,
  ): Promise<SubscriptionIndicatorGroup[]>;
  isIndicatorGroupSubscribed(
    userId: number,
    baseName: string,
    country: string,
  ): Promise<boolean>;
  getIndicatorGroupSubscribers(
    baseName: string,
    country: string,
  ): Promise<{ userId: number }[]>;
}
```

## 🚀 단계별 실행 계획

### Phase 1: 단순한 모듈부터 시작 (1-2일)

**목표**: UserRepository와 CompanyRepository 구현으로 패턴 확립

1. **UserRepository 구현**

   - `src/user/interfaces/user.repository.interface.ts` 생성
   - `src/user/user.repository.ts` 생성 (Prisma 기반 구현)
   - UserService에서 Prisma 직접 사용 제거

2. **CompanyRepository 구현**

   - `src/company/interfaces/company.repository.interface.ts` 생성
   - `src/company/company.repository.ts` 생성
   - CompanyService 리팩토링

3. **모듈 설정 업데이트**
   - 각 모듈에서 Repository를 Provider로 등록
   - Service에서 Repository 주입 설정

### Phase 2: 중간 복잡도 모듈 (1-2일)

**목표**: FavoriteRepository와 SubscriptionRepository 구현

1. **FavoriteRepository 구현**

   - `src/favorite/interfaces/favorite.repository.interface.ts` 생성
   - `src/favorite/favorite.repository.ts` 생성
   - FavoriteService 리팩토링

2. **SubscriptionRepository 구현**
   - `src/subscription/interfaces/subscription.repository.interface.ts` 생성
   - `src/subscription/subscription.repository.ts` 생성
   - SubscriptionService 리팩토링

### Phase 3: 복잡한 모듈 구현 (2-3일)

**목표**: AuthRepository와 CalendarRepository 구현

1. **AuthRepository 구현**

   - `src/auth/interfaces/auth.repository.interface.ts` 생성
   - `src/auth/auth.repository.ts` 생성
   - AuthService의 복잡한 Prisma 로직을 Repository로 이동

2. **CalendarRepository 구현**
   - `src/calendar/interfaces/calendar.repository.interface.ts` 생성
   - `src/calendar/calendar.repository.ts` 생성
   - CalendarService의 복잡한 쿼리들을 Repository로 이동

### Phase 4: 테스트 및 검증 (1일)

**목표**: 리팩토링된 코드의 안정성 확보

1. **Repository 단위 테스트 작성**

   - 각 Repository의 주요 메서드 테스트
   - Interface 기반 모킹을 통한 Service 테스트

2. **기존 E2E 테스트로 회귀 검증**
   - 기존 API 동작 변화 없음을 확인
   - 성능 테스트 수행

## 🛠️ 구현 예시

### Before: Service에서 Prisma 직접 사용

```typescript
// src/user/user.service.ts
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async createUserByEmail(email: string, password?: string): Promise<User> {
    const existing = await this.findUserByEmail(email);
    if (existing) {
      throw new ConflictException('User already exists');
    }
    const hashed = password ? await bcrypt.hash(password, 10) : null;
    const nickname = `User${Date.now()}`;
    return await this.prisma.user.create({
      data: { email, password: hashed, nickname, verified: true },
    });
  }
}
```

### After: Repository Pattern 적용

#### 1. Repository Interface

```typescript
// src/user/interfaces/user.repository.interface.ts
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(userData: CreateUserData): Promise<User>;
  update(id: number, userData: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
  updatePassword(userId: number, hashedPassword: string): Promise<void>;
}

export interface CreateUserData {
  email: string;
  password?: string;
  nickname: string;
  verified: boolean;
}
```

#### 2. Repository Implementation

```typescript
// src/user/user.repository.ts
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async create(userData: CreateUserData): Promise<User> {
    return await this.prisma.user.create({ data: userData });
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
```

#### 3. Service (비즈니스 로직만 담당)

```typescript
// src/user/user.service.ts
@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async createUserByEmail(email: string, password?: string): Promise<User> {
    // 비즈니스 로직: 중복 체크
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    // 비즈니스 로직: 비밀번호 해시화 및 닉네임 생성
    const hashed = password ? await bcrypt.hash(password, 10) : null;
    const nickname = `User${Date.now()}`;

    // 데이터 액세스는 Repository에 위임
    return await this.userRepository.create({
      email,
      password: hashed,
      nickname,
      verified: true,
    });
  }
}
```

#### 4. Module 설정

```typescript
// src/user/user.module.ts
@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UserService, 'IUserRepository'],
})
export class UserModule {}
```

## 📊 예상 효과

### 1. ORM 교체 용이성 (핵심 목표)

- ✅ Interface 기반 설계로 Prisma → TypeORM/Sequelize 등 쉬운 교체
- ✅ Service 계층 수정 없이 Repository 구현체만 교체
- ✅ 데이터베이스 벤더 변경 시에도 비즈니스 로직 보호

### 2. 아키텍처 개선

- ✅ 명확한 계층 분리 (Controller → Service → Repository → Database)
- ✅ 단일 책임 원칙 준수 (Service: 비즈니스 로직, Repository: 데이터 액세스)
- ✅ 각 모듈 내에서 응집도 향상

### 3. 유지보수성 향상

- ✅ 데이터 액세스 로직과 비즈니스 로직 명확한 분리
- ✅ 모듈별로 독립적인 Repository 관리
- ✅ 복잡한 쿼리 로직의 중앙화

### 4. 테스트 개선

- ✅ Service 단위 테스트 시 Repository 모킹 용이
- ✅ Repository 단위 테스트로 데이터 액세스 로직 검증
- ✅ 테스트 실행 속도 향상 (데이터베이스 의존성 제거)

## ⚠️ 주의사항 및 고려사항

### 1. 기존 API 호환성

- 모든 기존 Controller와 API 엔드포인트는 변경 없이 유지
- 외부 인터페이스에는 전혀 영향 없음

### 2. ORM 교체 시 고려사항

- Repository Interface는 ORM에 종속되지 않도록 설계
- 타입 정의는 Prisma 타입이 아닌 도메인 타입 사용
- 복잡한 쿼리는 Repository에서 적절히 추상화

### 3. 성능 고려사항

- Repository 계층 추가로 인한 미미한 오버헤드
- 쿼리 최적화 기회 확보로 전체적인 성능 향상 가능

## 📝 체크리스트

### Phase 1 완료 기준 (1-2일)

- [ ] `src/user/interfaces/user.repository.interface.ts` 생성
- [ ] `src/user/user.repository.ts` 구현
- [ ] UserService 리팩토링 완료
- [x] `src/company/company.repository.ts` 구현 ✅ **2025-07-31 완료**
- [x] CompanyService 리팩토링 완료 ✅ **2025-07-31 완료**

### Phase 2 완료 기준 (1-2일)

- [ ] `src/favorite/interfaces/favorite.repository.interface.ts` 생성
- [ ] `src/favorite/favorite.repository.ts` 구현
- [ ] FavoriteService 리팩토링 완료
- [ ] `src/subscription/interfaces/subscription.repository.interface.ts` 생성
- [ ] `src/subscription/subscription.repository.ts` 구현
- [ ] SubscriptionService 리팩토링 완료

### Phase 3 완료 기준 (2-3일)

- [ ] `src/auth/interfaces/auth.repository.interface.ts` 생성
- [x] `src/auth/auth.repository.ts` 구현 ✅ **2025-01-31 완료**
- [x] AuthService 리팩토링 완료 ✅ **2025-01-31 완료**
- [x] `src/calendar/calendar.repository.ts` 구현 ✅ **2025-01-31 완료**
- [x] CalendarService 리팩토링 완료 ✅ **2025-01-31 완료**
- [x] `src/notification/notification.repository.ts` 구현 ✅ **2025-01-31 완료**
- [x] NotificationService 리팩토링 완료 ✅ **2025-01-31 완료**
- [x] `src/search/search.repository.ts` 구현 ✅ **2025-01-31 완료**
- [x] SearchService 리팩토링 완료 ✅ **2025-01-31 완료**

### Phase 4 완료 기준 (1일)

- [ ] 모든 Repository 단위 테스트 작성
- [ ] Service 모킹 테스트 개선
- [ ] E2E 테스트 통과 확인
- [ ] 성능 테스트 완료

## 🐛 테스트 관련 문제점 및 해결책

### 발생한 문제

**날짜**: 2025-01-31  
**문제**: AuthService 테스트 실행 시 `AuthRepository` 의존성을 찾을 수 없어 테스트 실패

### 근본 원인 분석

1. **의존성 주입 불일치**: AuthService가 AuthRepository를 생성자에서 주입받도록 변경되었으나, 기존 테스트 코드에서는 AuthRepository mock을 제공하지 않음
2. **리팩토링 후 테스트 업데이트 누락**: Repository 패턴 적용 후 Service 계층의 의존성이 변경되었지만, 테스트 코드는 기존 PrismaService 의존성만 mock하고 있었음
3. **테스트 격리 부족**: Service 테스트에서 실제 데이터베이스 계층(Repository)을 제대로 mock하지 않아 테스트 실패

### 해결 방법

```typescript
// 1. AuthRepository import 추가
import { AuthRepository } from './auth.repository';

// 2. AuthRepository mock 객체 생성
const mockAuthRepository = {
  findEmailFromVerificationToken: jest.fn(),
  createUserWithOAuth: jest.fn(),
  findOAuthAccount: jest.fn(),
  linkOAuthAccount: jest.fn(),
  sendVerificationCodeTransaction: jest.fn(),
  verifyEmailCodeTransaction: jest.fn(),
  markUserAsVerified: jest.fn(),
  storeVerificationToken: jest.fn(),
  setRefreshTokenHash: jest.fn(),
  findUserWithRefreshToken: jest.fn(),
  removeRefreshTokenHash: jest.fn(),
};

// 3. TestingModule providers에 AuthRepository mock 추가
{
  provide: AuthRepository,
  useValue: mockAuthRepository,
}

// 4. 테스트에서 PrismaService 대신 AuthRepository mock 사용
expect(mockAuthRepository.setRefreshTokenHash).toHaveBeenCalled();
expect(mockAuthRepository.storeVerificationToken).toHaveBeenCalled();
```

### 앞으로의 테스트 전략

#### 1. Repository 패턴 적용 시 필수 체크리스트

- [ ] **의존성 분석**: Service의 constructor에서 어떤 Repository를 주입받는지 확인
- [ ] **Mock 객체 생성**: Repository의 모든 public 메서드에 대한 jest.fn() mock 생성
- [ ] **TestingModule 설정**: Repository를 providers에 mock으로 추가
- [ ] **테스트 기대값 수정**: PrismaService 호출 대신 Repository 메서드 호출 검증

#### 2. 단계별 테스트 업데이트 가이드

**Step 1: Repository 구현 후 즉시 테스트 수정**

```typescript
// Repository 구현 완료 즉시 해당 Service 테스트 파일 수정
// 1. Repository import 추가
// 2. Mock 객체 생성
// 3. TestingModule providers 업데이트
// 4. 테스트 케이스의 expect 구문 수정
```

**Step 2: Repository별 단위 테스트 추가**

```typescript
// 각 Repository에 대한 독립적인 테스트 파일 생성
// auth.repository.spec.ts, user.repository.spec.ts 등
// PrismaService를 mock하여 Repository 로직만 테스트
```

**Step 3: 통합 테스트 검증**

```typescript
// 전체 모듈이 올바르게 연결되는지 확인
// Service → Repository → Database 플로우 검증
```

#### 3. 테스트 실행 전 검증 체크리스트

- [ ] **의존성 체크**: `pnpm jest --dry-run` 으로 테스트 파일 로딩 확인
- [ ] **Import 검증**: 모든 필요한 import가 있는지 확인
- [ ] **Mock 완성도**: Repository의 모든 사용되는 메서드가 mock되어 있는지 확인
- [ ] **Provider 등록**: TestingModule에 모든 의존성이 등록되어 있는지 확인

#### 4. Repository 패턴 완료 후 테스트 전략

```typescript
// 1. Repository 단위 테스트
describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prisma = module.get(PrismaService);
  });

  // Repository 메서드별 테스트...
});

// 2. Service 단위 테스트 (Repository mock 사용)
describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
  });

  // Service 비즈니스 로직 테스트...
});
```

### 교훈 및 개선사항

1. **리팩토링과 테스트는 동시 진행**: Repository 구현과 동시에 관련 테스트 수정
2. **의존성 변경 시 즉시 테스트 검증**: `pnpm jest [module]` 명령어로 즉시 확인
3. **완전한 Mock 객체**: Repository의 모든 메서드를 포함하는 완전한 mock 생성
4. **계층별 테스트 분리**: Repository 테스트와 Service 테스트를 명확히 분리

## 🚀 ORM 교체 시나리오 예시

### Prisma → TypeORM 교체 시

```typescript
// Interface는 동일하게 유지
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserData): Promise<User>;
}

// TypeORM 구현체로 교체
@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(userData: CreateUserData): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }
}

// Module에서 구현체만 교체
@Module({
  providers: [
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository, // PrismaUserRepository → TypeOrmUserRepository
    },
  ],
})
export class UserModule {}
```

### Service 코드는 전혀 변경 불필요

```typescript
@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository, // Interface 기반이므로 변경 없음
  ) {}

  // 모든 비즈니스 로직은 그대로 유지
}
```

## 🎯 성공 지표

1. **ORM 교체 용이성**: Repository 구현체만 교체하여 ORM 변경 가능
2. **모듈 독립성**: 각 모듈에서 독립적으로 Repository 관리
3. **테스트 커버리지**: Repository 및 Service 계층 테스트 커버리지 90% 이상
4. **성능**: 주요 API 응답 시간 유지 또는 개선

---

_이 계획서는 각 모듈 내에 Repository를 추가하여 ORM 교체가 용이한 구조를 만들기 위한 실용적인 가이드입니다._
