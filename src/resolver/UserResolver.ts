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

    @Query('users')
    async users():Promise<UsersData>{
        let data:UsersData={
            code:200,
            message:'获取所有用户成功',
            users:[]
        }
        try{
            data.users = await this.userService.getAll()
        }catch (err) {
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

    /* 后台创建用户接口，只包含通用信息项，不包含特殊信息项 */
    @Mutation('createUser')
    async createUser(req: IncomingMessage, body: { organizationId: number, userName: string, password: string, nickname: string, realName: string, sex: string, birthday: string, email: string, cellPhoneNumber: string, status: boolean }): Promise<Data> {
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


}