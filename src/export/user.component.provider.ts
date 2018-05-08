import { getRepositoryToken } from "@nestjs/typeorm/typeorm.utils";
import { Permission } from "../model/permission.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Func } from "../model/func.entity";
import { Role } from "../model/role.entity";
import { User } from "../model/user.entity";
import { Repository } from "typeorm";
import * as crypto from "crypto";

/* 用户模块向其他模块提供的导出组件类 */
export class UserComponent {

    constructor(
        private readonly funcRepository: Repository<Func>,
        private readonly roleRepository: Repository<Role>,
        private readonly userRepository: Repository<User>
    ) {
    }

    async permissions(id: number): Promise<Array<Permission>> {
        const user: User | undefined = await this.userRepository.findOneById(id, { relations: ["roles", "adds", "reduces"] });
        if (!user) {
            return [];
        }
        // 声明最后的结果
        const result: Array<Permission> = [];
        // 声明临时结果，未去重
        let temp: Array<Permission> = [];
        // 用来去重的集合
        const ids: Set<number> = new Set();
        // 遍历获取所有角色拥有的权限
        for (let i = 0; i < user.roles.length; i++) {
            const role: Role | undefined = await this.roleRepository.findOneById(user.roles[i].id, { relations: ["funcs"] });
            if (role && role.funcs && role.funcs.length > 0) {
                for (let j = 0; j < role.funcs.length; j++) {
                    const func: Func | undefined = await this.funcRepository.findOneById(role.funcs[i].id, { relations: ["permissions"] });
                    if (func) {
                        temp = temp.concat(func.permissions);
                    }
                }
            }

        }
        // 生成去重的集合
        temp.forEach(per => {
            if (!ids.has(per.id)) {
                ids.add(per.id);
                result.push(per);
            }
        });
        // 遍历添加权限
        user.adds.forEach(per => {
            if (!ids.has(per.id)) {
                ids.add(per.id);
                result.push(per);
            }
        });
        // 遍历减去权限
        user.reduces.forEach(per => {
            if (ids.has(per.id)) {
                ids.delete(per.id);
                const index = result.findIndex(p => {
                    return p.id === per.id;
                });
                result.splice(index, 1);
            }
        });
        result.sort((a, b) => {
            return a.id - b.id;
        });
        return result;
    }

    /* 用户登录方法，登录用户要求用户名与密码匹配，用户密码为加盐生成
       回收站用户不能登录
       封禁用户可以登录但是没有权限
    */
    async login(userName: string, password: string): Promise<boolean | User | undefined> {
        const user: User | undefined = await this.userRepository.findOne({ userName });
        if (!user) {
            return false;
        }
        /* 回收站用户不可登录 */
        if (user.recycle) {
            return false;
        }
        const passwordWithSalt = crypto.createHash("sha256").update(password + user.salt).digest("hex");
        if (passwordWithSalt !== user.password) {
            return false;
        }
        return this.userRepository.findOneById(user.id, { select: ["id", "userName", "status", "recycle"] });
    }

    async getUserById(id: number): Promise<User | undefined> {
        return this.userRepository.findOneById(id, { select: ["id", "userName", "status", "recycle"] });
    }

    async getUserByName(userName: string): Promise<User | undefined> {
        return this.userRepository.createQueryBuilder("user").select(["user.id", "user.userName", "user.status", "user.recycle"]).where({ userName }).getOne();
    }

    async isExist(user: { id: number, userName: string, status: boolean, recycle: boolean }): Promise<boolean> {
        const exist = await this.userRepository.findOne(user);
        return !!exist;
    }

}

export const UserComponentToken = "UserComponentToken";

export const UserComponentProvider = {
    provide: UserComponentToken,
    useFactory: (funcRepository: Repository<Func>, roleRepository: Repository<Role>, userRepository: Repository<User>) => {
        return new UserComponent(funcRepository, roleRepository, userRepository);
    },
    inject: [getRepositoryToken(Func), getRepositoryToken(Role), getRepositoryToken(User)]

};
