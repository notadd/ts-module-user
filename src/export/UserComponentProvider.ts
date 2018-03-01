import { HttpException, Component, Inject } from '@nestjs/common';
import { Permission } from '../model/Permission';
import { Repository } from 'typeorm';
import { User } from '../model/User';
import { Role } from '../model/Role';
import { Func } from '../model/Func';
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
            throw new HttpException('指定用户不存在', 406)
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

}

export const UserComponentProvider = {
    provide: 'UserComponentToken',
    useFactory: (funcRepository: Repository<Func>, roleRepository: Repository<Role>, userRepository: Repository<User>) => {
        return new UserComponent(funcRepository, roleRepository, userRepository)
    },
    inject: ['UserPMModule.FuncRepository', 'UserPMModule.RoleRepository', 'UserPMModule.UserRepository']

}