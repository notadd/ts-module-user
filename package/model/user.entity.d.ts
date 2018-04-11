import { InfoItem } from "./info.item.entity";
import { Organization } from "./organization.entity";
import { Permission } from "./permission.entity";
import { Role } from "./role.entity";
import { Score } from "./score.entity";
import { UserInfo } from "./user.info.entity";
export declare class User {
    id: number;
    userName: string;
    password: string;
    salt: string;
    status: boolean;
    recycle: boolean;
    userInfos: Array<UserInfo>;
    scores: Array<Score>;
    infoItems: Array<InfoItem>;
    adds: Array<Permission>;
    reduces: Array<Permission>;
    roles: Array<Role>;
    organizations: Array<Organization>;
}
