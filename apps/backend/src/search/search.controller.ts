import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchCompanyDto, SearchIndicatorDto } from './dto/search.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RequestWithUser } from '../common/types/request-with-user';

@ApiTags('검색')
@Controller('api/v1/search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({ summary: '기업 검색' })
  @ApiResponseWrapper(Object, true)
  @Get('companies')
  async searchCompanies(
    @Query() searchDto: SearchCompanyDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.id;

    return await this.searchService.searchCompanies(searchDto, userId);
  }

  @ApiOperation({ summary: '경제지표 검색' })
  @ApiResponseWrapper(Object, true)
  @Get('indicators')
  async searchIndicators(
    @Query() searchDto: SearchIndicatorDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.id;

    return await this.searchService.searchIndicators(searchDto, userId);
  }
}
