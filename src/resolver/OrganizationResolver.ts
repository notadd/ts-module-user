import { HttpException, Inject, UseInterceptors } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Data } from '../interface/Data';
import { ChildrenData } from '../interface/organization/ChildrenData';
import { OrganizationsData } from '../interface/organization/OrganizationsData';
import { RootsData } from '../interface/organization/RootsData';
import { UsersInOrganizationData } from '../interface/organization/UsersInOrganizationData';
import { OrganizationService } from '../service/OrganizationService';

@Resolver('Organization')
@UseInterceptors(ExceptionInterceptor)
export class OrganizationResolver {

    constructor(
        @Inject(OrganizationService) private readonly organizationService: OrganizationService
    ) {
    }

    /* 查找所有根组织 */
    @Query('roots')
    async roots(): Promise<RootsData> {
        let roots = await this.organizationService.getRoots()
        return { code: 200, message: '获取所有根组织成功', roots }
    }

    /* 查找指定组织的所有子组织 */
    @Query('children')
    async children(req: IncomingMessage, body: { id: number }): Promise<ChildrenData> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        let children = await this.organizationService.getChildren(id)
        return { code: 200, message: '获取子组织成功', children }
    }

    /* 查找所有现存组织 */
    @Query('organizations')
    async organizations(): Promise<OrganizationsData> {
        let organizations = await this.organizationService.getAll()
        return { code: 200, message: '获取所有组织成功', organizations: [] }
    }

    /* 创建指定名称组织，可选是否指定父组织id */
    @Mutation('createOrganization')
    async createOrganization(req: IncomingMessage, body: { name: string, parentId: number }): Promise<Data> {
        let { name, parentId } = body
        if (!name) {
            throw new HttpException('缺少参数', 400)
        }
        if (parentId && !Number.isInteger(parentId)) {
            throw new HttpException('父组织Id不是整数', 401)
        }
        await this.organizationService.createOrganization(name, parentId)
        return { code: 200, message: '创建组织成功' }
    }

    /* 更新指定id组织，可更新组织名、父组织 */
    @Mutation('updateOrganization')
    async updateOrganization(req: IncomingMessage, body: { id: number, name: string, parentId: number }): Promise<Data> {
        let { id, name, parentId } = body
        if (!id || !name) {
            throw new HttpException('缺少参数', 400)
        }
        if (parentId && !Number.isInteger(parentId)) {
            throw new HttpException('父组织Id不是整数', 401)
        }
        await this.organizationService.updateOrganization(id, name, parentId)
        return { code: 200, message: '更新组织成功' }
    }

    /* 删除指定id组织，默认情况下有子组织会报错，不能删除
       可以指定force=true，强制删除组织及其子孙组织
    */
    @Mutation('deleteOrganization')
    async deleteOrganization(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.organizationService.deleteOrganization(id)
        return { code: 200, message: '删除组织成功' }
    }

    /* 查找指定组织下所有用户 */
    @Query('usersInOrganization')
    async usersInOrganization(req: IncomingMessage, body: { id: number }): Promise<UsersInOrganizationData> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        let users = await this.organizationService.getUsersInOrganization(id)
        return { code: 200, message: '获取组织用户成功', users }
    }

    /* 向指定组织添加一个指定用户 */
    @Mutation('addUserToOrganization')
    async addUserToOrganization(req: IncomingMessage, body: { id: number, userId: number }): Promise<Data> {
        let { id, userId } = body
        if (!id || !userId) {
            throw new HttpException('缺少参数', 400)
        }
        await this.organizationService.addUserToOrganization(id, userId)
        return { code: 200, message: '向组织添加用户成功', }
    }

    /* 向指定组织添加多个指定用户 */
    @Mutation('addUsersToOrganization')
    async addUsersToOrganization(req: IncomingMessage, body: { id: number, userIds: number[] }): Promise<Data> {
        let { id, userIds } = body
        if (!id || !userIds || userIds.length === 0) {
            throw new HttpException('缺少参数', 400)
        }
        await this.organizationService.addUsersToOrganization(id, userIds)
        return { code: 200, message: '向组织添加多个用户成功' }
    }

    /* 将指定用户从组织中移除 */
    @Mutation('removeUserFromOrganization')
    async removeUserFromOrganization(req: IncomingMessage, body: { id: number, userId: number }): Promise<Data> {
        let { id, userId } = body
        if (!id || !userId) {
            throw new HttpException('缺少参数', 400)
        }
        await this.organizationService.removeUserFromOrganization(id, userId)
        return { code: 200, message: '从组织移除用户成功' }
    }

    /* 将指定多个用户从组织中移除 */
    @Mutation('removeUsersFromOrganization')
    async removeUsersFromOrganization(req: IncomingMessage, body: { id: number, userIds: number[] }): Promise<Data> {
        let { id, userIds } = body
        if (!id || !userIds || userIds.length === 0) {
            throw new HttpException('缺少参数', 400)
        }
        await this.organizationService.removeUsersFromOrganization(id, userIds)
        return { code: 200, message: '从组织移除多个用户成功' }
    }

}
