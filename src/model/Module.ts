import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { Permission } from './Permission';
import { Func } from './Func';

@Entity({
    name: 'module'
})
export class Module {

    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int'
    })
    id: number;

    @Column({
        name: 'name',
        type: 'varchar',
        length: 20,
        unique:true
    })
    name: string;

    @OneToMany(type => Permission, permission => permission.module, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false
    })
    permissions: Permission[];

    @OneToMany(type => Func, func => func.module, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false
    })
    funcs: Func[];
}
