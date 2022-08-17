import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "jooSpace",
    description: "워크스페이스 이름",
  })
  public workspace: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "https://dfdfe.com",
    description: "워크스페이스 주소",
  })
  public url: string;
}
