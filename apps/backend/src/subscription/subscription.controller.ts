import {
  Controller,
  Put,
  Delete,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RequestWithUser } from '../common/types/request-with-user';
import { SubscriptionIndicatorGroupDto } from './dto/subscription-indicator-group.dto';
import { SubscriptionCompanyDto } from './dto/subscription-company.dto';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';

@ApiTags('Subscriptions (구독 관리)')
@UseGuards(JwtAuthGuard)
@Controller('api/v1/subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '회사 구독 등록',
    description: '특정 회사 구독. 회사가 존재하지 않으면 404 반환.',
  })
  @ApiParam({ name: 'companyId', type: Number, description: 'Company ID' })
  @ApiResponseWrapper(Object)
  @Put('companies/:companyId')
  async subscribeCompany(
    @Req() req: RequestWithUser,
    @Body() dto: SubscriptionCompanyDto,
  ): Promise<void> {
    const userId = req.user.id;
    return this.subscriptionService.subscribeCompany(userId, dto.companyId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '회사 구독 해제',
    description:
      '특정 회사 구독 해제. 구독 정보가 없거나 이미 해제된 경우 404 반환.',
  })
  @ApiParam({ name: 'companyId', type: Number, description: 'Company ID' })
  @ApiResponseWrapper(Object)
  @Delete('companies/:companyId')
  async unsubscribeCompany(
    @Req() req: RequestWithUser,
    @Body() dto: SubscriptionCompanyDto,
  ): Promise<void> {
    const userId = req.user.id;
    return this.subscriptionService.unsubscribeCompany(userId, dto.companyId);
  }

  @ApiOperation({
    summary: '사용자 회사 구독 목록 조회',
    description: '사용자가 구독 중인 회사 목록을 조회합니다.',
  })
  @ApiResponseWrapper(Object, true)
  @Get('companies')
  async getSubscriptionCompanies(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.subscriptionService.getSubscriptionCompanies(userId);
  }

  @ApiOperation({
    summary: '특정 회사 구독 여부 확인',
    description: '특정 회사에 대해 사용자가 구독 중인지 여부를 반환합니다.',
  })
  @ApiParam({ name: 'companyId', type: Number, description: 'Company ID' })
  @ApiResponseWrapper(Boolean)
  @Get('companies/:companyId/subscribed')
  async isCompanySubscribed(
    @Req() req: RequestWithUser,
    @Body() dto: SubscriptionCompanyDto,
  ): Promise<boolean> {
    const userId = req.user.id;
    return this.subscriptionService.isCompanySubscribed(userId, dto.companyId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '지표 그룹 구독 등록',
    description: '특정 지표 그룹 구독. 지표 그룹이 존재하지 않으면 404 반환.',
  })
  @ApiResponseWrapper(Object)
  @Put('indicator-groups')
  async subscribeIndicatorGroup(
    @Req() req: RequestWithUser,
    @Body() dto: SubscriptionIndicatorGroupDto,
  ): Promise<void> {
    const userId = req.user.id;
    return this.subscriptionService.subscribeIndicatorGroup(
      userId,
      dto.baseName,
      dto.country,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '지표 그룹 구독 해제',
    description:
      '특정 지표 그룹 구독 해제. 구독 정보가 없거나 이미 해제된 경우 404 반환.',
  })
  @ApiResponseWrapper(Object)
  @Delete('indicator-groups')
  async unsubscribeIndicatorGroup(
    @Req() req: RequestWithUser,
    @Body() dto: SubscriptionIndicatorGroupDto,
  ): Promise<void> {
    const userId = req.user.id;
    return this.subscriptionService.unsubscribeIndicatorGroup(
      userId,
      dto.baseName,
      dto.country,
    );
  }

  @ApiOperation({
    summary: '사용자 지표 그룹 구독 목록 조회',
    description: '사용자가 구독 중인 지표 그룹 목록을 조회합니다.',
  })
  @ApiResponseWrapper(Object, true)
  @Get('indicator-groups')
  async getSubscriptionIndicatorGroups(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.subscriptionService.getSubscriptionIndicatorGroups(userId);
  }

  @ApiOperation({
    summary: '특정 지표 그룹 구독 여부 확인',
    description:
      '특정 지표 그룹에 대해 사용자가 구독 중인지 여부를 반환합니다.',
  })
  @ApiResponseWrapper(Boolean)
  @Get('indicator-groups/subscribed')
  async isIndicatorGroupSubscribed(
    @Req() req: RequestWithUser,
    @Query() query: SubscriptionIndicatorGroupDto,
  ): Promise<boolean> {
    const userId = req.user.id;
    return this.subscriptionService.isIndicatorGroupSubscribed(
      userId,
      query.baseName,
      query.country,
    );
  }
}
