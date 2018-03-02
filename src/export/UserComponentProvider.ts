import { HttpException, Component, Inject } from '@nestjs/common';
import { Permission } from '../model/Permission';
import { Repository } from 'typeorm';
import { User } from '../model/User';
import { Role } from '../model/Role';
import { Func } from '../model/Func';
import * as crypto from 'crypto';
import * as path from 'path';


export class UserComponent {

    constructor(
        @Inject('UserPMModule.FuncRepository') private readonly funcRepository: Repository<Func>,
        @Inject('UserPMModule.RoleRepository') private readonly roleRepository: Repository<Role>,
        @Inject('UserPMModule.UserRepository') private readonly userRepository: Repository<User>
    ) { }

    async permissions(id: number): Promise<Permission[]> {
        let user: User = await this.userRepository.findOneById(id, { relations: ['roles', 'adds', 'reduces'] })
        if (!user) {
            return []
        }
        //声明最后的结果
        let result: Permission[] = []
        //声明临时结果，未去重
        let temp: Permission[] = []
        //用来去重的集合
        let ids: Set<number> = new Set()
        //遍历获取所有角色拥有的权限
        for (let i = 0; i < user.roles.length; i++) {
            let role: Role = await this.roleRepository.findOneById(user.roles[i].id, { relations: ['funcs'] })
            for (let j = 0; j < role.funcs.length; j++) {
                let func: Func = await this.funcRepository.findOneById(role.funcs[i].id, { relations: ['permissions'] })
                temp = temp.concat(func.permissions)
            }
        }
        //生成去重的集合
        temp.forEach(per => {
            if (!ids.has(per.id)) {
                ids.add(per.id)
                result.push(per)
            }
        })
        //遍历添加权限
        user.adds.forEach(per => {
            if (!ids.has(per.id)) {
                ids.add(per.id)
                result.push(per)
            }
        })
        //遍历减去权限
        user.reduces.forEach(per => {
            if (ids.has(per.id)) {
                ids.delete(per.id)
                let index = result.findIndex(p => {
                    return p.id === per.id
                })
                result.splice(index, 1)
            }
        })
        result.sort((a, b) => {
            return a.id - b.id
        })
        return result
    }

    /* 用户登录方法，登录用户要求用户名与密码匹配，用户密码为加盐生成
       回收站用户不能登录
       封禁用户可以登录但是没有权限
    */
    async login(userName: string, password: string): Promise<boolean> {
        let user: User = await this.userRepository.findOne({ userName })
        if (!user) {
            return false
        }
        /* 回收站用户不可登录 */
        if (user.recycle) {
            return false
        }
        let passwordWithSalt = crypto.createHash('md5').update(password + user.salt).digest('hex')
        if (passwordWithSalt !== user.password) {
            return false
        }
        return true
    }

    async getUser(id: number): Promise<{ id: number, userName: string }> {
        return await this.userRepository.findOneById(id, { select: ['id', 'userName'] })
    }

}

export const UserComponentProvider = {
    provide: 'UserComponentToken',
    useFactory: (funcRepository: Repository<Func>, roleRepository: Repository<Role>, userRepository: Repository<User>) => {
        return new UserComponent(funcRepository, roleRepository, userRepository)
    },
    inject: ['UserPMModule.FuncRepository', 'UserPMModule.RoleRepository', 'UserPMModule.UserRepository']

}