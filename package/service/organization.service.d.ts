import { Repository } from "typeorm";
import { Organization } from "../model/organization.entity";
import { User } from "../model/user.entity";
export declare class OrganizationService {
    private readonly userRepository;
    private readonly organizationRepository;
    constructor(userRepository: Repository<User>, organizationRepository: Repository<Organization>);
    getRoots(): Promise<Array<Organization>>;
    getChildren(id: number): Promise<Array<Organization>>;
    getAll(): Promise<Array<Organization>>;
    createOrganization(name: string, parentId: number): Promise<void>;
    updateOrganization(id: number, name: string, parentId: number): Promise<void>;
    deleteOrganization(id: number): Promise<void>;
    getUsersInOrganization(id: number): Promise<Array<User>>;
    addUserToOrganization(id: number, userId: number): Promise<void>;
    addUsersToOrganization(id: number, userIds: Array<number>): Promise<void>;
    removeUserFromOrganization(id: number, userId: number): Promise<void>;
    removeUsersFromOrganization(id: number, userIds: Array<number>): Promise<void>;
}
