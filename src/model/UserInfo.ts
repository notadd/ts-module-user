import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { InfoItem } from './InfoItem';
import { User } from './User';

/* 用户信息实体类，这里填的信息是用户现有信息之外的信息
*/
@Entity('user_info')
@Index('key_userId', ['key', 'userId'])
export class UserInfo {

    @PrimaryGeneratedColumn()
    id: number;

    /* 信息项的值 */
    @Column({
        name: 'value',
        type: 'varchar',
        length: '120'
    })
    value: string

    @Column({
        nullable:true
    })
    userId: number

    /* 信息项所属用户 */
    @ManyToOne(type => User, user => user.userInfos, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        nullable: true,
        onDelete: 'CASCADE',
        lazy: false,
        eager: false
    })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'id'
    })
    user: User

    @Column({
        nullable:true
    })
    key: string

    /* 信息项所属用户 */
    @ManyToOne(type => InfoItem, infoItem => infoItem.userInfos, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        nullable: true,
        onDelete: 'CASCADE',
        lazy: false,
        eager: false
    })
    @JoinColumn({
        name: 'key',
        referencedColumnName: 'name'
    })
    infoItem: InfoItem
}