import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InfoItem } from "./info.item.entity";
import { User } from "./user.entity";

/* 用户信息实体类，这里填的信息是用户现有信息之外的信息
*/
@Entity("user_info")
@Index("infoItemId_userId", [ "infoItemId", "userId" ])
export class UserInfo {

    @PrimaryGeneratedColumn()
    id: number;

    /* 信息项的值 */
    @Column({
        name: "value",
        type: "varchar",
        length: "120"
    })
    value: string;

    @Column({
        nullable: true
    })
    userId: number;

    /* 信息项所属用户 */
    @ManyToOne(type => User, user => user.userInfos, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        nullable: true,
        onDelete: "CASCADE",
        lazy: false,
        eager: false
    })
    @JoinColumn({
        name: "userId",
        referencedColumnName: "id"
    })
    user: User;

    @Column({
        nullable: true
    })
    infoItemId: number;

    /* 信息项所属用户 */
    @ManyToOne(type => InfoItem, infoItem => infoItem.userInfos, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        nullable: true,
        onDelete: "CASCADE",
        lazy: false,
        eager: false
    })
    @JoinColumn({
        name: "infoItemId",
        referencedColumnName: "id"
    })
    infoItem: InfoItem;
}
