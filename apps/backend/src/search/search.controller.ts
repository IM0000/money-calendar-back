import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchCompanyDto, SearchIndicatorDto } from './dto/search.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('api/v1/search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * 기업 검색
   * GET /search/companies?query=apple&country=US&page=1&limit=10
   */
  @Get('companies')
  async searchCompanies(@Query() searchDto: SearchCompanyDto) {
    return this.searchService.searchCompanies(searchDto);
  }

  /**
   * 경제지표 검색
   * GET /search/indicators?query=cpi&country=US&page=1&limit=10
   */
  @Get('indicators')
  async searchIndicators(@Query() searchDto: SearchIndicatorDto) {
    return this.searchService.searchIndicators(searchDto);
  }
}
