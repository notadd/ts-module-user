import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Module } from "./module.entity";
import { User } from "./user.entity";

/* 权限实体，代表了执行某种操作的权限，属于某个模块
   目前所有权限由模块中使用装饰器提供，找到权限之后保存它
   不能在后台添加权限，因为添加也没用，权限的使用是写死在代码里的
   同一个模块下权限名不能重复，不同模块下可以重复
   当删除模块时，所有权限也会删除
*/
@Entity("permission")
@Index("name_module_token", [ "name", "moduleToken" ])
export class Permission {

    @PrimaryGeneratedColumn()
    id: number;

    /* 权限名，不同模块下可以重复 */
    @Column({
        name: "name",
        length: 20
    })
    name: string;

    /* 权限描述 */
    @Column({
        name: "description",
        length: "50"
    })
    description: string;

    /*单独添加了权限的用户 */
    @ManyToMany(type => User, user => user.adds, {
        cascade: ["insert"],
        lazy: false,
        eager: false
    })
    addUsers: Array<User>;

    /*单独减去了权限的用户 */
    @ManyToMany(type => User, user => user.reduces, {
        cascade: ["insert"],
        lazy: false,
        eager: false
    })
    reduceUsers: Array<User>;

    /* 所属模块id */
    @Column({
        length: 100
    })
    moduleToken: string;

    /* 所属模块 ，当模块删除之前需要单独删除权限，否则数据库外键检查会报错*/
    @ManyToOne(type => Module, module => module.permissions, {
        cascade: ["insert"],
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    })
    @JoinColumn({
        name: "moduleToken",
        referencedColumnName: "token"
    })
    module: Module;
}
