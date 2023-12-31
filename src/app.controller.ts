import { Body, Controller, createParamDecorator, ExecutionContext, Get, Post, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { getSubdomain } from 'tldts';
import { AppService, NotificationPayload } from './app.service';
import { UserType } from './user.model';
var rawbody = require('raw-body')

const Subdomain = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const subdomain = getSubdomain(request.headers.origin);
    return subdomain ?? 'vinoth';
  },
);

export const PlainBody = createParamDecorator(async (_, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest<import("express").Request>();
  if (!req.readable) { throw new BadRequestException("Invalid body"); }
  const body = (await rawbody(req)).toString("utf8").trim();
  return JSON.parse(body);
})

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/users')
  async getUsers() {
    const result = await this.appService.getUsers();
    return {
      success: true,
      data: result
    }
  }

  @Post('/register')
  async registerUser(@Subdomain() subdomain: 'vinoth' | 'vijay' | 'johny', @PlainBody() data: UserType & { registerFrom: 'CLIENT' | 'ADMIN' }) {
    const { registerFrom, org, ...rest } = data;
    const registerUserData = { ...rest, org: registerFrom == 'ADMIN' ? org : subdomain };
    try {
      const result = await this.appService.registerUser(registerUserData);
      return {
        success: result != null,
        data: result
      }
    } catch(e) {
      return {
        success: false,
        message: 'RECORD_EXIST'
      }
    }
  }

  @Post('/login')
  async loginUser(@Subdomain() subdomain: 'vinoth' | 'vijay' | 'johny', @PlainBody() data: { email: string }) {
    const result = await this.appService.loginUser(data.email, subdomain);
    return {
      success: result != null,
      data: result
    }
  }

  @Post('/notify')
  async notify(@PlainBody() data: NotificationPayload) {
    const result = await this.appService.notify(data);
    const isSucceeded = result.length > 1 || result[0].success;
    return {
      success: isSucceeded,
      data: result
    }
  }
}
