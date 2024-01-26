import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WebhookSubscribeDto } from './dto/webhookSubscribe.dto';
import { WebhookEventContent } from './schemas/webhookEventContent.schema';
import { WebhookEvent } from './schemas/webhookEvent.schema';
import { Model } from 'mongoose';
import { WebhookUnsubscribeDto } from './dto/webhookUnsubscribe.dto';
import { SocketGateway } from 'src/socket/socket.gateway';
import * as mongoose from 'mongoose';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectModel(WebhookEvent.name)
    private webhookEventModel: Model<WebhookEvent>,
    @InjectModel(WebhookEventContent.name)
    private webhookEventContentModel: Model<WebhookEventContent>,
    private readonly socketGateway: SocketGateway,
  ) {}

  async subscribe(userId: string, webhookokSubscribeDto: WebhookSubscribeDto) {
    //write logic to subscribe to that source url

    const { sourceUrl, callbackUrl } = webhookokSubscribeDto;

    const createWebhookEvent = new this.webhookEventModel({
      sourceUrl,
      callbackUrl,
      userId,
    });

    return await createWebhookEvent.save();
  }

  async unsubscribe(userId, webhookUnsubscribeDto: WebhookUnsubscribeDto) {
    const { sourceUrl, callbackUrl } = webhookUnsubscribeDto;

    await this.webhookEventModel.deleteOne({
      sourceUrl,
      callbackUrl,
      userId,
    });

    return 'Webhook successfully unsubscribed';
  }

  async listAll(userId) {
    const subscribedWebhooks = await this.webhookEventModel.find({
      userId,
    });

    let subscribedWebhookSourceUrls = [];

    subscribedWebhooks.forEach((subscribedWebhook) => {
      subscribedWebhookSourceUrls.push({
        sourceUrl: subscribedWebhook.sourceUrl,
        callbackUrl: subscribedWebhook.callbackUrl,
      });
    });

    return subscribedWebhookSourceUrls;
  }

  async listener(sourceUrl: string, content: any) {
    //insert into db
    const webhookEvent = await this.webhookEventModel.findOne({
      sourceUrl,
    });

    if (!webhookEvent) {
      return 'invalid webhook event';
    }

    const createWebhookEventContent = new this.webhookEventContentModel({
      webhookEventId: webhookEvent._id,
      content,
    });

    await createWebhookEventContent.save();

    //send real-time update
    let socketId = SocketGateway.userMap.get(webhookEvent.userId.toString());

    this.socketGateway.io
      .to(socketId)
      .emit('message', { type: 'newWebhookEvent', content, sourceUrl });
  }

  async getWebhooksDetails(userId: string) {
    const webhookEventDocuments = await this.webhookEventModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'webhookeventcontents',
          localField: '_id',
          foreignField: 'webhookEventId',
          as: 'contents',
        },
      },
      {
        $project: {
          'contents.content': 1,
          sourceUrl: 1,
          callbackUrl: 1,
        },
      },
    ]);

    // console.log('webhookEventDocuments: ', webhookEventDocuments, userId);
    return { webhookDetails: webhookEventDocuments };
  }
}
