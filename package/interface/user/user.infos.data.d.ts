export interface UserInfosData {
    code: number;
    message: string;
    userInfos: Array<{
        name: string;
        value: string;
    }>;
}
