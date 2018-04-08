import { InfoItem } from './InfoItem.entity';
import { Organization } from './Organization.entity';
import { Permission } from './Permission.entity';
import { Role } from './Role.entity';
import { Score } from './Score.entity';
import { UserInfo } from './UserInfo.entity';
export declare class User {
    id: number;
    userName: string;
    password: string;
    salt: string;
    status: boolean;
    recycle: boolean;
    userInfos: UserInfo[];
    scores: Score[];
    infoItems: InfoItem[];
    adds: Permission[];
    reduces: Permission[];
    roles: Role[];
    organizations: Organization[];
}
