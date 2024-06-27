import { IsString, IsNumber, Min, Max } from 'class-validator'

export class AppConfig {
  @IsString()
  MONGO_URL: string

  @IsNumber()
  @Min(1024)
  @Max(65_534)
  PORT: number
}
