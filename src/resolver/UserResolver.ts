import { Resolver,Query,Mutation } from '@nestjs/graphql';
import { UserService } from '../service/UserService';


@Resolver('User')
export class UserResolver{

    constructor(
        @Inject(UserService) private readonly userService:UserService
    ){}
}