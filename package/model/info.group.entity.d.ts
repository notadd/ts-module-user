import { InfoItem } from "./info.item.entity";
export declare class InfoGroup {
    id: number;
    name: string;
    default: boolean;
    status: boolean;
    items: Array<InfoItem>;
}
