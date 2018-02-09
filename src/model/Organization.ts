import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne , OneToMany} from 'typeorm';
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
        length: 20
    })
    name: string;

    @ManyToMany(type => User,user=>user.organizations,{
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false
    })
    users: User[];

    @ManyToOne(type=>Organization,orientation=>orientation.children,{
        cascadeInsert: false,
        cascadeUpdate: false,
        cascadeRemove: false,
        lazy: false
    })
    parent:Organization;

    @OneToMany(type=>Organization,orientation=>orientation.parent,{
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: false
    })
    children:Organization[];
}