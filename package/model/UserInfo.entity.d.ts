import { InfoItem } from './InfoItem.entity';
import { User } from './User.entity';
export declare class UserInfo {
    id: number;
    value: string;
    userId: number;
    user: User;
    infoItemId: number;
    infoItem: InfoItem;
}
