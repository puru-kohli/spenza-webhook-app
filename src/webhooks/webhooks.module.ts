import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

import {
  WebhookEventContent,
  WebhookEventContentSchema,
} from './schemas/webhookEventContent.schema';
import {
  WebhookEvent,
  WebhookEventSchema,
} from './schemas/webhookEvent.schema';

import { User, UserSchema } from '../auth/schemas/user.schema';
import { SocketGateway } from 'src/socket/socket.gateway';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: WebhookEvent.name,
        useFactory: () => {
          const schema = WebhookEventSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: WebhookEventContent.name, schema: WebhookEventContentSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService, SocketGateway],
})
export class WebhooksModule {}
