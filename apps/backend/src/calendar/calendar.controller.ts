// src/calendar/calendar.controller.ts
import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GetCalendarDto, GetCompanyHistoryDto } from './dto/get-calendar.dto';
import { CalendarService } from './calendar.service';
import { OptionalJwtAuthGuard } from '../auth/jwt/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';
import { RequestWithUser } from '../common/types/request-with-user';

@ApiTags('캘린더')
@Controller('api/v1/calendar')
@UseGuards(OptionalJwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  /**
   * 관심 추가한 캘린더 이벤트 조회 (로그인 필수)
   * GET /calendar/favorites?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
   */
  @ApiOperation({
    summary: '관심 추가한 캘린더 이벤트 조회',
    description:
      '사용자가 관심 추가한 회사/경제지표의 캘린더 이벤트를 조회합니다. 로그인이 필요합니다.',
  })
  @ApiResponseWrapper(Object)
  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  async getFavoriteCalendarEvents(
    @Query() query: GetCalendarDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.id;

    const startTimestamp = new Date(query.startDate).getTime();
    const endTimestamp = new Date(query.endDate).getTime() + 86400000; // 하루 추가(23:59:59까지 포함)

    return await this.calendarService.getFavoriteCalendarEvents(
      userId,
      startTimestamp,
      endTimestamp,
    );
  }

  /**
   * 모든 이벤트(실적, 배당, 경제지표)를 한 번에 조회
   * GET /calendar/events?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
   */
  @ApiOperation({
    summary: '모든 캘린더 이벤트 조회',
    description: '지정된 기간의 모든 실적, 배당, 경제지표 이벤트를 조회합니다.',
  })
  @ApiResponseWrapper(Object)
  @Get('events')
  async getCalendarEvents(@Query() query: GetCalendarDto, @Request() req) {
    const startTimestamp = new Date(query.startDate).getTime();
    const endTimestamp = new Date(query.endDate).getTime() + 86400000; // 하루 추가(23:59:59까지 포함)

    // req.user가 있으면 userId 전달, 없으면 undefined
    const userId = req.user?.id;
    return await this.calendarService.getCalendarEvents(
      startTimestamp,
      endTimestamp,
      userId,
    );
  }

  /**
   * 실적만 조회
   * GET /calendar/earnings?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
   */
  @ApiOperation({
    summary: '실적 이벤트 조회',
    description: '지정된 기간의 실적 이벤트를 조회합니다.',
  })
  @ApiResponseWrapper(Object)
  @Get('earnings')
  async getEarningsEvents(@Query() query: GetCalendarDto, @Request() req) {
    const startTimestamp = new Date(query.startDate).getTime();
    const endTimestamp = new Date(query.endDate).getTime() + 86400000; // 하루 추가(23:59:59까지 포함)

    const userId = req.user?.id;

    return await this.calendarService.getEarningsEvents(
      startTimestamp,
      endTimestamp,
      userId,
    );
  }

  /**
   * 배당만 조회
   * GET /calendar/dividends?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
   */
  @ApiOperation({
    summary: '배당 이벤트 조회',
    description: '지정된 기간의 배당 이벤트를 조회합니다.',
  })
  @ApiResponseWrapper(Object)
  @Get('dividends')
  async getDividendEvents(@Query() query: GetCalendarDto, @Request() req) {
    const startTimestamp = new Date(query.startDate).getTime();
    const endTimestamp = new Date(query.endDate).getTime() + 86400000; // 하루 추가(23:59:59까지 포함)

    const userId = req.user?.id;

    return await this.calendarService.getDividendEvents(
      startTimestamp,
      endTimestamp,
      userId,
    );
  }

  /**
   * 경제지표만 조회
   * GET /api/v1/calendar/economic-indicators?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
   */
  @ApiOperation({
    summary: '경제지표 이벤트 조회',
    description: '지정된 기간의 경제지표 이벤트를 조회합니다.',
  })
  @ApiResponseWrapper(Object)
  @Get('economic-indicators')
  async getEconomicIndicatorEvents(
    @Query() query: GetCalendarDto,
    @Request() req,
  ) {
    const startTimestamp = new Date(query.startDate).getTime();
    const endTimestamp = new Date(query.endDate).getTime() + 86400000; // 하루 추가(23:59:59까지 포함)

    const userId = req.user?.id;

    return await this.calendarService.getEconomicIndicatorsEvents(
      startTimestamp,
      endTimestamp,
      userId,
    );
  }

  /**
   * 특정 기업의 이전 실적 정보 조회
   * GET /calendar/earnings/history/:companyId?page=1&limit=5
   */
  @ApiOperation({
    summary: '기업 실적 히스토리 조회',
    description: '특정 기업의 이전 실적 정보를 페이지네이션으로 조회합니다.',
  })
  @ApiResponseWrapper(Object)
  @Get('earnings/history/:companyId')
  async getCompanyEarningsHistory(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query() query: GetCompanyHistoryDto,
    @Request() req,
  ) {
    const userId = req.user?.id;

    return await this.calendarService.getCompanyEarningsHistory(
      companyId,
      query.page,
      query.limit,
      userId,
    );
  }

  /**
   * 특정 기업의 이전 배당금 정보 조회
   * GET /calendar/dividends/history/:companyId?page=1&limit=5
   */
  @ApiOperation({
    summary: '기업 배당 히스토리 조회',
    description: '특정 기업의 이전 배당금 정보를 페이지네이션으로 조회합니다.',
  })
  @ApiResponseWrapper(Object)
  @Get('dividends/history/:companyId')
  async getCompanyDividendHistory(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query() query: GetCompanyHistoryDto,
    @Request() req,
  ) {
    const userId = req.user?.id;

    return await this.calendarService.getCompanyDividendHistory(
      companyId,
      query.page,
      query.limit,
      userId,
    );
  }
}
