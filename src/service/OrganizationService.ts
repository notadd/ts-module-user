import { HttpException, Inject, Component } from '@nestjs/common';
import { Organization } from '../model/Organization';
import { Repository } from 'typeorm';
import { User } from '../model/User';
@Component()
export class OrganizationService {

    constructor(
        @Inject('UserPMModule.UserRepository') private readonly userRepository: Repository<User>,
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

    async getUsersInOrganization(id: number): Promise<User[]> {
        let o: Organization = await this.organizationRepository.findOneById(id, { relations: ['users'] })
        if (!o) {
            throw new HttpException('指定父组织不存在', 402)
        }
        return o.users
    }

    async addUserToOrganization(id: number, userId: number): Promise<void> {
        let o: Organization = await this.organizationRepository.findOneById(id, { relations: ['users'] })
        if (!o) {
            throw new HttpException('指定组织不存在', 402)
        }
        let user: User = await this.userRepository.findOneById(userId)
        if (!user) {
            throw new HttpException('指定用户不存在', 402)
        }
        let exist:User = o.users.find(user => {
            return user.id === userId
        })
        if(exist){
            throw new HttpException('指定用户id='+userId+'已存在于指定组织id='+id+'中', 402)
        }
        o.users.push(user)
        await this.organizationRepository.save(o)
    }

    async addUsersToOrganization(id: number, userIds: number[]): Promise<void> {
        let o: Organization = await this.organizationRepository.findOneById(id, { relations: ['users'] })
        if (!o) {
            throw new HttpException('指定组织不存在', 402)
        }
        let users: User[] = await this.userRepository.findByIds(userIds)
        //验证是否所有需要的用户都被查询出来
        userIds.forEach(id=>{
            let find:User = users.find(user=>{
                return user.id===id
            })
            if(!find){
                throw new HttpException('指定用户id='+id+'不存在', 402)
            }
        })
        //验证是否有用户已存在于指定组织下
        o.users.forEach(user => {
            let match = userIds.find(id=>{
                return id===user.id
            })
            if(match){
                throw new HttpException('指定用户id='+user.id+'已存在于指定组织id='+id+'中', 402)
            }
        })
        o.users.push(...users)
        await this.organizationRepository.save(o)
    }

    async removeUserFromOrganization(id: number, userId: number): Promise<void> {
        let o: Organization = await this.organizationRepository.findOneById(id, { relations: ['users'] })
        if (!o) {
            throw new HttpException('指定组织不存在', 402)
        }
        let user: User = await this.userRepository.findOneById(userId)
        if (!user) {
            throw new HttpException('指定用户不存在', 402)
        }
        let exist:User = o.users.find(user => {
            return user.id === userId
        })
        if(!exist){
            throw new HttpException('指定用户id='+userId+'不存在于指定组织id='+id+'中', 402)
        }
        o.users.push(user)
        await this.organizationRepository.save(o)
    }
}