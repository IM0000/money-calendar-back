// src/calendar/calendar.controller.ts
import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { GetCalendarDto } from './dto/get-calendar.dto';
import { CalendarService } from './calendar.service';

@Controller('api/v1/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  /**
   * 모든 이벤트(실적, 배당, 경제지표)를 한 번에 조회
   * GET /calendar/events?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
   */
  @Get('events')
  async getAllEvents(@Query() query: GetCalendarDto) {
    const { startDate, endDate } = query;
    // 전달받은 yyyy-mm-dd 형식을 Date 객체로 변환 후, timestamp(밀리초)로 변경
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();

    const earnings = await this.calendarService.getEarningsEvents(
      startTimestamp,
      endTimestamp,
    );
    const dividends = await this.calendarService.getDividendEvents(
      startTimestamp,
      endTimestamp,
    );
    const economicIndicators =
      await this.calendarService.getEconomicIndicatorsEvents(
        startTimestamp,
        endTimestamp,
      );

    return {
      earnings,
      dividends,
      economicIndicators,
    };
  }

  /**
   * 실적만 조회
   * GET /calendar/earnings?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
   */
  @Get('earnings')
  async getEarnings(@Query() query: GetCalendarDto) {
    const { startDate, endDate } = query;
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
    return await this.calendarService.getEarningsEvents(
      startTimestamp,
      endTimestamp,
    );
  }

  /**
   * 배당만 조회
   * GET /calendar/dividends?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
   */
  @Get('dividends')
  async getDividends(@Query() query: GetCalendarDto) {
    const { startDate, endDate } = query;
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
    return await this.calendarService.getDividendEvents(
      startTimestamp,
      endTimestamp,
    );
  }

  /**
   * 경제지표만 조회
   * GET /calendar/economic-indicators?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
   */
  @Get('economic-indicators')
  async getEconomicIndicators(@Query() query: GetCalendarDto) {
    const { startDate, endDate } = query;
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
    return await this.calendarService.getEconomicIndicatorsEvents(
      startTimestamp,
      endTimestamp,
    );
  }

  /**
   * 특정 기업의 이전 실적 정보 조회
   * GET /calendar/earnings/history/:companyId?page=1&limit=5
   */
  @Get('earnings/history/:companyId')
  async getCompanyEarningsHistory(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return await this.calendarService.getCompanyEarningsHistory(
      companyId,
      page,
      limit,
    );
  }
}
