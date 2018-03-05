import { Entity, Column, PrimaryColumn, Index, OneToMany } from 'typeorm';
import { Permission } from './Permission';
import { Func } from './Func';
import { Role } from './Role';


/* 模块实体，这个模块实体主要用于存储权限
   这个实体不提供写入接口，当用户中心模块启动时，扫描所有Module,获取其组件、控制器上的Permission定义
   然后将模块与其对应的权限存储到数据库，所有的权限只能由模块本身装饰器提供，因为权限是写死在代码里的
   当删除模块时也会删除其下所有权限
*/
@Entity('module')
export class Module {

    @PrimaryColumn({
        name: 'token',
        type: 'varchar',
        length: 100
    })
    token: string;

    /* 模块下存储的权限 */
    @OneToMany(type => Permission, permission => permission.module, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager:false
    })
    permissions: Permission[];

    /* 模块下的功能，删除模块时，一起删除 */
    @OneToMany(type => Func, func => func.module, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager:false
    })
    funcs: Func[];

    /* 模块下的角色，删除模块时统一删除 */
    @OneToMany(type => Role, role => role.module, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager:false
    })
    roles: Role[];

}
