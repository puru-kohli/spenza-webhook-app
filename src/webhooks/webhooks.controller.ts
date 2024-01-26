import { Body, Controller, Get, Post, Request, Headers } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhookSubscribeDto } from './dto/webhookSubscribe.dto';
import { WebhookUnsubscribeDto } from './dto/webhookUnsubscribe.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('subscribe')
  async subscribe(
    @Request() req,
    @Body() webhookokSubscribeDto: WebhookSubscribeDto,
  ) {
    return await this.webhooksService.subscribe(
      req.user.sub,
      webhookokSubscribeDto,
    );
  }

  @Get('listall')
  listAll(@Request() req) {
    return this.webhooksService.listAll(req.user.sub);
  }

  @Post('unsubscribe')
  async unsubscribe(
    @Request() req,
    @Body() webhookokUnsubscribeDto: WebhookUnsubscribeDto,
  ) {
    return await this.webhooksService.unsubscribe(
      req.user.sub,
      webhookokUnsubscribeDto,
    );
  }

  @Public()
  @Post('listener')
  listener(@Request() req, @Body() content: any) {
    const sourceUrl = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    this.webhooksService.listener(sourceUrl, content);

    return 'webhook event successfully added';
  }

  @Get('webhooksDetails')
  webhooksDetails(@Request() req) {
    return this.webhooksService.getWebhooksDetails(req.user.sub);
  }
}
