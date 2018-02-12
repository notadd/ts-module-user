import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne , ManyToMany ,JoinTable, JoinColumn} from 'typeorm';
import { Func } from './Func';
import { Module } from './Module';

@Entity('role')
export class Role{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        name:'name',
        type:'varchar',
        length:20
    })
    name:string;

    @ManyToMany(type=>Func,{
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy:false
    })
    @JoinTable({
        name: 'role_function',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'function_id',
            referencedColumnName: 'id'
        },
        database: 'user_pm'
    })
    funcs:Func[];

    @ManyToOne(type=>Module,module=>module.roles,{
        cascadeInsert:true,
        cascadeUpdate: false,
        cascadeRemove: false,
        nullable: false,
        lazy:false
    })
    @JoinColumn({
        name:'module_id',
        referencedColumnName:'id'
    })
    module:Module;
}