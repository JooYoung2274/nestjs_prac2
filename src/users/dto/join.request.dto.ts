import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  @ApiProperty({
    example: 'joo@gamil.com',
    description: '이메일',
    required: true,
  })
  public email: string;

  @ApiProperty({
    description: '구글 토큰',
    required: true,
  })
  public accessToken: string;
}
