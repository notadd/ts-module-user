import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { InfoItem } from './InfoItem';

/* 信息组，包含多个信息项
   目前信息组不属于任何模块，会写入一些默认信息组，由不同模块根据id调用信息组，一个模块可能会调用多个信息组
   模块在什么时候调用信息组，还是未知
   对于一个用户来说，一个信息组是否填写会与用户关联起来，如果一个信息组填写了，会在关联表中保存这个信息组与用户的一个关联记录
   前端可以查询某个用户的某个信息组是否填写，如果未填写可以调用信息组，并且为用户补充信息
*/
@Entity('info_group')
export class InfoGroup {

    /* 信息组id不能自动生成，因为前面几个id的信息组都是约定好的，信息组id由方法内根据当前最大id生成 */
    @PrimaryColumn({
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

    /* 是否为默认信息组，默认信息组不可删除 */
    @Column({
        name: 'default',
        type: 'tinyint'
    })
    default: boolean

    /* 信息组状态，是否可用 */
    @Column({
        name: 'status',
        type: 'tinyint'
    })
    status: boolean

    /* 信息项与信息组是多对多关系
       如果在组a中已经有了信息项X，组b也有信息向X
       而组a已经被填写过了，即此时这个用户的X信息项存在
       那么当添加组b时由前端将X信息项当前值显示出来
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