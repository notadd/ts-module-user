import { FreedomUsersData } from '../interface/user/FreedomUsersData';
import { CreateUserBody } from '../interface/user/CreateUserBody';
import { UpdateUserBody } from '../interface/user/UpdateUserBody';
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
            message: '获取所有用户成功',
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
            let { organizationId, userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber, status } = body
            if (!userName || !password || !nickname || !realName || !sex || !birthday || !email || !cellPhoneNumber || !status) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.createUser(organizationId, userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber, status)
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
            let { id, userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber, status } = body
            if (!id) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.updateUser(id,userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber, status)
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
            let { organizationId, userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber, status, groups } = body
            if (!userName || !password || !nickname || !realName || !sex || !birthday || !email || !cellPhoneNumber || !status) {
                throw new HttpException('缺少参数', 400)
            }
            await this.userService.createUserWithUserInfo(req, organizationId, userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber, status, groups)
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