import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async registerUser(username: string, socketId: string) {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new BadRequestException('user not found');
    }

    SocketGateway.userMap.set(user._id.toString(), socketId);

    return 'User registered successfully';
  }
}
