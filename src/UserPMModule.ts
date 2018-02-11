import { OrganizationResolver } from './resolver/OrganizationResolver';
import { RepositorysProvider } from './database/RepositorysProvider';
import { OrganizationService } from './service/OrganizationService';
import { ConnectionProvider } from './database/ConnectionProvider';
import { UserResolver } from './resolver/UserResolver';
import { UserService } from './service/UserService';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  modules: [],
  controllers: [],
  components: [
    ConnectionProvider, ...RepositorysProvider,
    OrganizationService, OrganizationResolver,
    UserResolver, UserService
  ],
  exports: [...RepositorysProvider]
})
export class UserPMModule { }