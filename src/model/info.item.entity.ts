import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InfoGroup } from "./info.group.entity";
import { UserInfo } from "./user.info.entity";

/* 信息项实体，代表了用户需要额外填写的信息项
   信息项与信息组为多对多关系，这个关系只是为了方便调用
   信息项与用户也是多对多关系，这个关系是为了记录哪些信息已经被填写
*/
@Entity("info_item")
export class InfoItem {

    @PrimaryGeneratedColumn()
    id: number;

    /* 信息项名称，如用户名、密码等
       相互之间不能重复，也不能与已有的User实体属性重复
    */
    @Column({
        name: "name",
        length: "20",
        unique: true
    })
    name: string;

    /* 信息项标签，即前端显示中文名
    */
    @Column({
        name: "label",
        length: "20"
    })
    label: string;

    /* 是否为默认信息项，默认信息项不可删除、更改 、也不可添加到其他信息组中，默认信息项只能存在于默认信息组中*/
    @Column({
        name: "default",
    })
    default: boolean;

    /* 信息项描述 */
    @Column({
        name: "description",
        length: "40"
    })
    description: string;

    /* 信息项类型，即前端的表单类型
       根据不同的信息项，在UserInfo中存储时计算方式不同，key为信息项名称，value为值，统一为字符串
       文本框，都是存储为字符串
       单选框存储为值，多选框、复选框存储为逗号分割的值
       日期存储为字符串
       下拉菜单是神码
       图片、文件都先存储到云存储或者本地，然后存储其url
    */
    @Column({
        name: "type",
        length: 20
    })
    type: string;

    /* 是否必填信息项，当提交一个信息组信息时，如果必填信息项未填，会返回错误 */
    @Column({
        name: "necessary",
    })
    necessary: boolean;

    /* 注册页是否可见，如果注册页不可见，则当前端在注册请求信息项时不会返回
       一个必填项必须是注册页可见的，非必填项随意
    */
    @Column({
        name: "register_visible",
    })
    registerVisible: boolean;

    /* 资料页是否可见，当前端需要用户资料信息时返回给它，目前暂定不可见就不返回 */
    @Column({
        name: "information_visible",
    })
    informationVisible: boolean;

    /* 排序，由前端使用，后端不做验证(不要求一个信息组中信息项排序不可重复等等) */
    @Column({
        name: "order",
    })
    order: number;

    /* 信息项下的用户信息，当信息项删除时用户信息也会删除，用户信息中外键列infoItemId引用了信息项的id，当信息项名称修改后仍能找到其包含的信息 */
    @OneToMany(type => UserInfo, userInfo => userInfo.infoItem, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    userInfos: Array<UserInfo>;

    /* 所属信息组，一个信息项可能属于多个信息组 */
    @ManyToMany(type => InfoGroup, infoGroup => infoGroup.items, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    })
    groups: Array<InfoGroup>;
}
