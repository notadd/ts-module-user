import { Module, MiddlewaresConsumer, NestModule, RequestMethod, Inject } from '@nestjs/common';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
import { Organization } from '../src/model/Organization';
import { Module as Module1 } from '../src/model/Module';
import { Permission } from '../src/model/Permission';
import { UserPMModule } from '../src/UserPMModule'
import { Connection, Repository } from 'typeorm';
import { User } from '../src/model/User';
import { Role } from '../src/model/Role';
import { Func } from '../src/model/Func';

@Module({
  modules: [GraphQLModule, UserPMModule]
})


export class ApplicationModule implements NestModule {

  constructor(
    @Inject(GraphQLFactory) private readonly graphQLFactory: GraphQLFactory,
    @Inject('UserPMModule.FuncRepository') private readonly funcRepository: Repository<Func>,
    @Inject('UserPMModule.RoleRepository') private readonly roleRepository: Repository<Role>,
    @Inject('UserPMModule.UserRepository') private readonly userRepository: Repository<User>,
    @Inject('UserPMModule.ModuleRepository') private readonly module1Repository: Repository<Module1>,
    @Inject('UserPMModule.PermissionRepository') private readonly permissionRepository: Repository<Permission>,
    @Inject('UserPMModule.OrganizationRepository') private readonly organizationRepository: Repository<Organization>
  ) { }

  configure(consumer: MiddlewaresConsumer) {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths('./src/**/*.types.graphql');
    const schema = this.graphQLFactory.createSchema({ typeDefs });
    consumer
      .apply(graphiqlExpress({ endpointURL: '/graphql' }))
      .forRoutes({ path: '/graphiql', method: RequestMethod.GET })
      .apply(graphqlExpress(req => ({ schema, rootValue: req })))
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
  }

  async onModuleInit() {
    /* 验证TreeEntity可以一次保存
    let jituan  = this.organizationRepository.create({name:'集团'})
    let renli  = this.organizationRepository.create({name:'人力'})
    let bangongshi  = this.organizationRepository.create({name:'办公室'})
    jituan.children = [renli,bangongshi]
    await this.organizationRepository.save(jituan) 
    */
    /* 移除children只移除关联关系，而不删除children实体
    let jituan  = this.organizationRepository.create({name:'集团'})
    let renli  = this.organizationRepository.create({name:'人力'})
    let bangongshi  = this.organizationRepository.create({name:'办公室'})
    jituan.children = [renli,bangongshi]
    await this.organizationRepository.save(jituan) 
    jituan.children = []
    await this.organizationRepository.save(jituan)  
    */
  }
}
