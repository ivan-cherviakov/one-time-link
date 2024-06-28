import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

export class GenerateBodyDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  contents: string
}
