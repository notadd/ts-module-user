import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable ,Index, ManyToOne, JoinColumn} from 'typeorm';

@Entity({
    name:'permission'
})
@Index('name_module_id',['name','module_id'])
export class Permission{

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

    @Column({
        name:'description',
        type:'varchar',
        length:'50'
    })
    description:string;

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

