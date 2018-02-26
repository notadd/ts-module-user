import { Component, Inject, HttpException } from '@nestjs/common';
import { InfoItem } from '../model/InfoItem';
import { IncomingMessage } from 'http';
import { Repository } from 'typeorm';
import { User } from '../model/User';
import * as crypto from 'crypto';


@Component()
export class InfoItemService {

    constructor(
        @Inject('UserPMModule.InfoItemRepository') private readonly infoItemRepository: Repository<InfoItem>
    ) { }

    async createInfoItem(name: string, description: string, type: string, necessary: boolean, order: number): Promise<void> {
        let exist: InfoItem = await this.infoItemRepository.findOne({ name })
        if (exist) {
            throw new HttpException('指定名称信息项已存在：' + name, 412)
        }
        let item: InfoItem = this.infoItemRepository.create({ name, description, type, necessary, order })
        try {
            await this.infoItemRepository.save(item)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async updateInfoItem(id:number,name: string, description: string, type: string, necessary: boolean, order: number): Promise<void> {
        let exist: InfoItem = await this.infoItemRepository.findOneById(id)
        if (!exist) {
            throw new HttpException('指定id信息项不存在：' + name, 413)
        }
        let exist1: InfoItem = await this.infoItemRepository.findOne({ name })
        if (exist1) {
            throw new HttpException('指定名称信息项已存在：' + name, 412)
        }
        exist.name = name 
        exist.description = description
        exist.type = type
        exist.necessary = necessary
        exist.order = order
        try {
            await this.infoItemRepository.save(exist)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async deleteInfoItem(id:number):Promise<void>{
        let exist: InfoItem = await this.infoItemRepository.findOneById(id)
        if (!exist) {
            throw new HttpException('指定id信息项不存在：' + name, 413)
        }
        try {
            await this.infoItemRepository.removeById(id)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

}
