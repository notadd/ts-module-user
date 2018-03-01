import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Module } from './Module';
import { Func } from './Func';
import { User } from './User';

/* 角色，一般由后台创建，一个角色包含多个功能，进而包含了功能下的权限，具有指定特定操作的权限
   角色不能跨模块，所以它只能包含属于同一个模块下的功能，当删除模块时，其所属角色也会删除
*/
@Entity('role')
@Index('role_name_module_token', ['name', 'moduleToken'])
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

    /* 角色权限值，前端使用*/
    @Column({
        name: 'score',
        type: 'int'
    })
    score: number

    /* 角色包含功能，只能包含同一个模块下功能 */
    @ManyToMany(type => Func, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    @JoinTable({
        name: 'role_func'
    })
    funcs: Func[];

    /* 所属模块id */
    @Column()
    moduleToken: string

    /* 角色所属模块 */
    @ManyToOne(type => Module, module => module.roles, {
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: 'CASCADE',
        nullable: false,
        lazy: false,
        eager: false
    })
    @JoinColumn({
        name: 'moduleToken',
        referencedColumnName: 'token'
    })
    module: Module;

    /* 拥有这个角色的用户，删除角色时，需要删除关联关系 */
    @ManyToMany(type => User, user => user.roles, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    users: User[]
}