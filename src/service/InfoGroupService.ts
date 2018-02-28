import { Component, Inject, HttpException } from '@nestjs/common';
import { InfoGroup } from '../model/InfoGroup';
import { InfoItem } from '../model/InfoItem'
import { IncomingMessage } from 'http';
import { Repository } from 'typeorm';
import { User } from '../model/User';
import * as crypto from 'crypto';


@Component()
export class InfoGroupService {

    constructor(
        @Inject('UserPMModule.InfoItemRepository') private readonly infoItemRepository: Repository<InfoItem>,
        @Inject('UserPMModule.InfoGroupRepository') private readonly infoGroupRepository: Repository<InfoGroup>
    ) { }

    async getAll(): Promise<InfoGroup[]> {
        return await this.infoGroupRepository.find()
    }

    async getInfoItems(id: number): Promise<InfoItem[]> {
        let infoGroup: InfoGroup = await this.infoGroupRepository.findOneById(id, { relations: ['items'] })
        return infoGroup.items
    }

    async createInfoGroup(name: string): Promise<void> {
        let exist: InfoGroup = await this.infoGroupRepository.findOne({ name })
        if (exist) {
            throw new HttpException('给定名称信息组已存在', 407)
        }
        let infoGroup: InfoGroup = this.infoGroupRepository.create({ name, default: false, status: true })
        try {
            await this.infoGroupRepository.save(infoGroup)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async updateInfoGroup(name: string): Promise<void> {
        let exist: InfoGroup = await this.infoGroupRepository.findOne({ name })
        if (!exist) {
            throw new HttpException('给定名称信息组不存在', 408)
        }
        if(exist.default){
            throw new HttpException('默认信息组不可更改', 408)
        }
        try {
            exist.name = name
            await this.infoGroupRepository.save(exist)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async deleteInfoGroup(id: number): Promise<void> {
        let exist: InfoGroup = await this.infoGroupRepository.findOne({ name })
        if (!exist) {
            throw new HttpException('给定名称id信息组不存在', 408)
        }
        if(exist.default){
            throw new HttpException('默认信息组不可删除', 408)
        }
        try {
            await this.infoGroupRepository.remove(exist)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async addInfoItem(id: number, infoItemId: number): Promise<void> {
        let group: InfoGroup = await this.infoGroupRepository.findOneById(id, { relations: ['items'] })
        if (!group) {
            throw new HttpException('给定名称id信息组不存在', 408)
        }
        let item: InfoItem = await this.infoItemRepository.findOneById(infoItemId)
        if (!item) {
            throw new HttpException('指定信息项不存在', 409)
        }
        //查找是否信息项已经存在于指定信息组中
        let find: InfoItem = group.items.find(item => {
            return item.id === id
        })
        if (find) {
            throw new HttpException('指定信息项id=' + infoItemId + '已经存在于指定信息组id=' + id + '中', 410)
        }
        try {
            group.items.push(item)
            await this.infoGroupRepository.save(group)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async removeInfoItem(id: number, infoItemId: number): Promise<void> {
        let group: InfoGroup = await this.infoGroupRepository.findOneById(id, { relations: ['items'] })
        if (!group) {
            throw new HttpException('给定名称id信息组不存在', 408)
        }
        let item: InfoItem = await this.infoItemRepository.findOneById(infoItemId)
        if (!item) {
            throw new HttpException('指定信息项不存在', 409)
        }
        //查找是否信息项已经存在于指定信息组中
        let index = group.items.findIndex(item => {
            return item.id === id
        })
        if (index < 0) {
            throw new HttpException('指定信息项id=' + infoItemId + '不存在于指定信息组id=' + id + '中', 411)
        }
        try {
            group.items.splice(index, 1)
            await this.infoGroupRepository.save(group)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }
}

