import { OrganizationsData } from '../interface/organization/OrganizationsData';
import { OrganizationService } from '../service/OrganizationService';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { HttpException, Inject } from '@nestjs/common';
@Resolver('Organization')
export class OrganizationResolver {

    constructor(
        @Inject(OrganizationService) private readonly organizationService: OrganizationService
    ) { }

    @Query('organizations')
    async organizations(): OrganizationsData {
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

}