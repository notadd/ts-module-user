import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne , ManyToMany ,JoinTable, JoinColumn} from 'typeorm';
import { Permission } from './Permission';
import { Module } from './Module';

@Entity({
    name:'function '
})
export class Func{

    @PrimaryGeneratedColumn({
        name:'id',
        type:'int'
    })
    id:number;

    @Column({
        name:'name',
        type:'varchar',
        length:20
    })
    name:string;

    @ManyToMany(type=>Permission,{
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy:false
    })
    @JoinTable({
        name: 'function_permission',
        joinColumn: {
            name: 'function_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        },
        database: 'user_pm'
    })
    permissions:Permission[];

    @ManyToOne(type=>Module,module=>module.funcs,{
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