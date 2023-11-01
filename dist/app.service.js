"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let AppService = class AppService {
    constructor() {
        this.users = [];
        this.organisationDetails = [
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
    }
    async getUsers() {
        return this.users;
    }
    async registerUser(data) {
        const foundUser = this.users.find(e => e.email == data.email && e.org == data.org);
        if (foundUser)
            return null;
        const id = data.email;
        const user = Object.assign(Object.assign({}, data), { id });
        this.users.push(user);
        const orgDetails = this.organisationDetails.find(e => e.name == data.org);
        await this.createOnesignalUser(user);
        return { user, oneSignalAppId: orgDetails.onesignalAppId };
    }
    async loginUser(email, org) {
        console.log('onLogin', this.users);
        const foundUser = this.users.find(e => e.email == email && e.org == org);
        if (foundUser == null)
            return null;
        const orgDetails = this.organisationDetails.find(e => e.name == org);
        return { user: foundUser, oneSignalAppId: orgDetails.onesignalAppId };
    }
    async createOnesignalUser(user) {
        const _a = this.organisationDetails.find(e => e.name == user.org), { onesignalAppId, restApiKey } = _a, rest = __rest(_a, ["onesignalAppId", "restApiKey"]);
        console.log('on create user orgDetails: ', rest);
        const payload = { identity: { external_id: user.id } };
        try {
            const res = await axios_1.default.post(`https://onesignal.com/api/v1/apps/${onesignalAppId}/users`, payload);
            this.users.forEach(e => {
                var _a;
                if (e.id == user.id) {
                    e.osId = res.data.identity.onesignal_id;
                    e.subscriptions = (_a = res.data) === null || _a === void 0 ? void 0 : _a.subscriptions;
                }
            });
            console.log(res.data);
        }
        catch (e) {
            console.log('error while creating user', e);
            console.log('error data while creating user', e.response.data);
        }
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map