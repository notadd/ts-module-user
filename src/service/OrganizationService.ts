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
            throw new HttpException('指定父组织id='+id+'不存在', 402)
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
                throw new HttpException('指定父组织id='+parentId+'不存在', 402)
            }
        }
        let exist: Organization = await this.organizationRepository.findOne({ name })
        if (exist) {
            throw new HttpException('指定名称name='+name+'组织已存在', 403)
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
        let exist: Organization = await this.organizationRepository.findOneById(id)
        if (!exist) {
            throw new HttpException('指定id='+id+'组织不存在', 404)
        }
        if(name!==exist.name){
            let exist: Organization = await this.organizationRepository.findOne({name})
            if (exist) {
                throw new HttpException('指定name='+name+'组织已存在', 404)
            }
        }
        let parent: Organization = null
        if (parentId !== undefined && parentId !== null) {
            parent = await this.organizationRepository.findOneById(parentId)
            if (!parent) {
                throw new HttpException('指定父组织id='+parentId+'不存在', 402)
            }
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
            throw new HttpException('指定id='+id+'组织不存在', 404)
        }
        if (exist.children && exist.children.length > 0) {
            throw new HttpException('指定组织存在子组织，无法删除', 404)
        }
        try {
            await this.organizationRepository.remove(exist)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async getUsersInOrganization(id: number): Promise<User[]> {
        let o: Organization = await this.organizationRepository.findOneById(id, { relations: ['users'] })
        if (!o) {
            throw new HttpException('指定id='+id+'父组织不存在', 402)
        }
        //只获取不再回收站中的用户
        return o.users.filter(user => {
            return !user.recycle
        })
    }

    async addUserToOrganization(id: number, userId: number): Promise<void> {
        let o: Organization = await this.organizationRepository.findOneById(id, { relations: ['users'] })
        if (!o) {
            throw new HttpException('指定id='+id+'组织不存在', 402)
        }
        let user: User = await this.userRepository.findOneById(userId)
        if (!user) {
            throw new HttpException('指定id='+userId+'用户不存在', 402)
        }
        let exist: User = o.users.find(user => {
            return user.id === userId
        })
        if (exist) {
            throw new HttpException('指定用户id=' + userId + '已存在于指定组织id=' + id + '中', 402)
        }
        o.users.push(user)
        try {
            await this.organizationRepository.save(o)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async addUsersToOrganization(id: number, userIds: number[]): Promise<void> {
        let o: Organization = await this.organizationRepository.findOneById(id, { relations: ['users'] })
        if (!o) {
            throw new HttpException('指定id='+id+'组织不存在', 402)
        }
        let users: User[] = await this.userRepository.findByIds(userIds)
        //验证是否所有需要的用户都被查询出来
        userIds.forEach(id => {
            let find: User = users.find(user => {
                return user.id === id
            })
            if (!find) {
                throw new HttpException('指定id=' + id + '用户不存在', 402)
            }
        })
        //验证是否有用户已存在于指定组织下
        o.users.forEach(user => {
            let match = userIds.find(id => {
                return id === user.id
            })
            if (match) {
                throw new HttpException('指定用户id=' + user.id + '已存在于指定组织id=' + id + '中', 402)
            }
        })
        o.users.push(...users)
        try {
            await this.organizationRepository.save(o)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async removeUserFromOrganization(id: number, userId: number): Promise<void> {
        let o: Organization = await this.organizationRepository.findOneById(id, { relations: ['users'] })
        if (!o) {
            throw new HttpException('指定id='+id+'组织不存在', 402)
        }
        let user: User = await this.userRepository.findOneById(userId)
        if (!user) {
            throw new HttpException('指定id='+userId+'用户不存在', 402)
        }
        let index = o.users.findIndex(user => {
            return user.id === userId
        })
        if (index < 0) {
            throw new HttpException('指定用户id=' + userId + '不存在于指定组织id=' + id + '中', 402)
        }
        o.users.splice(index, 1)
        try {
            await this.organizationRepository.save(o)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async removeUsersFromOrganization(id: number, userIds: number[]): Promise<void> {
        let o: Organization = await this.organizationRepository.findOneById(id, { relations: ['users'] })
        if (!o) {
            throw new HttpException('指定组织不存在', 402)
        }
        let users: User[] = await this.userRepository.findByIds(userIds)
        if (!users || users.length === 0) {
            throw new HttpException('指定用户不存在', 402)
        }
        //从组织的用户中循环移除指定用户，要求用户存在于数据库中，且用户必须已经存在于指定组织中
        userIds.forEach(userId => {
            let find: User = users.find(user => {
                return user.id === userId
            })
            if (!find) {
                throw new HttpException('指定用户id=' + userId + '不存在于数据库中', 402)
            }
            let index = o.users.findIndex(user => {
                return user.id === userId
            })
            if (index < 0) {
                throw new HttpException('指定用户id=' + userId + '不存在于指定组织id=' + id + '中', 402)
            }
            o.users.splice(index, 1)
        })
        try {
            await this.organizationRepository.save(o)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }
}