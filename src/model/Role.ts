import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Func } from './Func';
import { Module } from './Module';

/* 角色，一般由后台创建，一个角色包含多个功能，进而包含了功能下的权限，具有指定特定操作的权限
   角色不能跨模块，所以它只能包含属于同一个模块下的功能，当删除模块时，其所属角色也会删除
*/
@Entity('role')
@Index('name_module_id',['name','module_id'])
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    /* 角色名称，同一个模块下不能重复 */
    @Column({
        name: 'name',
        type: 'varchar',
        length: 20
    })
    name: string;

    /* 角色包含功能，只能包含同一个模块下功能 */
    @ManyToMany(type => Func, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false
    })
    @JoinTable({
        name: 'role_function',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'function_id',
            referencedColumnName: 'id'
        },
        database: 'user_pm'
    })
    funcs: Func[];

    /* 所属模块id */
    @Column()
    module_id: number

    /* 角色所属模块 */
    @ManyToOne(type => Module, module => module.roles, {
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
        nullable: false,
        lazy: false
    })
    @JoinColumn({
        name: 'module_id',
        referencedColumnName: 'id'
    })
    module: Module;
}