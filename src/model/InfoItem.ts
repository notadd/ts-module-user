import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { InfoGroup } from './InfoGroup';

/* 信息项实体，代表了用户需要额外填写的信息项
*/
@Entity({
    name: 'info_item'
})
export class InfoItem {

    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int'
    })
    id: number;

    /* 信息项名称，如用户名、密码等 
       相互之间不能重复，也不能与已有的User实体属性重复
    */
    @Column({
        name: 'name',
        type: 'varchar',
        length: '20',
        unique:true
    })
    name: string

    /* 信息项描述 */
    @Column({
        name: 'description',
        type: 'varchar',
        length: '40'
    })
    description: string

    /* 信息项类型，即前端的表单类型 */
    @Column({
        name: 'type',
        type: 'enum',
        enum: ['单行文本框', '多行文本框', '单选框', '多选框', '复选框', '日期时间选择', '日期时间范围选择', '下拉菜单', '上传图片', '上传文件']
    })
    type: string

    /* 是否必填信息项 */
    @Column({
        name: 'necessary',
        type: 'tinyint'
    })
    necessary: boolean

    /* 排序 */
    @Column({
        name: 'order',
        type: 'int'
    })
    order: number

    /* 所属信息组 */
    @ManyToMany(type => InfoGroup, infoGroup => infoGroup.items, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    groups: InfoGroup[]
}