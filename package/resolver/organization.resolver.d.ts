/// <reference types="express" />
import { UsersInOrganizationData } from "../interface/organization/users.in.organization.data";
import { OrganizationsData } from "../interface/organization/organizations.data";
import { ChildrenData } from "../interface/organization/children.data";
import { OrganizationService } from "../service/organization.service";
import { RootsData } from "../interface/organization/roots.data";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class OrganizationResolver {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    roots(): Promise<RootsData>;
    children(req: Request, body: {
        id: number;
    }): Promise<ChildrenData>;
    organizations(): Promise<OrganizationsData>;
    createOrganization(req: Request, body: {
        name: string;
        parentId: number;
    }): Promise<Data>;
    updateOrganization(req: Request, body: {
        id: number;
        name: string;
        parentId: number;
    }): Promise<Data>;
    deleteOrganization(req: Request, body: {
        id: number;
    }): Promise<Data>;
    usersInOrganization(req: Request, body: {
        id: number;
    }): Promise<UsersInOrganizationData>;
    addUserToOrganization(req: Request, body: {
        id: number;
        userId: number;
    }): Promise<Data>;
    addUsersToOrganization(req: Request, body: {
        id: number;
        userIds: Array<number>;
    }): Promise<Data>;
    removeUserFromOrganization(req: Request, body: {
        id: number;
        userId: number;
    }): Promise<Data>;
    removeUsersFromOrganization(req: Request, body: {
        id: number;
        userIds: Array<number>;
    }): Promise<Data>;
}
