import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable ,Index, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { Permission } from './Permission';


@Entity({
    name:'module'
})
@Index('name_module_id',['name','module_id'])
export class Module{

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

    @OneToMany(type=>Permission,permission=>permission.module,{
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy:false
    })
    permissions:Permission[];
}
