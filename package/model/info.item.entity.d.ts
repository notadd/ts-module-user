import { InfoGroup } from "./info.group.entity";
import { UserInfo } from "./user.info.entity";
export declare class InfoItem {
    id: number;
    name: string;
    label: string;
    default: boolean;
    description: string;
    type: string;
    necessary: boolean;
    registerVisible: boolean;
    informationVisible: boolean;
    order: number;
    userInfos: Array<UserInfo>;
    groups: Array<InfoGroup>;
}
