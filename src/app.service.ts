import { Injectable } from '@nestjs/common';

export interface User {
  id: string,
  name: string,
  email: string,
  org: 'vinoth' | 'vijay' | 'johny'
}

@Injectable()
export class AppService {
  users: User[] = [];

  async getUsers() {
    return this.users;
  }

  async registerUser(data: User) {
    const foundUser = this.users.find(e => e.email == data.email && e.org == data.org);
    if(foundUser) return null;
    const id = Math.random().toString();
    const user = { ...data, id };
    this.users.push(user);
    return user;
  }

  async loginUser(email: string) {
    console.log('onLogin', this.users);
    const foundUser = this.users.find(e => e.email == email);
    return foundUser;
  }

}
