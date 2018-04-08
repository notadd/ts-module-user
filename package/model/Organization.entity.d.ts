import { User } from './User.entity';
export declare class Organization {
    id: number;
    name: string;
    users: User[];
    parentId: number;
    parent: Organization;
    children: Organization[];
}
