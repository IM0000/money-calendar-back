import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('api/v1/companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get(':id/earnings')
  async getCompanyEarnings(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: 1,
    @Query('limit') limit: 5,
    @Request() req,
  ) {
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
    const userId = req.user?.id;
    return this.companiesService.getCompanyDividends(id, page, limit, userId);
  }
}
