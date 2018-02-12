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

    /* 信息项类型，即前端的表单类型 
       根据不同的信息项，在UserInfo中存储时存储方式不同，key为信息项名称，value为值，统一为字符串
       文本框，都是存储为字符串
       单选框存储为值，多选框、复选框存储为逗号分割的值
       日期存储为字符串
       下拉菜单是神码
       图片、文件都先存储到云存储或者本地，然后存储其url
    */
    @Column({
        name: 'type',
        type: 'enum',
        enum: ['单行文本框', '多行文本框', '单选框', '多选框', '复选框', '日期时间选择', '日期时间范围选择', '下拉菜单', '上传图片', '上传文件']
    })
    type: string

    /* 是否必填信息项，非必填信息项，如果未填写就不返回 */
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

    /* 所属信息组，一个信息项可能属于多个信息组 */
    @ManyToMany(type => InfoGroup, infoGroup => infoGroup.items, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    groups: InfoGroup[]
}