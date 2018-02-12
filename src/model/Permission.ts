import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable ,Index, ManyToOne, JoinColumn} from 'typeorm';
import { Module } from './Module';


@Entity('permission')
@Index('name_module_id',['name','module_id'])
export class Permission{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        name:'name',
        type:'varchar',
        length:20
    })
    name:string;

    @Column({
        name:'description',
        type:'varchar',
        length:'50'
    })
    description:string;

    @Column()
    module_id:number

    @ManyToOne(type=>Module,module=>module.permissions,{
        cascadeInsert: true,
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

