import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from 'typeorm';
import { User } from './User';



/* 用户信息实体类，这里填的信息是用户现有信息之外的信息
*/
@Entity({
    name: 'user_info'
})
export class UserInfo {

    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int'
    })
    id: number;

    @Column({
        name: 'key',
        type: 'varchar',
        length: '20'
    })
    key: string

    @Column({
        name: 'value',
        type: 'varchar',
        length: '20'
    })
    value: string

    @ManyToOne(type=>User,user=>user.userInfos,{
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
        nullable: false,
        lazy: false,
        eager: false
    })
    user:User
}