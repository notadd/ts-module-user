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
        let infoGroup: InfoGroup = this.infoGroupRepository.create({ name, status: true })
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
        try {
            exist.name = name
            await this.infoGroupRepository.save(exist)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async deleteInfoGroup(id:number): Promise<void> {
        let exist: InfoGroup = await this.infoGroupRepository.findOne({ name })
        if (!exist) {
            throw new HttpException('给定名称id信息组不存在', 408)
        }
        try {
            await this.infoGroupRepository.remove(exist)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }
}

