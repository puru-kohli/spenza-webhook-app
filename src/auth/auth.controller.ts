import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  //   @HttpCode(HttpStatus.OK)
  @Post('login')
  logIn(@Body() logInDto: UserDto) {
    return this.authService.logIn(logInDto.username, logInDto.password);
  }

  @Public()
  @Post('signup')
  signUp(@Body() signUpDto: UserDto) {
    return this.authService.signUp(signUpDto.username, signUpDto.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get()
  findAll() {
    return [];
  }
}
