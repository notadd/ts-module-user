import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Score } from './Score';
/* 积分类型 */
@Entity('score_type')
export class ScoreType {

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

    /* 积分值类型，只能为float、int两种，根据类型不同，解析方式不同*/
    @Column({
        name: 'type',
        type: 'enum',
        enum: ['float', 'int']
    })
    type: string

    /* 是否为默认积分类型，默认类型不可删除、更改 */
    @Column({
        name: 'default',
        type: 'tinyint'
    })
    default: boolean

    @Column({
        name: 'description',
        type: 'varchar'
    })
    description: string

    /* 这个积分类型下的所有积分值 */
    @OneToMany(type => Score, score => score.scoreType, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    scores: Score[]

}
