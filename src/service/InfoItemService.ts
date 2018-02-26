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

}
