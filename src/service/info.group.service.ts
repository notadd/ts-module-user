import { Component, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InfoGroup } from "../model/info.group.entity";
import { InfoItem } from "../model/info.item.entity";

@Component()
export class InfoGroupService {

    constructor(
        @InjectRepository(InfoItem) private readonly infoItemRepository: Repository<InfoItem>,
        @InjectRepository(InfoGroup) private readonly infoGroupRepository: Repository<InfoGroup>
    ) {
    }

    /* 获取所有信息组 */
    async getAll(): Promise<Array<InfoGroup>> {
        return this.infoGroupRepository.find();
    }

    /* 获取指定信息组的信息项，不管信息组状态如何都能获取到 */
    async getInfoItems(id: number): Promise<Array<InfoItem>|undefined> {
        const infoGroup: InfoGroup|undefined = await this.infoGroupRepository.findOneById(id, { relations: [ "items" ] });
        return infoGroup ? infoGroup.items : undefined;
    }

    /* 创建信息组 */
    async createInfoGroup(name: string): Promise<void> {
        const exist: InfoGroup|undefined = await this.infoGroupRepository.findOne({ name });
        if (exist) {
            throw new HttpException("给定名称name=" + name + "信息组已存在", 407);
        }
        // 方法中创建的信息组都是非默认的，只有模块初始化时写入信息组才是默认的
        const infoGroup: InfoGroup = this.infoGroupRepository.create({ name, default: false, status: true });
        try {
            await this.infoGroupRepository.save(infoGroup);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    /* 更新信息组 */
    async updateInfoGroup(id: number, name: string): Promise<void> {
        const exist: InfoGroup|undefined = await this.infoGroupRepository.findOneById(id);
        if (!exist) {
            throw new HttpException("给定id=" + id + "信息组不存在", 408);
        }
        // 默认信息组无法更新
        if (exist.default) {
            throw new HttpException("默认信息组不可更改", 408);
        }
        // 更新的名称已存在也无法更新
        if (name !== exist.name) {
            const exist1: InfoGroup|undefined = await this.infoGroupRepository.findOne({ name });
            if (exist1) {
                throw new HttpException("指定名称信息组已存在：" + name, 408);
            }
        }
        try {
            exist.name = name;
            await this.infoGroupRepository.save(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    /* 删除信息组，目前由于信息组与信息项是多对多关系，删除信息组只会解除关系，不会删除信息项 */
    async deleteInfoGroup(id: number): Promise<void> {
        const exist: InfoGroup|undefined = await this.infoGroupRepository.findOneById(id);
        if (!exist) {
            throw new HttpException("给定id=" + id + "信息组不存在", 408);
        }
        // 默认信息组无法删除
        if (exist.default) {
            throw new HttpException("默认信息组不可删除", 408);
        }
        try {
            await this.infoGroupRepository.remove(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    /* 向指定信息组添加信息项 */
    async addInfoItem(id: number, infoItemId: number): Promise<void> {
        const group: InfoGroup|undefined = await this.infoGroupRepository.findOneById(id, { relations: [ "items" ] });
        if (!group) {
            throw new HttpException("给定id=" + id + "信息组不存在", 408);
        }
        // 不能向默认信息组添加新项
        if (group.default) {
            throw new HttpException("默认信息组不可更改", 408);
        }
        const item: InfoItem|undefined = await this.infoItemRepository.findOneById(infoItemId);
        if (!item) {
            throw new HttpException("指定id=" + infoItemId + "信息项不存在", 409);
        }
        // 默认信息项也不能添加到别的组
        if (item.default) {
            throw new HttpException("默认信息项不可添加", 408);
        }
        // 查找是否信息项已经存在于指定信息组中
        const find: InfoItem|undefined = group.items.find(item => {
            return item.id === id;
        });
        // 如果已经存在，报错
        if (find) {
            throw new HttpException("指定信息项id=" + infoItemId + "已经存在于指定信息组id=" + id + "中", 410);
        }
        try {
            group.items.push(item);
            await this.infoGroupRepository.save(group);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    /* 从信息组移除信息项 */
    async removeInfoItem(id: number, infoItemId: number): Promise<void> {
        const group: InfoGroup|undefined = await this.infoGroupRepository.findOneById(id, { relations: [ "items" ] });
        if (!group) {
            throw new HttpException("给定id=" + id + "信息组不存在", 408);
        }
        // 默认信息组不能更改
        if (group.default) {
            throw new HttpException("默认信息组不可更改", 408);
        }
        // 其他信息组不可能包含默认信息项，因为添加不进去
        const item: InfoItem|undefined = await this.infoItemRepository.findOneById(infoItemId);
        if (!item) {
            throw new HttpException("指定id=" + infoItemId + "信息项不存在", 409);
        }
        // 查找是否信息项已经存在于指定信息组中
        const index = group.items.findIndex(item => {
            return item.id === id;
        });
        // 如果信息项不存在信息组中，报错
        if (index < 0) {
            throw new HttpException("指定信息项id=" + infoItemId + "不存在于指定信息组id=" + id + "中", 411);
        }
        try {
            group.items.splice(index, 1);
            await this.infoGroupRepository.save(group);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }
}

