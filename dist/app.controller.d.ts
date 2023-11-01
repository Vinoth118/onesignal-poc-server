import { AppService, User } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getUsers(): Promise<{
        success: boolean;
        data: User[];
    }>;
    registerUser(subdomain: 'vinoth' | 'vijay' | 'johny', data: User & {
        registerFrom: 'CLIENT' | 'ADMIN';
    }): Promise<{
        success: boolean;
        data: {
            user: {
                id: string;
                name: string;
                email: string;
                org: "vinoth" | "vijay" | "johny";
                osId?: string;
                subscriptions?: {
                    id: string;
                    token: string;
                    type: string;
                }[];
            };
            oneSignalAppId: string;
        };
    }>;
    loginUser(subdomain: 'vinoth' | 'vijay' | 'johny', data: {
        email: string;
    }): Promise<{
        success: boolean;
        data: {
            user: User;
            oneSignalAppId: string;
        };
    }>;
}
