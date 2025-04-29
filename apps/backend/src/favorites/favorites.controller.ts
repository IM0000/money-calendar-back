import {
  Controller,
  Post,
  Delete,
  Get,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Request } from 'express';
import { FavoritesService } from './favorites.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiResponseWrapper } from '../common/decorators/api-response.decorator';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
  };
}

@ApiTags('즐겨찾기')
@ApiBearerAuth('JWT-auth')
@Controller('api/v1/favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: '모든 즐겨찾기 항목 조회' })
  @ApiResponseWrapper(Object, true)
  @Get()
  async getAllFavorites(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.favoritesService.getAllFavorites(userId);
  }

  @ApiOperation({ summary: '즐겨찾기 캘린더 이벤트 조회' })
  @ApiQuery({
    name: 'startDate',
    description: '시작 날짜 (YYYY-MM-DD)',
    example: '2023-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: '종료 날짜 (YYYY-MM-DD)',
    example: '2023-12-31',
  })
  @ApiResponseWrapper(Object, true)
  @Get('calendar')
  async getFavoriteCalendarEvents(
    @Req() req: RequestWithUser,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const userId = req.user.id;
    // 전달받은 yyyy-mm-dd 형식을 Date 객체로 변환 후, timestamp(밀리초)로 변경
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();

    return this.favoritesService.getFavoriteCalendarEvents(
      userId,
      startTimestamp,
      endTimestamp,
    );
  }

  @ApiOperation({ summary: '실적 즐겨찾기 추가' })
  @ApiParam({ name: 'id', description: '실적 ID' })
  @ApiResponseWrapper(Object)
  @Post('/earnings/:id')
  async addFavoriteEarnings(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) earningsId: number,
  ) {
    const userId = req.user.id;
    return this.favoritesService.addFavoriteEarnings(userId, earningsId);
  }

  @ApiOperation({ summary: '실적 즐겨찾기 삭제' })
  @ApiParam({ name: 'id', description: '실적 ID' })
  @ApiResponseWrapper(Object)
  @Delete('/earnings/:id')
  async removeFavoriteEarnings(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) earningsId: number,
  ) {
    const userId = req.user.id;
    return this.favoritesService.removeFavoriteEarnings(userId, earningsId);
  }

  @ApiOperation({ summary: '배당 즐겨찾기 추가' })
  @ApiParam({ name: 'id', description: '배당 ID' })
  @ApiResponseWrapper(Object)
  @Post('/dividends/:id')
  async addFavoriteDividends(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) dividendId: number,
  ) {
    const userId = req.user.id;
    return this.favoritesService.addFavoriteDividends(userId, dividendId);
  }

  @ApiOperation({ summary: '배당 즐겨찾기 삭제' })
  @ApiParam({ name: 'id', description: '배당 ID' })
  @ApiResponseWrapper(Object)
  @Delete('/dividends/:id')
  async removeFavoriteDividends(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) dividendId: number,
  ) {
    const userId = req.user.id;
    return this.favoritesService.removeFavoriteDividends(userId, dividendId);
  }

  @ApiOperation({ summary: '경제지표 즐겨찾기 추가' })
  @ApiParam({ name: 'id', description: '경제지표 ID' })
  @ApiResponseWrapper(Object)
  @Post('/economic-indicators/:id')
  async addFavoriteIndicator(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) indicatorId: number,
  ) {
    const userId = req.user.id;
    return this.favoritesService.addFavoriteIndicator(userId, indicatorId);
  }

  @ApiOperation({ summary: '경제지표 즐겨찾기 삭제' })
  @ApiParam({ name: 'id', description: '경제지표 ID' })
  @ApiResponseWrapper(Object)
  @Delete('/economic-indicators/:id')
  async removeFavoriteIndicator(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) indicatorId: number,
  ) {
    const userId = req.user.id;
    return this.favoritesService.removeFavoriteIndicator(userId, indicatorId);
  }
}
