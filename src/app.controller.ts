import { Body, Controller, createParamDecorator, ExecutionContext, Get, Post } from '@nestjs/common';
import { getSubdomain } from 'tldts';
import { AppService, User } from './app.service';

const Subdomain = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const subdomain = getSubdomain(request.headers.origin);
    return subdomain ?? 'vinoth';
  },
);

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
  async registerUser(@Subdomain() subdomain: 'vinoth' | 'vijay' | 'johny', @Body() data: User & { registerFrom: 'CLIENT' | 'ADMIN' }) {
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
  async loginUser(@Subdomain() subdomain: 'vinoth' | 'vijay' | 'johny', @Body() data: { email: string }) {
    const result = await this.appService.loginUser(data.email, subdomain);
    return {
      success: result != null,
      data: result
    }
  }
}
