import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Organization } from './Organization';
import { Permission } from './Permission';
import { Role } from './Role';

/* 用户实体类，id自动生成、用户名、邮箱必须唯一
   用户拥有角色、增加权限、减少权限、属于组织，都是多对多关系
*/
@Entity({
    name: 'user'
})
export class User {

    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int'
    })
    id: number;

    @Column({
        name: 'user_name',
        type: 'varchar',
        length: '20',
        unique:true
    })
    userName: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: 40
    })
    password: string

    @Column({
        name: 'salt',
        type: 'varchar',
        length: 20
    })
    salt: string;

    @Column({
        name: 'email',
        type: 'varchar',
        length: 30,
        unique:true
    })
    email: string;

    @Column({
        name: 'nickname',
        type: 'varchar',
        length: 20
    })
    nickname: string;

    @Column({
        name: 'real_name',
        type: 'varchar',
        length: '20'
    })
    realName: string;

    @Column({
        name: 'sex',
        type: 'enum',
        enum: ['men', 'women']
    })
    sex: string

    @Column({
        name: 'birthday',
        type: 'date'
    })
    data: Date

    @Column({
        name: 'status',
        type: 'tinyint'
    })
    status: boolean

    @ManyToMany(type => Permission, permission => permission.user, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false
    })
    @JoinTable({
        name:'user_add_permission',
        joinColumn:{
            name:'user_id',
            referencedColumnName:'id'
        },
        inverseJoinColumn:{
            name:'permission_id',
            referencedColumnName:'id'
        },
        database:'user_pm'
    })
    adds:Permission[]

    @ManyToMany(type => Permission, permission => permission.user, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false
    })
    @JoinTable({
        name:'user_reduce_permission',
        joinColumn:{
            name:'user_id',
            referencedColumnName:'id'
        },
        inverseJoinColumn:{
            name:'permission_id',
            referencedColumnName:'id'
        },
        database:'user_pm'
    })
    reduces:Permission[]


    @ManyToMany(type => Role, role => role.user, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false
    })
    @JoinTable({
        name:'user_role',
        joinColumn:{
            name:'user_id',
            referencedColumnName:'id'
        },
        inverseJoinColumn:{
            name:'role_id',
            referencedColumnName:'id'
        },
        database:'user_pm'
    })
    roles:Role[]

    @ManyToMany(type => Organization, organization => organization.user, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false
    })
    @JoinTable({
        name:'organization_user',
        joinColumn:{
            name:'user_id',
            referencedColumnName:'id'
        },
        inverseJoinColumn:{
            name:'organization_id',
            referencedColumnName:'id'
        },
        database:'user_pm'
    })
    organizations:Organization[]
}