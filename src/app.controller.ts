import { Body, Controller, createParamDecorator, ExecutionContext, Get, Post, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { getSubdomain } from 'tldts';
import { AppService, User } from './app.service';
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
  async registerUser(@Subdomain() subdomain: 'vinoth' | 'vijay' | 'johny', @PlainBody() data: User & { registerFrom: 'CLIENT' | 'ADMIN' }) {
    console.log('payload data from req: ', data);
    const { registerFrom, org, ...rest } = data;
    const registerUserData = { ...rest, org: registerFrom == 'ADMIN' ? org : subdomain };
    const result = await this.appService.registerUser(registerUserData);
    return {
      success: result != null,
      data: result
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
}
