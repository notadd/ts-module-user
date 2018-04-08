import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ScoreType } from './ScoreType.entity';
import { User } from './User.entity';

/* 积分值，属于用户 */
@Entity('score')
@Index('scoreTypeId_userId', [ 'scoreTypeId', 'userId' ])
export class Score {

    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'integer'
    })
    id: number;

    /* 积分值，要采用定点小数存储，浮点数存储会有误差，小数点后6位，小数点前8位 */
    @Column({
        name: 'value',
        type: 'decimal',
        precision: 14,
        scale: 6
    })
    value: number

    @Column()
    scoreTypeId: number

    /*积分所属积分类型，当积分类型删除时所有积分会级联删除，由于积分不被其他表引用，所以级联删除不会出现问题
      之所以不使用积分类型名称作为被引用的键，是因为积分类型名称可以修改，而要保证修改后的积分类型仍能找到所属积分必须将积分与积分类型关联起来
      如同用户信息与信息项关联起来
    */
    @ManyToOne(type => ScoreType, scoreType => scoreType.scores, {
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: 'CASCADE',
        lazy: false,
        eager: false
    })
    @JoinColumn({
        name: 'scoreTypeId',
        referencedColumnName: 'id'
    })
    scoreType: ScoreType

    @Column()
    userId: number

    @ManyToOne(type => User, user => user.scores, {
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
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
