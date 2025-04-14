import { ApiProperty } from '@nestjs/swagger';

export class JwtPayload {
  @ApiProperty({ description: 'User ID' })
  sub: string;

  @ApiProperty({ description: 'Username' })
  username: string;
}
