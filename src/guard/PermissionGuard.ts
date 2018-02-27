import { PERMISSION_CONTROLLER_AND, PERMISSION_CONTROLLER_OR } from '../decorator/PermissionController';
import { Guard, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { UserService } from '../service/UserService';
import { Permission } from '../model/Permission';
import { IncomingMessage } from 'http';
export const MODULE_TOKEN = 'module_token'



@Guard()
export class PermissionGuard implements CanActivate {

    constructor(
        @Inject(UserService) private readonly userService: UserService
    ) { }

    async canActivate(req: IncomingMessage, context: ExecutionContext): Promise<boolean> {
        let { parent, handler } = context
        //从头信心中获取token，进而获取到用户id，这部分暂时未接入
        let auth = req.headers['authentication']
        //用户id
        let id = 1
        //获取用户此时拥有的权限，已经根据角色、增权限、减权限计算出了最终拥有的权限
        let permissions: Permission[] = await this.userService.permissions(id)
        //获取类上定义权限
        let class_or:string[] = Reflect.getMetadata(PERMISSION_CONTROLLER_OR,parent)
        let class_and:string[] = Reflect.getMetadata(PERMISSION_CONTROLLER_AND,parent)
        //遍历类上and权限
        for(let per of class_and)

        return true;
    }
}