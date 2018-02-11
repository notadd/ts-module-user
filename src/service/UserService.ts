import { HttpException, Inject, Component } from '@nestjs/common';
import { Organization } from '../model/Organization';
import { Repository } from 'typeorm';
import { User } from '../model/User';
import * as crypto from 'crypto';
@Component()
export class UserService {

    constructor(
        @Inject('UserPMModule.UserRepository') private readonly userRepository: Repository<User>,
        @Inject('UserPMModule.OrganizationRepository') private readonly organizationRepository: Repository<Organization>
    ) { }


    async getAll():Promise<User[]>{
        return await this.userRepository.find()
    }

    async createUser(organizationId: number, userName: string, password: string, nickname: string, realName: string, sex: string, birthday: string, email: string, cellPhoneNumber: string, status: boolean): Promise<void> {
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
        try {
            let salt = crypto.createHash('md5').update(new Date().toString()).digest('hex').slice(0, 10)
            let passwordWithSalt = crypto.createHash('md5').update(password + salt).digest('hex')
            let user: User = this.userRepository.create({ userName, password: passwordWithSalt, salt, nickname, realName, sex, birthday: new Date(birthday), email, cellPhoneNumber, status, organizations: [organization] })
            await this.userRepository.save(user)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 405)
        }
    }


}
