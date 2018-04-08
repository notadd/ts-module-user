import { InfoItem } from './InfoItem.entity';
export declare class InfoGroup {
    id: number;
    name: string;
    default: boolean;
    status: boolean;
    items: InfoItem[];
}
