import { HttpException , Inject , Component } from '@nestjs/common';
import { Organization } from '../model/Organization';
import { Repository } from 'typeorm';
@Component()
export class OrganizationService{

    constructor(
        @Inject('UserPMModule.OrganizationRepository') private readonly organizationRepository:Repository<Organization>
    ){}

    async getAll():Promise<Organization[]>{
        try{
            return await this.organizationRepository.find()
        }catch(err){
            throw new HttpException('数据库错误'+err.toString(),401)
        }
    }
}