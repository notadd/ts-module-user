import { OrganizationsData } from '../interface/organization/OrganizationsData';
import { OrganizationService } from '../service/OrganizationService';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { HttpException, Inject } from '@nestjs/common';
import { Data } from '../interface/Data';
import { IncomingMessage } from 'http';
@Resolver('Organization')
export class OrganizationResolver {

    constructor(
        @Inject(OrganizationService) private readonly organizationService: OrganizationService
    ) { }

    @Query('roots')
    async roots(): Promise<OrganizationsData> {
        let data: OrganizationsData = {
            code: 200,
            message: '获取所有根组织成功',
            organizations: []
        }
        try {
            data.organizations = await this.organizationService.getRoots()
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }


    @Query('organizations')
    async organizations(): Promise<OrganizationsData> {
        let data: OrganizationsData = {
            code: 200,
            message: '获取所有组织成功',
            organizations: []
        }
        try {
            data.organizations = await this.organizationService.getAll()
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }

    @Mutation('createOrganization')
    async createOrganization(req: IncomingMessage, body: { name: string, parentId: number }): Promise<Data> {
        let data: Data = {
            code: 200,
            message: '创建组织成功'
        }
        try {
            let { name, parentId } = body
            if (!name) {
                throw new HttpException('缺少参数', 400)
            }
            if (parentId && !Number.isInteger(parentId)) {
                throw new HttpException('父组织Id不是整数', 401)
            }
            await this.organizationService.createOrganization(name, parentId)
        } catch (err) {
            if (err instanceof HttpException) {
                data.code = err.getStatus()
                data.message = err.getResponse() + ''
            } else {
                console.log(err)
                data.code = 500
                data.message = '出现了意外错误' + err.toString()
            }
        }
        return data
    }
}