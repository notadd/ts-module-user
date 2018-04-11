import { Repository } from "typeorm";
import { InfoItem } from "../model/info.item.entity";
export declare class InfoItemService {
    private readonly infoItemRepository;
    constructor(infoItemRepository: Repository<InfoItem>);
    createInfoItem(name: string, label: string, description: string, type: string, necessary: boolean, registerVisible: boolean, informationVisible: boolean, order: number): Promise<void>;
    updateInfoItem(id: number, name: string, label: string, description: string, type: string, necessary: boolean, registerVisible: boolean, informationVisible: boolean, order: number): Promise<void>;
    deleteInfoItem(id: number): Promise<void>;
    deleteInfoItems(ids: Array<number>): Promise<void>;
}
