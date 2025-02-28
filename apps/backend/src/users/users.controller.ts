import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto, UserDto } from '../auth/dto/users.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    console.log(updatePasswordDto);
    await this.usersService.updateUserPassword(
      updatePasswordDto.email,
      updatePasswordDto.password,
    );
    return { message: 'success' };
  }

  @Post('/email')
  async getUserByEmail(@Body('email') email: string): Promise<UserDto | null> {
    return this.usersService.findUserByEmail(email);
  }
}
