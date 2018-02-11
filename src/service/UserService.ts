import { HttpException, Inject, Component } from '@nestjs/common';
import { Organization } from '../model/Organization';
import { Repository } from 'typeorm';
import { User } from '../model/User';

@Component()
export class UserService {

    constructor(
        @Inject('UserPMModule.UserRepository') private readonly userRepository: Repository<User>,
        @Inject('UserPMModule.OrganizationRepository') private readonly organizationRepository: Repository<Organization>
    ) { }

    async createUser(organizationId, userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber, status): Promise<void> {
        let organization: Organization
        if (organizationId) {
            organization = await this.organizationRepository.findOneById(organizationId, { relations: ['users'] })
            if (!organization) {
                throw new HttpException('指定组织不存在', 402)
            }
        }
        let exist: User = await this.userRepository.findOne({ userName })
        if (exist) {
            throw new HttpException('指定用户名已存在', 406)
        }
        let user: User = this.userRepository.create({ userName, password, nickname, realName, sex, birthday, email, cellPhoneNumber, status, organizations: [organization] })
        try {
            await this.organizationRepository.save(user)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 405)
        }
    }


}
