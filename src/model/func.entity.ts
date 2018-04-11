import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Module } from "./module.entity";
import { Permission } from "./permission.entity";

/* 功能实体，功能是权限的集合
   功能与权限是多对多关系，但是功能是属于某个模块的，一个功能所包含的权限也都是同一个模块的
   模块删除时，其下包含的功能将会一起删除
*/
@Entity("function")
@Index("func_name_module_token", [ "name", "moduleToken" ])
export class Func {

    @PrimaryGeneratedColumn()
    id: number;

    /* 名称不能重复 */
    @Column({
        name: "name",
        type: "varchar",
        length: 20
    })
    name: string;

    /* 功能下的所有权限，这些权限也都是属于一个模块的
       功能删除时只会解除关系，而不是删除权限
    */
    @ManyToMany(type => Permission, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    @JoinTable({
        name: "function_permission",
    })
    permissions: Array<Permission>;

    /* 所属模块id */
    @Column()
    moduleToken: string;

    /* 功能所属模块，模块删除时功能会级联删除，但是由于模块下的权限、功能、角色本身之间还有关联关系，所以只能分别删除这三者，再单独删除模块，所以关闭级联 */
    @ManyToOne(type => Module, module => module.funcs, {
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
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
