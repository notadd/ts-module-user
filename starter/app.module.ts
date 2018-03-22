import { Module, MiddlewaresConsumer, NestModule, RequestMethod, Inject } from '@nestjs/common';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
import { UserPMModule } from '../src/UserPMModule';
import { Connection, Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  modules: [GraphQLModule, TypeOrmModule.forRoot({
    name: 'user_pm',
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: '123456',
    database: "user_pm",
    entities: ['../**/*.entity.ts'],
    logger: 'simple-console',
    logging: null,
    synchronize: true,
    dropSchema: true
  }),UserPMModule]
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


}
