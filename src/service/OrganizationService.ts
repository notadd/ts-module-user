import { HttpException, Inject, Component } from '@nestjs/common';
import { Organization } from '../model/Organization';
import { Repository } from 'typeorm';
@Component()
export class OrganizationService {

    constructor(
        @Inject('UserPMModule.OrganizationRepository') private readonly organizationRepository: Repository<Organization>
    ) { }

    async getAll(): Promise<Organization[]> {
        return await this.organizationRepository.find()
    }

    async createOrganization(name: string, parentId: number): Promise<void> {
        if (parentId !== undefined && parentId !== null) {
            let parent: Organization = await this.organizationRepository.findOneById(parentId)
            if (!parent) {
                throw new HttpException('父组织不存在', 402)
            }
        }
        let exist: Organization = await this.organizationRepository.findOne({ name })
        if (exist) {
            throw new HttpException('指定组织名已存在', 403)
        }
        let organization: Organization = this.organizationRepository.create({ name, parent })
        try {
            await this.organizationRepository.save(organization)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }
}