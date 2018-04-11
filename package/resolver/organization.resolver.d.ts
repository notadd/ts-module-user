/// <reference types="node" />
import { IncomingMessage } from "http";
import { Data } from "../interface/data";
import { ChildrenData } from "../interface/organization/children.data";
import { OrganizationsData } from "../interface/organization/organizations.data";
import { RootsData } from "../interface/organization/roots.data";
import { UsersInOrganizationData } from "../interface/organization/users.in.organization.data";
import { OrganizationService } from "../service/organization.service";
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
        userIds: Array<number>;
    }): Promise<Data>;
    removeUserFromOrganization(req: IncomingMessage, body: {
        id: number;
        userId: number;
    }): Promise<Data>;
    removeUsersFromOrganization(req: IncomingMessage, body: {
        id: number;
        userIds: Array<number>;
    }): Promise<Data>;
}
