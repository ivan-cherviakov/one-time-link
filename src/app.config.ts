import { IsString, IsNumber, Min, Max, validateSync } from 'class-validator'
import { plainToInstance } from 'class-transformer'

export class AppConfig {
  @IsString()
  MONGO_URL: string

  @IsNumber()
  @Min(1024)
  @Max(65_534)
  PORT: number
}

export function validateConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(AppConfig, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, { skipMissingProperties: false })
  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}
