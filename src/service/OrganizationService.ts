import { HttpException, Inject, Component } from '@nestjs/common';
import { Organization } from '../model/Organization';
import { Repository } from 'typeorm';
@Component()
export class OrganizationService {

    constructor(
        @Inject('UserPMModule.OrganizationRepository') private readonly organizationRepository: Repository<Organization>
    ) { }

    async getRoots(): Promise<Organization[]> {
        return await this.organizationRepository.find({root:true})
    }

    async getAll(): Promise<Organization[]> {
        return await this.organizationRepository.find()
    }

    async createOrganization(name: string, parentId: number): Promise<void> {
        let parent: Organization, root: boolean = true
        if (parentId !== undefined && parentId !== null) {
            parent = await this.organizationRepository.findOneById(parentId)
            root = false
            if (!parent) {
                throw new HttpException('父组织不存在', 402)
            }
        }
        let exist: Organization = await this.organizationRepository.findOne({ name })
        if (exist) {
            throw new HttpException('指定组织名已存在', 403)
        }
        let organization: Organization = this.organizationRepository.create({ name, root, parent })
        try {
            await this.organizationRepository.save(organization)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }
}