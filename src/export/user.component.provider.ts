import { InjectRepository, getRepositoryToken } from "@nestjs/typeorm";
import { Permission } from "../model/permission.entity";
import { UserService } from "../service/user.service";
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
        private readonly userRepository: Repository<User>,
        private readonly userService: UserService
    ) { }

    /* 获取用户拥有权限 */
    async permissions(id: number): Promise<Array<Permission>> {
        return this.userService.permissions(id);
    }

    async getUserById(id: number): Promise<User | undefined> {
        return this.userRepository.findOne(id, { select: ["id", "userName", "status", "recycle"] });
    }

    async getUserByName(userName: string): Promise<User | undefined> {
        return this.userRepository.createQueryBuilder("user").select(["user.id", "user.userName", "user.status", "user.recycle"]).where({ userName }).getOne();
    }

    async isExist(user: { id: number, userName: string, status: boolean, recycle: boolean }): Promise<boolean> {
        const exist = await this.userRepository.findOne(user);
        return !!exist;
    }

    async createUser(organizationId: number, userName: string, password: string): Promise<void> {
        await this.userService.createUser(organizationId, userName, password);
    }

    async updateUser(id: number, userName: string, password: string): Promise<void> {
        await this.userService.updateUser(id, userName, password);
    }

    async setRoles(id: number, roleIds: Array<number>): Promise<void> {
        await this.userService.setRoles(id, roleIds);
    }

    async setPermissions(id: number, permissionIds: Array<number>): Promise<void> {
        await this.setPermissions(id, permissionIds);
    }
}

export const UserComponentToken = "UserComponentToken";

export const UserComponentProvider = {
    provide: UserComponentToken,
    useFactory: (funcRepository: Repository<Func>, roleRepository: Repository<Role>, userRepository: Repository<User>, userService: UserService) => {
        return new UserComponent(funcRepository, roleRepository, userRepository, userService);
    },
    inject: [getRepositoryToken(Func), getRepositoryToken(Role), getRepositoryToken(User), UserService]

};
