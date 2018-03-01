import { PERMISSION_CONTROLLER_AND, PERMISSION_CONTROLLER_OR } from '../decorator/PermissionController';
import { Guard, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { UserComponent } from '../export/UserComponentProvider';
import { Permission } from '../model/Permission';
import { IncomingMessage } from 'http';


export const MODULE_TOKEN = 'module_token';

@Guard()
export class PermissionGuard implements CanActivate {

    constructor(
        @Inject('UserComponentToken') private readonly userComponent: UserComponent
    ) { }

    /* 对类、方法上的控制权限进行判断，用来判断请求是否可以通过
       如果类、方法上都有控制权限，必须分别通过，才可通过，也就是and关系
       在类或者方法上，必须通过所有and权限，且通过or权限之一才可通过，也就是顶层关系为and
       class_and1&&class_and2&&(class_or1||class_or2) && method_and1&&method_and2&&(method_or1||method2)
    */
    async canActivate(req: IncomingMessage, context: ExecutionContext): Promise<boolean> {
        let { parent, handler } = context
        //从头信心中获取token，进而获取到用户id，这部分暂时未接入
        let auth = req.headers['authentication']
        //用户id
        let id = 1
        //获取用户此时拥有的权限，已经根据角色、增权限、减权限计算出了最终拥有的权限
        let permissions: Permission[] = await this.userComponent.permissions(id)
        //获取类上定义权限
        let class_or: string[] = Reflect.getMetadata(PERMISSION_CONTROLLER_OR, parent) || []
        let class_and: string[] = Reflect.getMetadata(PERMISSION_CONTROLLER_AND, parent) || []
        //在onModuleInit方法中设置，模块名称，用来判断权限属于哪个模块
        let token = Reflect.getMetadata(MODULE_TOKEN, parent)
        //检查类上控制权限
        let classPass = this.checkPermission(permissions, class_and, class_or, token)
        if (!classPass) return false
        //获取方法上定义权限
        let method_or: string[] = Reflect.getMetadata(PERMISSION_CONTROLLER_OR, handler) || []
        let method_and: string[] = Reflect.getMetadata(PERMISSION_CONTROLLER_AND, handler) || []
        //检查方法上控制权限
        let methodPass = this.checkPermission(permissions, method_and, method_or, token)
        return methodPass
    }

    /*  对拥有的权限进行检查，返回是否通过,类检查一次，方法检查一次*/
    checkPermission(permissions: Permission[], and: string[], or: string[], token: string): boolean {
        //遍历类上and权限，如果不存在，则不进入循环
        for (let i = 0; i < and.length; i++) {
            let name = and[i]
            //在用户拥有权限中查找
            let find = permissions.find(per => {
                //必须名称、token都相同才可以，因为不同模块下权限名可以相同
                return per.name === name && per.moduleToken === token
            })
            //如果没找到，说明一个and权限未通过
            if (!find) {
                return false
            }
        }
        //遍历类上or权限，如果有一个通过即通过，如果不存在不进入循环
        for (let i = 0; i < or.length; i++) {
            let name = or[i]
            //在用户拥有权限中查找
            let find = permissions.find(per => {
                //必须名称、token都相同才可以，因为不同模块下权限名可以相同
                return per.name === name && per.moduleToken === token
            })
            //如果找到，说明一个or权限通过,退出循环
            if (find) {
                break
            }
            //如果未找到，继续找，如果已经是最后一个or权限还未找到，则返回false
            if (i === or.length - 1) {
                return false
            }
        }
        return true
    }
}