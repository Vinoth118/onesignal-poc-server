import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface User {
  id: string,
  name: string,
  email: string,
  org: 'vinoth' | 'vijay' | 'johny',
  osId?: string,
  subscriptions?: { id: string, token: string, type: string }[]
}

@Injectable()
export class AppService {
  users: User[] = [];
  organisationDetails = [
    {
      name: 'vinoth',
      id: 'vinoth.trendytreasures.nl',
      onesignalAppId: '8559621e-4a6f-4d87-859d-e60f0e5620c8',
      restApiKey: 'NjdiMzk1ZWEtZjQwZS00YTRhLTlhNGItMjQ5NTc3MGIyNzFm'
    },
    {
      name: 'vijay',
      id: 'vijay.trendytreasures.nl',
      onesignalAppId: '5febf5d2-1a07-42a8-a538-97f0ed340e3f',
      restApiKey: 'YzVjMzUwMjQtNzViYy00ZmMyLTk1M2QtNjgzMDdjNTYxMTRh'
    },
    {
      name: 'johny',
      id: 'johny.trendytreasures.nl',
      onesignalAppId: '0ea7f719-690e-4afe-bc65-2914624f3576',
      restApiKey: 'NTMyZjkyNjctZjhlYi00ZjAxLThiM2QtOTlhZjE1YWMzMmE0'
    }
  ];

  async getUsers() {
    return this.users;
  }

  async registerUser(data: User) {
    const foundUser = this.users.find(e => e.email == data.email && e.org == data.org);
    if(foundUser) return null;
    const id = data.email;
    const user = { ...data, id };
    this.users.push(user);

    const orgDetails = this.organisationDetails.find(e => e.name == data.org);
    await this.createOnesignalUser(user);

    return { user, oneSignalAppId: orgDetails.onesignalAppId };
  }

  async loginUser(email: string, org: string) {
    console.log('onLogin', this.users);
    const foundUser = this.users.find(e => e.email == email && e.org == org);
    if(foundUser == null) return null;

    const orgDetails = this.organisationDetails.find(e => e.name == org);
    return { user: foundUser, oneSignalAppId: orgDetails.onesignalAppId };
  }

  async createOnesignalUser(user: User) {
    const { onesignalAppId, restApiKey, ...rest } = this.organisationDetails.find(e => e.name == user.org);
    console.log('on create user orgDetails: ', rest);
    const payload = { identity: { external_id: user.id } };
    try {
      const res = await axios.post(`https://onesignal.com/api/v1/apps/${onesignalAppId}/users`, payload);
      this.users.forEach(e => {
        if(e.id == user.id) { 
          e.osId = res.data.identity.onesignal_id;
          e.subscriptions = res.data?.subscriptions;
        }
      });
      console.log(res.data)
    } catch(e) {
      console.log('error while creating user', e);
      console.log('error data while creating user', e.response.data);
    }
  }

}
