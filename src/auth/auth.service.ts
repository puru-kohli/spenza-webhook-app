import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';

const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async logIn(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('invalid password!');
    } else {
      const payload = { sub: user._id, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }

  async signUp(username: string, password: string): Promise<any> {
    const usernameExists = await this.userModel.exists({ username });

    if (usernameExists) {
      throw new UnauthorizedException('username already exists');
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const createdUser = new this.userModel({
      username,
      password: hashPassword,
    });
    return createdUser.save();
  }
}
