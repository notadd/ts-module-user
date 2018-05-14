import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

/* 组织实体，组织可以互相包含，一个组织下可以包含多个组织，还可以包含多个用户
   组织完全与模块无关
*/
@Entity("organization")
export class Organization {

    @PrimaryGeneratedColumn()
    id: number;

    /* 组织名称不可重复 */
    @Column({
        name: "name",
        length: 20,
        unique: true
    })
    name: string;

    /* 组织下包含的用户，这些用户直属这个组织，与子组织无关 */
    @ManyToMany(type => User, user => user.organizations, {
        cascade: ["insert", "update"],
        lazy: false,
        eager: false
    })
    users: Array<User>;

    /* 父组织id，可以不存在父组织，说明为根组织 */
    @Column({
        name: "parentId",
        nullable: true
    })
    parentId: number;

    /* 父组织 */
    @ManyToOne(type => Organization, orientation => orientation.children, {
        cascade: ["insert", "update"],
        nullable: true,
        lazy: false,
        eager: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "parentId",
        referencedColumnName: "id"
    })
    parent: Organization;

    /* 子组织，当删除这个组织时，默认如果存在子组织，则报错不删除，如果指定force为true，则强制删除其所有子孙组织 */
    @OneToMany(type => Organization, orientation => orientation.parent, {
        cascade: ["insert", "update"],
        lazy: false,
        eager: false
    })
    children: Array<Organization>;
}
