import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ nullable: true })
  errorCode: string | null;

  @ApiProperty({ nullable: true })
  errorMessage: string | null;

  @ApiProperty()
  data: T;
}
