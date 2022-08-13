import { ApiProperty } from '@nestjs/swagger';
import { JoinRequestDto } from 'src/users/dto/join.request.dto';

// 공통으로 사용하는 것들은 따로 빼둠
export class UserDto extends JoinRequestDto {
  @ApiProperty({
    example: 1,
    description: '아이디',
    required: true,
  })
  id: number;
}
