import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';

/*  */
@Entity('organization')
export class Organization {

    @PrimaryGeneratedColumn()
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
        cascadeUpdate: true,
        lazy: false,
        eager:false
    })
    users: User[];


    @Column({
        name: 'parentId',
        type: 'int',
        nullable: true
    })
    parentId: number

    @ManyToOne(type => Organization, orientation => orientation.children, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: false,
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