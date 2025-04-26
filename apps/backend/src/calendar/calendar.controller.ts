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
import { OptionalJwtAuthGuard } from '../auth/guard/optional-jwt-auth.guard';

@Controller('api/v1/calendar')
@UseGuards(OptionalJwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  /**
   * 모든 이벤트(실적, 배당, 경제지표)를 한 번에 조회
   * GET /calendar/events?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
   */
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
