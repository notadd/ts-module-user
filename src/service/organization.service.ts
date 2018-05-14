import { Injectable, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Organization } from "../model/organization.entity";
import { User } from "../model/user.entity";

@Injectable()
export class OrganizationService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Organization) private readonly organizationRepository: Repository<Organization>
    ) {
    }

    async getRoots(): Promise<Array<Organization>> {
        const os = await this.organizationRepository.createQueryBuilder("o").leftJoinAndSelect("o.parent", "parent").getMany();
        return os.filter(o => !o.parent);
    }

    async getChildren(id: number): Promise<Array<Organization>> {
        const o: Organization|undefined = await this.organizationRepository.findOne(id, { relations: [ "children" ] });
        if (!o) {
            throw new HttpException("指定父组织id=" + id + "不存在", 402);
        }
        return o.children;
    }

    async getAll(): Promise<Array<Organization>> {
        return this.organizationRepository.find();
    }

    async createOrganization(name: string, parentId: number): Promise<void> {
        let parent: Organization|undefined;
        if (parentId !== undefined && parentId !== null) {
            parent = await this.organizationRepository.findOne(parentId);
            if (!parent) {
                throw new HttpException("指定父组织id=" + parentId + "不存在", 402);
            }
        }
        const exist: Organization|undefined = await this.organizationRepository.findOne({ name });
        if (exist) {
            throw new HttpException("指定名称name=" + name + "组织已存在", 403);
        }
        // 如果parent为undefined，则parentId为null
        const organization: Organization = this.organizationRepository.create({ name, parent });
        try {
            await this.organizationRepository.save(organization);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async updateOrganization(id: number, name: string, parentId: number): Promise<void> {
        const exist: Organization|undefined = await this.organizationRepository.findOne(id);
        if (!exist) {
            throw new HttpException("指定id=" + id + "组织不存在", 404);
        }
        if (name !== exist.name) {
            const exist: Organization|undefined = await this.organizationRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "组织已存在", 404);
            }
        }
        let parent: Organization|undefined ;
        if (parentId !== undefined && parentId !== null) {
            parent = await this.organizationRepository.findOne(parentId);
            if (!parent) {
                throw new HttpException("指定父组织id=" + parentId + "不存在", 402);
            }
        }
        try {
            // parent必须为null才有效，如果为undefined则不改动
            // 这一步与级联没有关系，不管级联如何设置
            exist.name = name;
            exist.parent = parent as any;
            await this.organizationRepository.save(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async deleteOrganization(id: number): Promise<void> {
        const exist: Organization|undefined = await this.organizationRepository.findOne(id, { relations: [ "children" ] });
        if (!exist) {
            throw new HttpException("指定id=" + id + "组织不存在", 404);
        }
        if (exist.children && exist.children.length > 0) {
            throw new HttpException("指定组织存在子组织，无法删除", 404);
        }
        try {
            await this.organizationRepository.remove(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async getUsersInOrganization(id: number): Promise<Array<User>> {
        const o: Organization|undefined = await this.organizationRepository.findOne(id, { relations: [ "users" ] });
        if (!o) {
            throw new HttpException("指定id=" + id + "父组织不存在", 402);
        }
        // 只获取不再回收站中的用户
        return o.users.filter(user => {
            return !user.recycle;
        });
    }

    async addUserToOrganization(id: number, userId: number): Promise<void> {
        const o: Organization|undefined = await this.organizationRepository.findOne(id, { relations: [ "users" ] });
        if (!o) {
            throw new HttpException("指定id=" + id + "组织不存在", 402);
        }
        const user: User|undefined = await this.userRepository.findOne(userId);
        if (!user) {
            throw new HttpException("指定id=" + userId + "用户不存在", 402);
        }
        const exist: User|undefined = o.users.find(user => {
            return user.id === userId;
        });
        if (exist) {
            throw new HttpException("指定用户id=" + userId + "已存在于指定组织id=" + id + "中", 402);
        }
        o.users.push(user);
        try {
            await this.organizationRepository.save(o);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async addUsersToOrganization(id: number, userIds: Array<number>): Promise<void> {
        const o: Organization |undefined = await this.organizationRepository.findOne(id, { relations: [ "users" ] });
        if (!o) {
            throw new HttpException("指定id=" + id + "组织不存在", 402);
        }
        const users: Array<User> = await this.userRepository.findByIds(userIds);
        // 验证是否所有需要的用户都被查询出来
        userIds.forEach(id => {
            const find: User|undefined = users.find(user => {
                return user.id === id;
            });
            if (!find) {
                throw new HttpException("指定id=" + id + "用户不存在", 402);
            }
        });
        // 验证是否有用户已存在于指定组织下
        o.users.forEach(user => {
            const match = userIds.find(id => {
                return id === user.id;
            });
            if (match) {
                throw new HttpException("指定用户id=" + user.id + "已存在于指定组织id=" + id + "中", 402);
            }
        });
        o.users.push(...users);
        try {
            await this.organizationRepository.save(o);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async removeUserFromOrganization(id: number, userId: number): Promise<void> {
        const o: Organization|undefined = await this.organizationRepository.findOne(id, { relations: [ "users" ] });
        if (!o) {
            throw new HttpException("指定id=" + id + "组织不存在", 402);
        }
        const user: User|undefined = await this.userRepository.findOne(userId);
        if (!user) {
            throw new HttpException("指定id=" + userId + "用户不存在", 402);
        }
        const index = o.users.findIndex(user => {
            return user.id === userId;
        });
        if (index < 0) {
            throw new HttpException("指定用户id=" + userId + "不存在于指定组织id=" + id + "中", 402);
        }
        o.users.splice(index, 1);
        try {
            await this.organizationRepository.save(o);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async removeUsersFromOrganization(id: number, userIds: Array<number>): Promise<void> {
        const o: Organization|undefined = await this.organizationRepository.findOne(id, { relations: [ "users" ] });
        if (!o) {
            throw new HttpException("指定id=" + id + "组织不存在", 402);
        }
        const users: Array<User> = await this.userRepository.findByIds(userIds);
        // 从组织的用户中循环移除指定用户，要求用户存在于数据库中，且用户必须已经存在于指定组织中
        userIds.forEach(userId => {
            const find: User|undefined = users.find(user => {
                return user.id === userId;
            });
            if (!find) {
                throw new HttpException("指定id=" + userId + "用户不存在", 402);
            }
            const index = o.users.findIndex(user => {
                return user.id === userId;
            });
            if (index < 0) {
                throw new HttpException("指定用户id=" + userId + "不存在于指定组织id=" + id + "中", 402);
            }
            o.users.splice(index, 1);
        });
        try {
            await this.organizationRepository.save(o);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }
}
