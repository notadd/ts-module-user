import { OrganizationResolver } from './resolver/OrganizationResolver';
import { RepositorysProvider } from './database/RepositorysProvider';
import { OrganizationService } from './service/OrganizationService';
import { ConnectionProvider } from './database/ConnectionProvider';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  modules: [],
  controllers: [],
  components: [
    ConnectionProvider, ...RepositorysProvider,
    OrganizationService, OrganizationResolver
  ],
  exports: [...RepositorysProvider]
})
export class UserPMModule { }