import { Body, Controller, Post } from '@nestjs/common';
import { SocketService } from './socket.service';

@Controller('socket')
export class SocketController {
  constructor(private webhooksService: SocketService) {}

  @Post('registerUser')
  async registerUser(@Body() body: any) {
    const { username, socketId } = body;
    return await this.webhooksService.registerUser(username, socketId);
  }
}
