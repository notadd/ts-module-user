import { Component, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InfoItem } from "../model/info.item.entity";

@Component()
export class InfoItemService {

    constructor(
        @InjectRepository(InfoItem) private readonly infoItemRepository: Repository<InfoItem>
    ) {
    }

    /* 创建信息项 */
    async createInfoItem(name: string, label: string, description: string, type: string, necessary: boolean, registerVisible: boolean, informationVisible: boolean, order: number): Promise<void> {
        const exist: InfoItem|undefined = await this.infoItemRepository.findOne({ name });
        if (exist) {
            throw new HttpException("指定名称信息项已存在：" + name, 412);
        }
        if (necessary && !registerVisible) {
            throw new HttpException("指定名称name=" + name + "必填信息项，注册时必须可见", 412);
        }
        const item: InfoItem = this.infoItemRepository.create({
            name,
            label,
            default: false,
            description,
            type,
            necessary,
            registerVisible,
            informationVisible,
            order
        });
        try {
            await this.infoItemRepository.save(item);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    /* 更新信息项 */
    async updateInfoItem(id: number, name: string, label: string, description: string, type: string, necessary: boolean, registerVisible: boolean, informationVisible: boolean, order: number): Promise<void> {
        const exist: InfoItem|undefined = await this.infoItemRepository.findOneById(id);
        if (!exist) {
            throw new HttpException("指定id=" + id + "信息项不存在", 413);
        }
        // 默认信息项无法更新
        if (exist.default) {
            throw new HttpException("默认信息项不允许更新", 413);
        }
        if (necessary && !registerVisible) {
            throw new HttpException("指定名称name=" + name + "必填信息项，注册时必须可见", 412);
        }
        if (name !== exist.name) {
            const exist1: InfoItem|undefined = await this.infoItemRepository.findOne({ name });
            if (exist1) {
                throw new HttpException("指定name=" + name + "信息项已存在", 412);
            }
        }
        exist.name = name;
        exist.label = label;
        exist.description = description;
        exist.type = type;
        exist.necessary = necessary;
        exist.registerVisible = registerVisible;
        exist.informationVisible = informationVisible;
        exist.order = order;
        try {
            await this.infoItemRepository.save(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    /* 删除信息项，这里默认的行为是删除信息项时，由它生成的用户信息UserInfo不会删除*/
    async deleteInfoItem(id: number): Promise<void> {
        const exist: InfoItem|undefined = await this.infoItemRepository.findOneById(id);
        if (!exist) {
            throw new HttpException("指定id=" + id + "信息项不存在", 413);
        }
        // 默认信息项无法删除
        if (exist.default) {
            throw new HttpException("默认信息项不允许删除", 413);
        }
        try {
            await this.infoItemRepository.remove(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    /* 一次删除多个信息项，还是不会删除UserInfo */
    async deleteInfoItems(ids: Array<number>): Promise<void> {
        const infoItems: Array<InfoItem> = await this.infoItemRepository.findByIds(ids);
        // 检查是否所有id的信息项都存在
        ids.forEach(id => {
            const find: InfoItem|undefined = infoItems.find(item => {
                return item.id === id;
            });
            if (!find) {
                throw new HttpException("指定id=" + id + "信息项不存在", 413);
            }
            // 默认信息项无法删除
            if (find.default) {
                throw new HttpException("默认信息项不允许删除", 413);
            }
        });
        try {
            await this.infoItemRepository.remove(infoItems);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

}
