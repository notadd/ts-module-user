import { Module, MiddlewaresConsumer, NestModule, RequestMethod, Inject } from '@nestjs/common';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
import { Organization } from '../src/model/Organization';
import { Module as Module1 } from '../src/model/Module';
import { Permission } from '../src/model/Permission';
import { UserPMModule } from '../src/UserPMModule';
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
  }
}
