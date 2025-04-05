import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('api/v1/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get(':id/earnings')
  async getCompanyEarnings(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: 1,
    @Query('limit') limit: 5,
    @Request() req,
  ) {
    // 인증된 사용자가 있다면 ID 추출
    const userId = req.user?.id;
    return this.companiesService.getCompanyEarnings(id, page, limit, userId);
  }

  @Get(':id/dividends')
  async getCompanyDividends(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: 1,
    @Query('limit') limit: 5,
    @Request() req,
  ) {
    // 인증된 사용자가 있다면 ID 추출
    const userId = req.user?.id;
    return this.companiesService.getCompanyDividends(id, page, limit, userId);
  }
}
