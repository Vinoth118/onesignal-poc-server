import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { UserDocument, User, UserType } from './user.model';
import { InjectModel } from '@nestjs/mongoose';


export interface NotificationPayload { 
  msg: string, 
  to: 'all' | 'org' | 'user', 
  org: 'vinoth' | 'vijay' | 'johny', 
  userId: string
}

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
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
    return this.userModel.find();
  }
  
  async getUser(query: { [x: string]: string }) {
    return this.userModel.findOne(query);
  }

  async registerUser(data: UserType) {
    const createdUser = await this.userModel.create(data);
    const createdUserInOneSignal = await this.createOnesignalUser(createdUser);
    if(createdUserInOneSignal) {
      createdUser.osId = createdUserInOneSignal.identity.onesignal_id;
    }
    const updatedUser = await createdUser.save();
    const orgDetails = this.organisationDetails.find(e => e.name == data.org);

    return { user: updatedUser, oneSignalAppId: orgDetails.onesignalAppId }
  }

  async loginUser(email: string, org: string) {
    const foundUser = await this.getUser({ email: email, org: org });
    if(foundUser == null) return null;

    const orgDetails = this.organisationDetails.find(e => e.name == org);
    return { user: foundUser, oneSignalAppId: orgDetails.onesignalAppId };
  }

  async notify(data: NotificationPayload) {
    const payload  = { contents: { en: data.msg } };
    switch(data.to) {
      case 'all': {
        payload['name'] = `Message to all users`,
        payload['included_segments'] = ["Total Subscriptions"];
        try {
          const responses = await Promise.all(this.organisationDetails.map(org => this.sendNotification({ ...payload, app_id: org.onesignalAppId }, org.restApiKey, org.id)));
          return responses;
        } catch(e) {
          console.log('notification failed for all: ', e)
        }
        return null;
      }
      case 'org': {
        let orgDetails = this.organisationDetails.find(e => e.name === data.org);
        payload['app_id'] = orgDetails.onesignalAppId;
        payload['name'] = `Message to ${orgDetails.id} all users`,
        payload['included_segments'] = ["Total Subscriptions"];
        try {
          const response = await this.sendNotification(payload, orgDetails.restApiKey, orgDetails.id);
          return [response];
        } catch(e) {
          console.log('notification failed for org all: ', e)
        }
        return null;
      }
      case 'user': {
        const user = await this.getUser({ _id: data.userId });
        const orgDetails = this.organisationDetails.find(e => e.name == user.org);
        payload['app_id'] = orgDetails.onesignalAppId;
        payload['name'] = `Message to ${orgDetails.id} - ${user.name}`,
        payload['include_aliases'] = { external_id: [user.id] };
        payload['target_channel'] = 'push';
        try {
          const response = await this.sendNotification(payload, orgDetails.restApiKey, orgDetails.id);
          return [response];
        } catch(e) {
          console.log('notification failed for one user: ', e)
        }
        return null;
      }
    }
  }

  async sendNotification(payload: { [x: string]: any }, apiKey: string, org: string) {
    try {
      const res = await axios.post(`https://onesignal.com/api/v1/notifications`, payload, {
        headers: {
          Authorization: `Basic ${apiKey}`
        }
      });
      if(res.data) {
        return { success: true, org: org, data: res.data };
      } else {
        return { success: false, org: org, data: null };;
      }
    } catch(e) {
      console.log(e);
      console.log('error data while sending notification: ', e.response.data)
      return { success: false, org: org, data: null };;
    }
  }

  async createOnesignalUser(user: UserDocument) {
    const { onesignalAppId, restApiKey, ...rest } = this.organisationDetails.find(e => e.name == user.org);
    const payload = { identity: { external_id: user._id } };
    console.log('create user payload: ', payload);
    try {
      const res = await axios.post(`https://onesignal.com/api/v1/apps/${onesignalAppId}/users`, payload);
      console.log('create user success: ', res.data)
      return res.data;
    } catch(e) {
      //console.log('error while creating user', e);
      console.log('error data while creating user', e.response.data);
    }
  }

}

