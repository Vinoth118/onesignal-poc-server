"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const tldts_1 = require("tldts");
const app_service_1 = require("./app.service");
const Subdomain = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const subdomain = (0, tldts_1.getSubdomain)(request.headers.origin);
    return subdomain !== null && subdomain !== void 0 ? subdomain : 'vinoth';
});
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async getUsers() {
        const result = await this.appService.getUsers();
        return {
            success: true,
            data: result
        };
    }
    async registerUser(subdomain, data) {
        const { registerFrom, org } = data, rest = __rest(data, ["registerFrom", "org"]);
        const registerUserData = Object.assign(Object.assign({}, rest), { org: registerFrom == 'ADMIN' ? org : subdomain });
        const result = await this.appService.registerUser(registerUserData);
        return {
            success: result != null,
            data: result
        };
    }
    async loginUser(subdomain, data) {
        const result = await this.appService.loginUser(data.email, subdomain);
        return {
            success: result != null,
            data: result
        };
    }
};
__decorate([
    (0, common_1.Get)('/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('/register'),
    __param(0, Subdomain()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('/login'),
    __param(0, Subdomain()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "loginUser", null);
AppController = __decorate([
    (0, common_1.Controller)('/'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map