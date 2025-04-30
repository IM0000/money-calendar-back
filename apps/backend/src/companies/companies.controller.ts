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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';

@ApiTags('회사')
@ApiBearerAuth('JWT-auth')
@Controller('api/v1/companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiOperation({ summary: '회사 실적 정보 조회' })
  @ApiParam({ name: 'id', description: '회사 ID' })
  @ApiQuery({
    name: 'page',
    description: '페이지 번호',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: '페이지당 항목 수',
    required: false,
    type: Number,
  })
  @ApiResponseWrapper(Object, true)
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

  @ApiOperation({ summary: '회사 배당 정보 조회' })
  @ApiParam({ name: 'id', description: '회사 ID' })
  @ApiQuery({
    name: 'page',
    description: '페이지 번호',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: '페이지당 항목 수',
    required: false,
    type: Number,
  })
  @ApiResponseWrapper(Object, true)
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
