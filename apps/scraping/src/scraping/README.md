# 스크래핑 모듈 예외 처리 가이드

이 문서는 스크래핑 모듈에서 발생할 수 있는 다양한 예외 상황을 처리하는 방법과 사용 가능한 도구들에 대해 설명합니다.

## 목차

1. [소개](#소개)
2. [예외 클래스](#예외-클래스)
3. [예외 필터](#예외-필터)
4. [로깅 인터셉터](#로깅-인터셉터)
5. [오류 처리 유틸리티](#오류-처리-유틸리티)
6. [사용 예시](#사용-예시)

## 소개

스크래핑 작업은 외부 웹사이트에 의존하기 때문에 다양한 오류가 발생할 수 있습니다:

- 네트워크 연결 오류
- 타임아웃
- 웹페이지 구조 변경
- 파싱 오류
- 접근 차단 (캡챠, IP 차단 등)

이러한 오류들을 체계적으로 처리하기 위해 다음 구성 요소들을 구현했습니다.

## 예외 클래스

특정 유형의 스크래핑 오류를 표현하기 위한 커스텀 예외 클래스들:

- **ScrapingException**: 모든 스크래핑 예외의 기본 클래스
- **NetworkException**: 네트워크 연결 오류
- **ElementNotFoundException**: 웹페이지에서 요소를 찾을 수 없는 경우
- **TimeoutException**: 요청 시간 초과
- **ParsingException**: 데이터 파싱 오류
- **WebsiteStructureChangedException**: 웹사이트 구조 변경
- **AccessBlockedException**: 웹사이트 접근 차단

이 클래스들은 `src/common/exceptions/scraping.exceptions.ts`에 정의되어 있습니다.

## 예외 필터

`AllExceptionsFilter`는 애플리케이션에서 발생하는 모든 예외를 가로채 일관된 형식의 응답으로 변환합니다. 각 예외마다 적절한 HTTP 상태 코드와 오류 메시지를 설정합니다.

파일 위치: `src/common/filters/all-exceptions.filter.ts`

## 로깅 인터셉터

`ScrapingLoggingInterceptor`는 모든 스크래핑 작업의 시작, 완료, 실패를 로그로 기록합니다. 각 요청마다 고유한 ID를 생성하고 소요 시간을 측정합니다.

파일 위치: `src/common/interceptors/scraping-logging.interceptor.ts`

## 오류 처리 유틸리티

`ScrapingErrorHandler` 클래스는 다양한 오류 처리 유틸리티 함수를 제공합니다:

- **handleError**: 일반 오류를 적절한 스크래핑 예외로 변환
- **executeWithErrorHandling**: try-catch 패턴을 단순화하는 래퍼 함수
- **executeWithRetry**: 재시도 로직이 포함된 오류 처리 래퍼 함수

파일 위치: `src/common/utils/scraping-error-handler.util.ts`

## 사용 예시

### 일반적인 스크래핑 메서드에서 사용하기

```typescript
import { ScrapingErrorHandler } from '../common/utils/scraping-error-handler.util';
import { ElementNotFoundException } from '../common/exceptions/scraping.exceptions';

export class SomeScrapingService {
  async scrapeData(url: string): Promise<any> {
    return ScrapingErrorHandler.executeWithErrorHandling(
      async () => {
        // 스크래핑 로직...
        const response = await axios.get(url);

        // 요소를 찾지 못한 경우 직접 예외 던지기
        const importantElement = this.findElement(response.data);
        if (!importantElement) {
          throw new ElementNotFoundException('중요 요소를 찾을 수 없습니다', {
            url,
            selector: '.important-class',
          });
        }

        return this.parseData(response.data);
      },
      { url },
    );
  }
}
```

### 재시도 로직 활용하기

```typescript
async scrapeWithRetry(url: string): Promise<any> {
  return ScrapingErrorHandler.executeWithRetry(
    async () => {
      // 스크래핑 로직...
      return await axios.get(url).then(res => this.parseData(res.data));
    },
    {
      maxRetries: 3,          // 최대 재시도 횟수
      delayMs: 2000,          // 재시도 사이 지연 시간 (ms)
      retryableErrors: [      // 재시도 가능한 오류 유형
        'NETWORK_ERROR',
        'REQUEST_TIMEOUT',
        'ACCESS_BLOCKED'
      ]
    },
    { url }
  );
}
```

이러한 도구들을 활용하면 스크래핑 작업을 더 견고하게 구현하고, 오류 발생 시 사용자에게 명확한 정보를 제공할 수 있습니다.
