import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';


@Entity('organization')
export class Organization {

    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int'
    })
    id: number;

    @Column({
        name: 'name',
        type: 'varchar',
        length: 20,
        unique: true
    })
    name: string;

    @ManyToMany(type => User, user => user.organizations, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false
    })
    users: User[];


    @Column({
        name: 'parentId',
        type: 'int',
        nullable: true
    })
    parentId: number

    @ManyToOne(type => Organization, orientation => orientation.children, {
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: true,
        eager: false
    })
    @JoinColumn({
        name: 'parentId',
        referencedColumnName: 'id'
    })
    parent: Organization;

    @OneToMany(type => Organization, orientation => orientation.parent, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: false,
        eager: false
    })
    children: Organization[];
}