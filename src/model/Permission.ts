import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable ,Index, ManyToOne, JoinColumn} from 'typeorm';
import { Module } from './Module';
import { User } from './User'
/* 权限实体，代表了执行某种操作的权限，属于某个模块
   目前所有权限由模块中使用装饰器提供，找到权限之后保存它
   不能在后台添加权限，因为添加也没用，权限的使用是写死在代码里的
   同一个模块下权限名不能重复，不同模块下可以重复
   当删除模块时，所有权限也会删除
*/
@Entity('permission')
@Index('name_module_id',['name','module_id'])
export class Permission{

    @PrimaryGeneratedColumn()
    id:number;

    /* 权限名，不同模块下可以重复 */
    @Column({
        name:'name',
        type:'varchar',
        length:20
    })
    name:string;

    /* 权限描述 */
    @Column({
        name:'description',
        type:'varchar',
        length:'50'
    })
    description:string;

    /* 所属模块id */
    @Column()
    module_id:number

    /* 所属模块 */
    @ManyToOne(type=>Module,module=>module.permissions,{
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
        nullable: false,
        lazy:false
    })
    @JoinColumn({
        name:'module_id',
        referencedColumnName:'id'
    })
    module:Module;

    /* 单独添加了这个权限的用户，这个关联关系需要在删除权限时删除 */
    @ManyToMany(type => User, user=>user.adds,{
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager:false
    })
    addUsers:User[]
}

