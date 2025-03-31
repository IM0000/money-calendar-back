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

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
  };
}

@Controller('api/v1/favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAllFavorites(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.favoritesService.getAllFavorites(userId);
  }

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

  @Post('/earnings/:id')
  async addFavoriteEarnings(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) earningsId: number,
  ) {
    const userId = req.user.id;
    return this.favoritesService.addFavoriteEarnings(userId, earningsId);
  }

  @Delete('/earnings/:id')
  async removeFavoriteEarnings(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) earningsId: number,
  ) {
    const userId = req.user.id;
    return this.favoritesService.removeFavoriteEarnings(userId, earningsId);
  }

  @Post('/dividends/:id')
  async addFavoriteDividends(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) dividendId: number,
  ) {
    const userId = req.user.id;
    return this.favoritesService.addFavoriteDividends(userId, dividendId);
  }

  @Delete('/dividends/:id')
  async removeFavoriteDividends(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) dividendId: number,
  ) {
    const userId = req.user.id;
    return this.favoritesService.removeFavoriteDividends(userId, dividendId);
  }

  @Post('/indicators/:id')
  async addFavoriteIndicator(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) indicatorId: number,
  ) {
    const userId = req.user.id;
    return this.favoritesService.addFavoriteIndicator(userId, indicatorId);
  }

  @Delete('/indicators/:id')
  async removeFavoriteIndicator(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) indicatorId: number,
  ) {
    const userId = req.user.id;
    return this.favoritesService.removeFavoriteIndicator(userId, indicatorId);
  }
}
