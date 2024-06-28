import { IsString, IsNotEmpty, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GenerateBodyDTO {
  @ApiProperty({
    description: 'contents string for which one time link generated',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  contents: string
}
