import { OrganizationResolver } from './resolver/OrganizationResolver';
import { RepositorysProvider } from './database/RepositorysProvider';
import { OrganizationService } from './service/OrganizationService';
import { ConnectionProvider } from './database/ConnectionProvider';
import { InfoGroupResolver } from './resolver/InfoGroupResolver';
import { InfoItemResolver } from './resolver/InfoItemResolver';
import { InfoGroupService } from './service/InfoGroupService';
import { InfoItemService } from './service/InfoItemService';
import { UserResolver } from './resolver/UserResolver';
import { FuncResolver } from './resolver/FuncResolver';
import { UserService } from './service/UserService';
import { FuncService } from './service/FuncService';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  modules: [],
  controllers: [],
  components: [
    ConnectionProvider, ...RepositorysProvider,
    OrganizationService, OrganizationResolver,
    InfoGroupResolver, InfoGroupService,
    InfoItemResolver, InfoItemService,
    FuncResolver, FuncService,
    UserResolver, UserService
  ],
  exports: []
})
export class UserPMModule { }