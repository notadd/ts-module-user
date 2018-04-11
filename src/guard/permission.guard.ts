import { CanActivate, ExecutionContext, Guard, Inject } from "@nestjs/common";
import { IncomingMessage } from "http";
import { PERMISSION_CONTROLLER_AND, PERMISSION_CONTROLLER_OR } from "../decorator/permission.controller";
import { UserComponent } from "../export/user.component.provider";
import { Permission } from "../model/permission.entity";
import { User } from "../model/user.entity";

export const MODULE_TOKEN = "module_token";

@Guard()
export class PermissionGuard implements CanActivate {

    constructor(
        @Inject("UserComponentToken") private readonly userComponent: UserComponent
    ) {
    }

    /* 对类、方法上的控制权限进行判断，用来判断请求是否可以通过
       如果类、方法上都有控制权限，必须分别通过，才可通过，也就是and关系
       在类或者方法上，必须通过所有and权限，且通过or权限之一才可通过，也就是顶层关系为and
       classAnd1&&classAnd2&&(classOr1||classOr2) && method_and1&&method_and2&&(method_or1||method2)
    */
    async canActivate(req: IncomingMessage, context: ExecutionContext): Promise<boolean> {
        const { parent, handler } = context;
        // 从头信息中获取token，进而获取到用户id，这部分暂时未接入
        const auth = req.headers.authentication;
        // 用户，从token中获得
        const user: User = { id: 1, recycle: false, status: true } as User;
        // 获取用户此时拥有的权限，已经根据角色、增权限、减权限计算出了最终拥有的权限
        let permissions: Array<Permission>;
        // 用户存在
        if (user) {
            // 获取用户具有的权限
            permissions = await this.userComponent.permissions(user.id);
            // 回收站用户不能访问任何接口
            if (user.recycle) {
                return false;
            }
            // 封禁用户不具有任何权限
            if (!user.status) {
                permissions = [];
            }
        } else {
            // 用户不存在，权限为空
            permissions = [];
        }

        // 获取类上定义权限
        const classOr: Array<string> = Reflect.getMetadata(PERMISSION_CONTROLLER_OR, parent) || [];
        const classAnd: Array<string> = Reflect.getMetadata(PERMISSION_CONTROLLER_AND, parent) || [];
        // 在onModuleInit方法中设置，模块名称，用来判断权限属于哪个模块
        const token = Reflect.getMetadata(MODULE_TOKEN, parent);
        // 检查类上控制权限
        const classPass = this.checkPermission(permissions, classAnd, classOr, token);
        if (!classPass) return false;
        // 获取方法上定义权限
        const methodOr: Array<string> = Reflect.getMetadata(PERMISSION_CONTROLLER_OR, handler) || [];
        const methodAnd: Array<string> = Reflect.getMetadata(PERMISSION_CONTROLLER_AND, handler) || [];
        // 检查方法上控制权限
        const methodPass = this.checkPermission(permissions, methodAnd, methodOr, token);
        return methodPass;
    }

    /*  对拥有的权限进行检查，返回是否通过,类检查一次，方法检查一次*/
    checkPermission(permissions: Array<Permission>, and: Array<string>, or: Array<string>, token: string): boolean {
        // 遍历类上and权限，如果不存在，则不进入循环
        for (let i = 0; i < and.length; i++) {
            const name = and[ i ];
            // 在用户拥有权限中查找
            const find = permissions.find(per => {
                // 必须名称、token都相同才可以，因为不同模块下权限名可以相同
                return per.name === name && per.moduleToken === token;
            });
            // 如果没找到，说明一个and权限未通过
            if (!find) {
                return false;
            }
        }
        // 遍历类上or权限，如果有一个通过即通过，如果不存在不进入循环
        for (let i = 0; i < or.length; i++) {
            const name = or[ i ];
            // 在用户拥有权限中查找
            const find = permissions.find(per => {
                // 必须名称、token都相同才可以，因为不同模块下权限名可以相同
                return per.name === name && per.moduleToken === token;
            });
            // 如果找到，说明一个or权限通过,退出循环
            if (find) {
                break;
            }
            // 如果未找到，继续找，如果已经是最后一个or权限还未找到，则返回false
            if (i === or.length - 1) {
                return false;
            }
        }
        return true;
    }
}
