import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { ScoreType } from './ScoreType';
import { User } from './User';

/* 积分值，属于用户 */
@Entity('score')
export class Score {

    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int'
    })
    id: number;

    /* 积分类型名称，默认的积分类型有贡献、积分、余额、威望*/
    @Column({
        name: 'name',
        type: 'varchar',
        length: '20',
        unique: true
    })
    name: string

    /* 积分值，要采用定点小数存储，浮点数存储会有误差，小数点后6位，小数点前8位 */
    @Column({
        name: 'value',
        type: 'decimal',
        precision:14,
        scale:6
    })
    value: number

    @ManyToOne(type => ScoreType, scoreType => scoreType.scores, {
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: 'CASCADE',
        lazy: false,
        eager: false
    })
    scoreType: ScoreType

    @ManyToOne(type => User, user => user.scores, {
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: 'CASCADE',
        lazy: false,
        eager: false
    })
    user: User

}
