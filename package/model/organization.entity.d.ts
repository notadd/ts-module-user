import { User } from "./user.entity";
export declare class Organization {
    id: number;
    name: string;
    users: Array<User>;
    parentId: number;
    parent: Organization;
    children: Array<Organization>;
}
