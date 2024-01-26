import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type WebhookEventDocument = mongoose.HydratedDocument<WebhookEvent>;

@Schema()
export class WebhookEvent {
  @Prop()
  sourceUrl: string;

  @Prop()
  callbackUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
}

export const WebhookEventSchema = SchemaFactory.createForClass(WebhookEvent);

// WebhookEventSchema.virtual('contents', {
//   ref: 'WebhookEventContent',
//   localField: '_id',
//   foreignField: 'webhookEventId',
// });
