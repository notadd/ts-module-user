import { Repository } from 'typeorm';
import { Organization } from '../model/Organization.entity';
import { User } from '../model/User.entity';
export declare class OrganizationService {
    private readonly userRepository;
    private readonly organizationRepository;
    constructor(userRepository: Repository<User>, organizationRepository: Repository<Organization>);
    getRoots(): Promise<Organization[]>;
    getChildren(id: number): Promise<Organization[]>;
    getAll(): Promise<Organization[]>;
    createOrganization(name: string, parentId: number): Promise<void>;
    updateOrganization(id: number, name: string, parentId: number): Promise<void>;
    deleteOrganization(id: number): Promise<void>;
    getUsersInOrganization(id: number): Promise<User[]>;
    addUserToOrganization(id: number, userId: number): Promise<void>;
    addUsersToOrganization(id: number, userIds: number[]): Promise<void>;
    removeUserFromOrganization(id: number, userId: number): Promise<void>;
    removeUsersFromOrganization(id: number, userIds: number[]): Promise<void>;
}
