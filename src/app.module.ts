import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { SocketGateway } from './socket/socket.gateway';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    AuthModule,
    WebhooksModule,
    MongooseModule.forRoot('mongodb://localhost/spenza'),
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
