import { FreedomUsersData } from '../interface/user/FreedomUsersData';
import { RecycleUsersData } from '../interface/user/RecycleUsersData';
import { CreateUserBody } from '../interface/user/CreateUserBody';
import { UpdateUserBody } from '../interface/user/UpdateUserBody';
import { UserInfosData } from '../interface/user/UserInfosData';
import { UnionUserInfo } from '../interface/user/UnionUserInfo';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UsersData } from '../interface/user/UsersData';
import { Inject, HttpException } from '@nestjs/common';
import { UserService } from '../service/UserService';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';

@Resolver('User')
export class UserResolver {

    constructor(
        @Inject(UserService) private readonly userService: UserService
    ) { }

    /* 获取当前所有用户 */
    @Query('users')
    async users(): Promise<UsersData> {
        let data: UsersData = {
            code: 200,
            message: '获取所有用户成功',
            users: []
        }
        try {
            data.users = await this.userService.getAll()
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

    /* 获取当前所有自由用户，即不属于任何组织的用户 */
    @Query('freedomUsers')
    async freedomUsers(): Promise<FreedomUsersData> {
        let data: FreedomUsersData = {
            code: 200,
            message: '获取所有自由用户成功',
            freedomUsers: []
        }
        try {
            data.freedomUsers = await this.userService.getFreedomUsers()
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

    /* 获取当前所有回收站用户，即被软删除的用户 */
    @Query('recycleUsers')
    async recycleUsers(): Promise<RecycleUsersData> {
        let data: RecycleUsersData = {
            code: 200,
            message: '获取所有回收站用户成功',
            recycleUsers: []
        }
        try {
            data.recycleUsers = await this.userService.getRecycleUsers()
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }


    @Query('userInfos')
    async userInfos(req: IncomingMessage, body: { id: number }): Promise<UserInfosData> {
        let data: UserInfosData = {
            code: 200,
            message: '获取指定用户信息成功',
            userInfos: []
        }
        try {
            let { id } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            data.userInfos = await this.userService.userInfos(id)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data

    }

    /* 后台创建用户接口，只包含通用信息项，不包含特殊信息项
       模块创建用户不使用这个接口，因为模块创建用户需要添加特殊信息项
    */
    @Mutation('createUser')
    async createUser(req: IncomingMessage, body: CreateUserBody): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '创建用户成功'
        }
        try {
            let { organizationId, userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber } = body
            if (!userName || !password || !nickname || !realName || !sex || !birthday || !email || !cellPhoneNumber) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.createUser(organizationId, userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

    @Mutation('updateUser')
    async updateUser(req: IncomingMessage, body: UpdateUserBody): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '更新用户成功'
        }
        try {
            let { id, userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.updateUser(id, userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

    @Mutation('bannedUser')
    async bannedUser(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '封禁用户成功'
        }
        try {
            let { id } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.bannedUser(id)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

    @Mutation('unBannedUser')
    async unBannedUser(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '解封用户成功'
        }
        try {
            let { id } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.unBannedUser(id)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

    /* 软删除指定用户，即将其加入回收站 */
    @Mutation('softDeleteUser')
    async softDeleteUser(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '删除用户到回收站成功'
        }
        try {
            let { id } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.softDeleteUser(id)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

    /* 将指定用户从回收站还原 */
    @Mutation('restoreUser')
    async restoreUser(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '还原用户成功'
        }
        try {
            let { id } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.restoreUser(id)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

    /* 将指定多个用户从回收站还原 */
    @Mutation('restoreUsers')
    async restoreUsers(req: IncomingMessage, body: { ids: number[] }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '还原多个用户成功'
        }
        try {
            let { ids } = body
            if (!ids || ids.length === 0) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.restoreUsers(ids)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

    @Mutation('deleteUser')
    async deleteUser(req: IncomingMessage, body: { id: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '删除用户成功'
        }
        try {
            let { id } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.deleteUser(id)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

    @Mutation('deleteUsers')
    async deleteUsers(req: IncomingMessage, body: { ids: number[] }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '删除用户成功'
        }
        try {
            let { ids } = body
            if (!ids || ids.length === 0) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.deleteUsers(ids)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

    /* 模块创建用户接口，会传递用户基本信息，与这个模块调用的信息组的信息，不同类型信息组处理方式不同
       传递信息的方式为groups对象数组，每个对象包含了信息组id，以及信息数组，信息组id用来验证信息是否正确
    */
    @Mutation('createUserWithUserInfo')
    async createUserWithUserInfo(req: IncomingMessage, body: CreateUserBody & { groups: { groupId: number, infos: UnionUserInfo[] }[] }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '创建用户成功'
        }
        try {
            let { organizationId, userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber, groups } = body
            if (!userName || !password || !nickname || !realName || !sex || !birthday || !email || !cellPhoneNumber || !status) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.createUserWithUserInfo(req, organizationId, userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber, groups)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }


    @Mutation('addUserInfoToUser')
    async addUserInfoToUser(req: IncomingMessage, body: { id: number, groups: { groupId: number, infos: UnionUserInfo[] }[] }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '创建用户成功'
        }
        try {
            let { id, groups } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.addUserInfoToUser(req, id, groups)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

}