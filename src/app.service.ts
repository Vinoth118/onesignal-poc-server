import { Injectable } from '@nestjs/common';
import axios from 'axios';
import uuidV4 from 'uuid';

export interface NotificationPayload { 
  msg: string, 
  to: 'all' | 'org' | 'user', 
  org: 'vinoth' | 'vijay' | 'johny', 
  userId: string
}

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
      onesignalAppId: 'f1d85bd3-8bf5-4866-a660-d9a716351907',
      restApiKey: 'MWVmY2Y1N2MtYjk1NS00YWJhLWEyMzUtMWU4YjZmZTU0MTg4'
    },
    {
      name: 'vijay',
      id: 'vijay.trendytreasures.nl',
      onesignalAppId: '5c07872a-6df4-45e0-b9b9-b935091cdf75',
      restApiKey: 'OTllMTliNzAtN2RlMi00MTUxLTkwZWEtYWI1OTFhYjBkMmUx'
    },
    {
      name: 'johny',
      id: 'johny.trendytreasures.nl',
      onesignalAppId: 'ff35c29e-a33c-4c48-8fc0-667f85fda4cb',
      restApiKey: 'ZDRkYjk3YjMtYjVmZC00OGQ2LWEyYTgtNmE4M2M5MTAyMjVk'
    }
  ];

  async getUsers() {
    return this.users;
  }

  async registerUser(data: User) {
    const foundUser = this.users.find(e => e.email == data.email && e.org == data.org);
    if(foundUser) return null;
    const id = uuidV4.v4();
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

  async notify(data: NotificationPayload) {
    let orgDetails = this.organisationDetails.find(e => e.name === data.org);
    if(orgDetails == null) orgDetails = this.organisationDetails[0];
    let apiKey = orgDetails.restApiKey;
    const payload  = {
      app_id: orgDetails.onesignalAppId,
      name: `Message from ${orgDetails.id}`,
      contents: {
        en: data.msg,
        es: data.msg
      },
      included_segments: [
        "Total Subscriptions"
      ],
    };
    switch(data.to) {
      case 'all': {
        break;
      }
      case 'org': {
        break;
      }
      case 'user': {
        const user = this.users.find(e => e.id == data.userId);
        const org = this.organisationDetails.find(e => e.name == user.org);
        payload['app_id'] = org.onesignalAppId;
        payload['external_id'] = user.osId;
        apiKey = org.restApiKey;
        break;
      }
    }
    try {
      const res = await axios.post(`https://onesignal.com/api/v1/notifications`, payload, {
        headers: {
          Authorization: `Basic ${apiKey}`
        }
      });
      if(res.data) {
        return res.data;
      }
    } catch(e) {
      console.log(e);
      console.log('error data while sending notification: ', e.response.data)
      return null;
    }
    
  }

  async createOnesignalUser(user: User) {
    const { onesignalAppId, restApiKey, ...rest } = this.organisationDetails.find(e => e.name == user.org);
    const payload = { identity: { external_id: user.id } };
    console.log('create user payload: ', payload);
    try {
      const res = await axios.post(`https://onesignal.com/api/v1/apps/${onesignalAppId}/users`, payload);
      this.users.forEach(e => {
        if(e.id == user.id) { 
          e.osId = res.data.identity.onesignal_id;
          e.subscriptions = res.data?.subscriptions;
        }
      });
      console.log('create user success: ', res.data)
    } catch(e) {
      //console.log('error while creating user', e);
      console.log('error data while creating user', e.response.data);
    }
  }

}
