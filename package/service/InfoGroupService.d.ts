import { Repository } from 'typeorm';
import { InfoGroup } from '../model/InfoGroup.entity';
import { InfoItem } from '../model/InfoItem.entity';
export declare class InfoGroupService {
    private readonly infoItemRepository;
    private readonly infoGroupRepository;
    constructor(infoItemRepository: Repository<InfoItem>, infoGroupRepository: Repository<InfoGroup>);
    getAll(): Promise<InfoGroup[]>;
    getInfoItems(id: number): Promise<InfoItem[]>;
    createInfoGroup(name: string): Promise<void>;
    updateInfoGroup(id: number, name: string): Promise<void>;
    deleteInfoGroup(id: number): Promise<void>;
    addInfoItem(id: number, infoItemId: number): Promise<void>;
    removeInfoItem(id: number, infoItemId: number): Promise<void>;
}
