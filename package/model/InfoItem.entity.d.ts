import { InfoGroup } from './InfoGroup.entity';
import { UserInfo } from './UserInfo.entity';
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
    userInfos: UserInfo[];
    groups: InfoGroup[];
}
