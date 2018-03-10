import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { InfoItem } from './InfoItem';

/* 信息组，包含多个信息项
   目前信息组不属于任何模块，会写入一些默认信息组，由不同模块根据id调用信息组，一个模块可能会调用多个信息组
   模块在什么时候调用信息组，还是未知
   所谓信息组只是信息的分组，不代表其他东西，用户只会保存已经填写的信息项，以及相应的信息
   信息组只是为了方便调用多个信息项
*/
@Entity('info_group')
export class InfoGroup {

    /* 信息组id不能自动生成，因为前面几个id的信息组都是约定好的，信息组id由方法内根据当前最大id生成 */
    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int'
    })
    id: number;

    /* 组名不能重复 */
    @Column({
        name: 'name',
        type: 'varchar',
        length: '20',
        unique: true
    })
    name: string

    /* 是否为默认信息组，默认信息组不可删除、更改 */
    @Column({
        name: 'default',
        type: 'tinyint'
    })
    default: boolean

    /* 信息组状态，是否可用，目前还未启用这个特性 */
    @Column({
        name: 'status',
        type: 'tinyint'
    })
    status: boolean

    /* 信息项与信息组是多对多关系，当删除信息组时只是解除关联而已，信息组与信息项的删除分别进行
    */
    @ManyToMany(type => InfoItem, infoItem => infoItem.groups, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    @JoinTable({
        name: 'infogroup_infoitem'
    })
    items: InfoItem[]
}