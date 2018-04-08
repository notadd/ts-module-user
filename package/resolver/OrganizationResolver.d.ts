/// <reference types="node" />
import { IncomingMessage } from 'http';
import { Data } from '../interface/Data';
import { ChildrenData } from '../interface/organization/ChildrenData';
import { OrganizationsData } from '../interface/organization/OrganizationsData';
import { RootsData } from '../interface/organization/RootsData';
import { UsersInOrganizationData } from '../interface/organization/UsersInOrganizationData';
import { OrganizationService } from '../service/OrganizationService';
export declare class OrganizationResolver {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    roots(): Promise<RootsData>;
    children(req: IncomingMessage, body: {
        id: number;
    }): Promise<ChildrenData>;
    organizations(): Promise<OrganizationsData>;
    createOrganization(req: IncomingMessage, body: {
        name: string;
        parentId: number;
    }): Promise<Data>;
    updateOrganization(req: IncomingMessage, body: {
        id: number;
        name: string;
        parentId: number;
    }): Promise<Data>;
    deleteOrganization(req: IncomingMessage, body: {
        id: number;
    }): Promise<Data>;
    usersInOrganization(req: IncomingMessage, body: {
        id: number;
    }): Promise<UsersInOrganizationData>;
    addUserToOrganization(req: IncomingMessage, body: {
        id: number;
        userId: number;
    }): Promise<Data>;
    addUsersToOrganization(req: IncomingMessage, body: {
        id: number;
        userIds: number[];
    }): Promise<Data>;
    removeUserFromOrganization(req: IncomingMessage, body: {
        id: number;
        userId: number;
    }): Promise<Data>;
    removeUsersFromOrganization(req: IncomingMessage, body: {
        id: number;
        userIds: number[];
    }): Promise<Data>;
}
