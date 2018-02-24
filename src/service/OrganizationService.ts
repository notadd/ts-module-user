import { HttpException, Inject, Component } from '@nestjs/common';
import { Organization } from '../model/Organization';
import { Repository } from 'typeorm';
import { User } from '../model/User';
@Component()
export class OrganizationService {

    constructor(
        @Inject('UserPMModule.OrganizationRepository') private readonly organizationRepository: Repository<Organization>
    ) { }

    async getRoots(): Promise<Organization[]> {
        return await this.organizationRepository.find({ parentId: null })
    }

    async getChildren(id: number): Promise<Organization[]> {
        let o: Organization = await this.organizationRepository.findOneById(id, { relations: ['children'] })
        if (!o) {
            throw new HttpException('指定父组织不存在', 402)
        }
        return o.children
    }
    async getAll(): Promise<Organization[]> {
        return await this.organizationRepository.find()
    }

    async getUsersInOrganization(id: number): Promise<User[]> {
        let o: Organization = await this.organizationRepository.findOneById(id, { relations: ['users'] })
        if (!o) {
            throw new HttpException('指定父组织不存在', 402)
        }
        return o.users
    }
    async createOrganization(name: string, parentId: number): Promise<void> {
        let parent: Organization
        if (parentId !== undefined && parentId !== null) {
            parent = await this.organizationRepository.findOneById(parentId)
            if (!parent) {
                throw new HttpException('指定父组织不存在', 402)
            }
        }
        let exist: Organization = await this.organizationRepository.findOne({ name })
        if (exist) {
            throw new HttpException('要创建的组织名已存在', 403)
        }
        //如果parent为undefined，则parentId为null
        let organization: Organization = this.organizationRepository.create({ name, parent })
        try {
            await this.organizationRepository.save(organization)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async updateOrganization(id: number, name: string, parentId: number): Promise<void> {
        let parent: Organization = null
        if (parentId !== undefined && parentId !== null) {
            parent = await this.organizationRepository.findOneById(parentId)
            if (!parent) {
                throw new HttpException('指定父组织不存在', 402)
            }
        }
        let exist: Organization = await this.organizationRepository.findOneById(id)
        if (!exist) {
            throw new HttpException('指定id组织不存在', 404)
        }
        try {
            //parent必须为null才有效，如果为undefined则不改动
            //这一步与级联没有关系，不管级联如何设置
            exist.name = name
            exist.parent = parent
            await this.organizationRepository.save(exist)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }


    async deleteOrganization(id: number): Promise<void> {
        let exist: Organization = await this.organizationRepository.findOneById(id, { relations: ['children'] })
        if (!exist) {
            throw new HttpException('指定id组织不存在', 404)
        }
        try {
            await this.organizationRepository.removeById(id)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

}