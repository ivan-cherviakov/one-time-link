import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document } from 'mongoose'

import { IOneTimeLink } from './one-time-link.types'

export type OneTimeLinkDocument = IOneTimeLink & Document

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class OneTimeLink {
  @Prop({ required: true })
  contents: string

  @Prop({ required: true, unique: true })
  token: string

  @Prop({ default: true })
  is_active: boolean

  @Prop()
  created?: Date

  @Prop()
  updated?: Date
}

export const OneTimeLinkSchema = SchemaFactory.createForClass(OneTimeLink)
OneTimeLinkSchema.index(
  { contents: 1 },
  { unique: true, partialFilterExpression: { is_active: true } },
)

export const OneTimeLinkModelDefinition = {
  name: OneTimeLink.name,
  schema: OneTimeLinkSchema,
}
