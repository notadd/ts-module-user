import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { User } from './User';

/* 用户信息实体类，这里填的信息是用户现有信息之外的信息
*/
@Entity('user_info')
@Index('key_userId', ['key', 'userId'])
export class UserInfo {

    @PrimaryGeneratedColumn()
    id: number;

    /* 信息项名称,同一个用户下信息项名称不能重复 */
    @Column({
        name: 'key',
        type: 'varchar',
        length: '20'
    })
    key: string

    /* 信息项的值 */
    @Column({
        name: 'value',
        type: 'varchar',
        length: '20'
    })
    value: string

    @Column()
    userId: Number

    /* 信息项所属用户 */
    @ManyToOne(type => User, user => user.userInfos, {
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
        nullable: false,
        onDelete: 'CASCADE',
        lazy: false,
        eager: false
    })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'id'
    })
    user: User
}