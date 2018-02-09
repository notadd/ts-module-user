import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ClosureEntity, TreeChildren, TreeLevelColumn, TreeParent } from 'typeorm';
import { User } from './User';


@ClosureEntity('organization')
export class Organization {

    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int'
    })
    id: number;

    @Column({
        name: 'name',
        type: 'varchar',
        length: 20
    })
    name: string;

    @ManyToMany(type => User,user=>user.organizations,{
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false
    })
    users: User[];

    @TreeParent({
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false
    })
    parent:Organization;

    @TreeChildren({
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false
    })
    children:Organization[];
}