import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { SocketController } from './socket.controller';
import { SocketService } from './socket.service';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [SocketController],
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
