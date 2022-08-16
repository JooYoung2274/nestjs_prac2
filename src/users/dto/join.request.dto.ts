import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from 'src/entities/Users';

// PickType은 entities에 있는 것을 DTO로 사용하고 싶을때 씀
export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}

// // OAUTH 사용할 떄
// export class JoinRequestDto {
//   @ApiProperty({
//     example: 'joo@gamil.com',
//     description: '이메일',
//     required: true,
//   })
//   public email: string;

//   @ApiProperty({
//     description: '구글 토큰',
//     required: true,
//   })
//   public accessToken: string;
// }
