import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Organization } from './Organization';
import { Permission } from './Permission';
import { InfoItem } from './InfoItem';
import { UserInfo } from './UserInfo';
import { Score } from './Score';
import { Role } from './Role';

/* 用户实体类，id自动生成、用户名必须唯一
   用户可以属于多个组织，也可以不属于组织，为自由用户
   用户拥有多个角色、进而拥有其下的权限
   用户还可以单独指定增加、减少的权限，用来对角色权限做补充
*/
@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    /* 用户名，不能重复 */
    @Column({
        name: 'user_name',
        type: 'varchar',
        length: '20',
        unique: true
    })
    userName: string;

    /* 用户密码，为加盐密码 */
    @Column({
        name: 'password',
        type: 'varchar',
        length: 40
    })
    password: string

    /* 密码的盐，10位随机字符串 */
    @Column({
        name: 'salt',
        type: 'varchar',
        length: 10
    })
    salt: string;

    /* 状态，是否封禁 */
    @Column({
        name: 'status',
        type: 'tinyint'
    })
    status: boolean

    /* 状态，是否处于回收站 */
    @Column({
        name: 'recycle',
        type: 'tinyint'
    })
    recycle: boolean

    /* 用户所包含信息，为调用信息组生成的信息 */
    @OneToMany(type => UserInfo, userInfo => userInfo.user, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    userInfos: UserInfo[]

    /* 用户的各个积分值 */
    @OneToMany(type => Score, score => score.user, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    scores: Score[]

    /* 用户已经填写的信息项，用户只保存与用户信息以及信息项的关系，不保存与信息组的关系*/
    @ManyToMany(type => InfoItem, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    @JoinTable({
        name: 'user_infoitem'
    })
    infoItems: InfoItem[]

    /* 用户添加的权限 */
    @ManyToMany(type => Permission, permission => permission.addUsers, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    @JoinTable({
        name: 'user_adds_permission'
    })
    adds: Permission[]

    /* 用户减少的权限 */
    @ManyToMany(type => Permission, permission => permission.reduceUsers, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    @JoinTable({
        name: 'user_reduces_permission'
    })
    reduces: Permission[]

    /* 用户拥有的角色 */
    @ManyToMany(type => Role, role => role.users, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    @JoinTable({
        name: 'user_role'
    })
    roles: Role[]

    /* 用户所属组织 */
    @ManyToMany(type => Organization, organization => organization.users, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: false,
        eager: false
    })
    @JoinTable({
        name: 'organization_user'
    })
    organizations: Organization[]
}