export interface User {
    id: string;
    name: string;
    email: string;
    org: 'vinoth' | 'vijay' | 'johny';
    osId?: string;
    subscriptions?: {
        id: string;
        token: string;
        type: string;
    }[];
}
export declare class AppService {
    users: User[];
    organisationDetails: {
        name: string;
        id: string;
        onesignalAppId: string;
        restApiKey: string;
    }[];
    getUsers(): Promise<User[]>;
    registerUser(data: User): Promise<{
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
    }>;
    loginUser(email: string, org: string): Promise<{
        user: User;
        oneSignalAppId: string;
    }>;
    createOnesignalUser(user: User): Promise<void>;
}
