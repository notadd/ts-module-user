import { Module, MiddlewareConsumer, NestModule, RequestMethod, Inject } from "@nestjs/common";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { GraphQLModule, GraphQLFactory } from "@nestjs/graphql";
import { UpyunModule } from "@notadd/addon-upyun";
import { Connection, Repository } from "typeorm";
import { UserModule } from "../src/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
  imports: [GraphQLModule, UpyunModule, TypeOrmModule.forRoot({
    name: "user_pm",
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "postgres",
    password: "123456",
    database: "postgres",
    entities: ["../**/*.entity.ts"],
    logger: "simple-console",
    synchronize: true,
    dropSchema: false
  }), UserModule]
})
export class ApplicationModule implements NestModule {

  constructor(
    @Inject(GraphQLFactory) private readonly graphQLFactory: GraphQLFactory,
  ) { }

  configure(consumer: MiddlewareConsumer) {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths("./src/**/*.types.graphql");
    const schema = this.graphQLFactory.createSchema({ typeDefs });
    consumer
      .apply(graphiqlExpress({ endpointURL: "/graphql" }))
      .forRoutes("/graphiql")
      .apply(graphqlExpress(req => ({ schema, rootValue: req })))
      .forRoutes("/graphql");
  }


}
