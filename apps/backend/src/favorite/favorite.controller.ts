import {
  Controller,
  Post,
  Delete,
  Get,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { FavoriteService } from './favorite.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';
import { FavoriteIndicatorGroupDto } from './dto/favorite-indicator-group.dto';
import { FavoriteCompanyDto } from './dto/favorite-company.dto';
import { RequestWithUser } from '../common/types/request-with-user';

@ApiTags('즐겨찾기')
@Controller('api/v1/favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(private readonly favoritesService: FavoriteService) {}

  @ApiOperation({ summary: '모든 즐겨찾기 항목 조회' })
  @ApiResponseWrapper(Object, true)
  @Get()
  async getAllFavorites(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.favoritesService.getAllFavorites(userId);
  }

  @ApiOperation({ summary: '회사 즐겨찾기 추가' })
  @ApiParam({ name: 'id', description: '회사 ID' })
  @ApiResponseWrapper(Object)
  @Post('/companies/:id')
  async addFavoriteCompany(
    @Req() req: RequestWithUser,
    @Body() body: FavoriteCompanyDto,
  ) {
    const userId = req.user.id;
    return await this.favoritesService.addFavoriteCompany(
      userId,
      body.companyId,
    );
  }

  @ApiOperation({ summary: '회사 즐겨찾기 해제' })
  @ApiParam({ name: 'id', description: '회사 ID' })
  @ApiResponseWrapper(Object)
  @Delete('/companies/:id')
  async removeFavoriteCompany(
    @Req() req: RequestWithUser,
    @Body() body: FavoriteCompanyDto,
  ) {
    const userId = req.user.id;
    return await this.favoritesService.removeFavoriteCompany(
      userId,
      body.companyId,
    );
  }

  @ApiOperation({ summary: '지표 그룹 즐겨찾기 추가' })
  @ApiBody({
    schema: {
      properties: { baseName: { type: 'string' }, country: { type: 'string' } },
    },
  })
  @ApiResponseWrapper(Object)
  @Post('/indicator-groups')
  async addFavoriteIndicatorGroup(
    @Req() req: RequestWithUser,
    @Body() body: FavoriteIndicatorGroupDto,
  ) {
    const userId = req.user.id;
    return await this.favoritesService.addFavoriteIndicatorGroup(
      userId,
      body.baseName,
      body.country,
    );
  }

  @ApiOperation({ summary: '지표 그룹 즐겨찾기 해제' })
  @ApiBody({
    schema: {
      properties: { baseName: { type: 'string' }, country: { type: 'string' } },
    },
  })
  @ApiResponseWrapper(Object)
  @Delete('/indicator-groups')
  async removeFavoriteIndicatorGroup(
    @Req() req: RequestWithUser,
    @Body() body: FavoriteIndicatorGroupDto,
  ) {
    const userId = req.user.id;
    return await this.favoritesService.removeFavoriteIndicatorGroup(
      userId,
      body.baseName,
      body.country,
    );
  }
}
