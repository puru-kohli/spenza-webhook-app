import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() io: Server;

  static userMap = new Map();

  afterInit() {
    console.log('Initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    // console.log(`Client id: ${client.id} connected`);
    // console.log(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    // console.log(`Cliend id:${client.id} disconnected`);
  }

  // @SubscribeMessage('newUser')
  // handleMessage(client: any, data: any) {
  //   console.log(`Message received from client id: ${client.id}`);
  //   console.log(`Payload: ${JSON.stringify(data)}`);

  //   this.userMap.set(data.username, client.id);
  //   return {
  //     event: 'pong',
  //     data,
  //   };
  // }
}
