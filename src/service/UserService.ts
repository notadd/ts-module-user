import { HttpException, Inject, Component } from '@nestjs/common';
import { Organization } from '../model/Organization';
import { Repository } from 'typeorm';
import { User } from '../model/User';

@Component()
export class UserService{

    constructor(
        @Inject('UserPMModule.UserRepository') private readonly userRepository: Repository<User>,
        @Inject('UserPMModule.OrganizationRepository') private readonly organizationRepository: Repository<Organization>
    ){}

    
}
