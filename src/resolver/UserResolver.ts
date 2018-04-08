import { HttpException, Inject, UseInterceptors } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { ExceptionInterceptor } from '../interceptor/ExceptionInterceptor';
import { Data } from '../interface/Data';
import { CreateUserBody } from '../interface/user/CreateUserBody';
import { FreedomUsersData } from '../interface/user/FreedomUsersData';
import { PermissionsData } from '../interface/user/PermissionsData';
import { RecycleUsersData } from '../interface/user/RecycleUsersData';
import { RolesData } from '../interface/user/RolesData';
import { UnionUserInfo } from '../interface/user/UnionUserInfo';
import { UpdateUserBody } from '../interface/user/UpdateUserBody';
import { UserInfosData } from '../interface/user/UserInfosData';
import { UsersData } from '../interface/user/UsersData';
import { UserService } from '../service/UserService';

@Resolver('User')
@UseInterceptors(ExceptionInterceptor)
export class UserResolver {

    constructor(
        @Inject(UserService) private readonly userService: UserService
    ) {
    }

    /* 获取当前所有用户 */
    @Query('users')
    async users(): Promise<UsersData> {
        let users = await this.userService.getAll()
        return { code: 200, message: '获取所有用户成功', users }
    }

    /* 获取当前所有自由用户，即不属于任何组织的用户 */
    @Query('freedomUsers')
    async freedomUsers(): Promise<FreedomUsersData> {
        let freedomUsers = await this.userService.getFreedomUsers()
        return { code: 200, message: '获取所有自由用户成功', freedomUsers }
    }

    /* 获取当前所有回收站用户，即被软删除的用户 */
    @Query('recycleUsers')
    async recycleUsers(): Promise<RecycleUsersData> {
        let recycleUsers = await this.userService.getRecycleUsers()
        return { code: 200, message: '获取所有回收站用户成功', recycleUsers }
    }

    @Query('userInfos')
    async userInfos(req: IncomingMessage, body: { id: number }): Promise<UserInfosData> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        let userInfos = await this.userService.userInfos(id)
        return { code: 200, message: '获取指定用户信息成功', userInfos }
    }

    @Query('rolesInUser')
    async rolesInUser(req: IncomingMessage, body: { id: number }): Promise<RolesData> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        let roles = await this.userService.roles(id)
        return { code: 200, message: '获取指定用户角色成功', roles }
    }

    @Query('permissionsInUser')
    async permissionsInUser(req: IncomingMessage, body: { id: number }): Promise<PermissionsData> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        let permissions = await this.userService.permissions(id)
        return { code: 200, message: '获取指定用户角色成功', permissions }
    }

    /* 后台创建用户接口，只包含通用信息项，不包含特殊信息项
       模块创建用户不使用这个接口，因为模块创建用户需要添加特殊信息项
    */
    @Mutation('createUser')
    async createUser(req: IncomingMessage, body: CreateUserBody): Promise<Data> {
        let { organizationId, userName, password } = body
        if (!userName || !password) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.createUser(organizationId, userName, password)
        return { code: 200, message: '创建用户成功' }
    }

    /* 模块创建用户接口，会传递用户基本信息，与这个模块调用的信息组的信息，不同类型信息组处理方式不同
       传递信息的方式为groups对象数组，每个对象包含了信息组id，以及信息数组，信息组id用来验证信息是否正确
    */
    @Mutation('createUserWithUserInfo')
    async createUserWithUserInfo(req: IncomingMessage, body: CreateUserBody & { groups: { groupId: number, infos: UnionUserInfo[] }[] }): Promise<Data> {
        let { organizationId, userName, password, groups } = body
        if (!userName || !password) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.createUserWithUserInfo(req, organizationId, userName, password, groups)
        return { code: 200, message: '创建用户成功' }
    }

    @Mutation('addUserInfo')
    async addUserInfo(req: IncomingMessage, body: { id: number, groups: { groupId: number, infos: UnionUserInfo[] }[] }): Promise<Data> {
        let { id, groups } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.addUserInfoToUser(req, id, groups)
        return { code: 200, message: '创建用户成功' }
    }

    @Mutation('updateUser')
    async updateUser(req: IncomingMessage, body: UpdateUserBody): Promise<Data> {
        let { id, userName, password } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.updateUser(id, userName, password)
        return { code: 200, message: '更新用户成功' }
    }

    @Mutation('bannedUser')
    async bannedUser(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.bannedUser(id)
        return { code: 200, message: '封禁用户成功' }
    }

    @Mutation('unBannedUser')
    async unBannedUser(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.unBannedUser(id)
        return { code: 200, message: '解封用户成功' }
    }

    /* 软删除指定用户，即将其加入回收站 */
    @Mutation('softDeleteUser')
    async softDeleteUser(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.softDeleteUser(id)
        return { code: 200, message: '删除用户到回收站成功' }
    }

    /* 将指定用户从回收站还原 */
    @Mutation('restoreUser')
    async restoreUser(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.restoreUser(id)
        return { code: 200, message: '还原用户成功' }
    }

    /* 将指定多个用户从回收站还原 */
    @Mutation('restoreUsers')
    async restoreUsers(req: IncomingMessage, body: { ids: number[] }): Promise<Data> {
        let { ids } = body
        if (!ids || ids.length === 0) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.restoreUsers(ids)
        return { code: 200, message: '还原多个用户成功' }
    }

    @Mutation('deleteUser')
    async deleteUser(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let { id } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.deleteUser(id)
        return { code: 200, message: '删除用户成功' }
    }

    @Mutation('deleteUsers')
    async deleteUsers(req: IncomingMessage, body: { ids: number[] }): Promise<Data> {
        let { ids } = body
        if (!ids || ids.length === 0) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.deleteUsers(ids)
        return { code: 200, message: '删除用户成功' }
    }

    /* 设置用户角色，设置的角色就是用户以后拥有的所有角色 */
    @Mutation('setRoles')
    async setRoles(req: IncomingMessage, body: { id: number, roleIds: number[] }): Promise<Data> {
        let { id, roleIds } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.setRoles(id, roleIds)
        return { code: 200, message: '设置用户角色成功' }
    }

    /* 设置用户权限，设置的权限是最终结果，也就是说按照role、adds、reduces等生成的最终结果，由后端来进行差分运算，计算adds、reduces */
    @Mutation('setUserOwnPermissions')
    async setUserOwnPermissions(req: IncomingMessage, body: { id: number, permissionIds: number[] }): Promise<Data> {
        let { id, permissionIds } = body
        if (!id) {
            throw new HttpException('缺少参数', 400)
        }
        await this.userService.setPermissions(id, permissionIds)
        return { code: 200, message: '设置用户权限成功' }
    }

}
