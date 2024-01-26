import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { WebhookEvent } from './webhookEvent.schema';

interface IMeta {
  [index: string]: string | number | boolean | object | undefined;
}

export type WebhookEventContentDocument =
  mongoose.HydratedDocument<WebhookEventContent>;

@Schema()
export class WebhookEventContent {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'WebhookEvent' })
  webhookEventId: WebhookEvent;

  @Prop({ type: Map })
  content: IMeta;
}

export const WebhookEventContentSchema =
  SchemaFactory.createForClass(WebhookEventContent);
