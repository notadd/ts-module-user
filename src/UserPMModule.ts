import { OrganizationResolver } from './resolver/OrganizationResolver';
import { RepositorysProvider } from './database/RepositorysProvider';
import { OrganizationService } from './service/OrganizationService';
import { ConnectionProvider } from './database/ConnectionProvider';
import { InfoGroupResolver } from './resolver/InfoGroupResolver';
import { InfoItemResolver } from './resolver/InfoItemResolver';
import { InfoGroupService } from './service/InfoGroupService';
import { InfoItemService } from './service/InfoItemService';
import { ModuleResolver } from './resolver/ModuleResolver';
import { ModuleService } from './service/ModuleService';
import { UserResolver } from './resolver/UserResolver';
import { FuncResolver } from './resolver/FuncResolver';
import { RoleResolver } from './resolver/RoleResolver';
import { UserService } from './service/UserService';
import { FuncService } from './service/FuncService';
import { RoleService } from './service/RoleService';
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
    ModuleResolver, ModuleService,
    FuncResolver, FuncService,
    UserResolver, UserService,
    RoleResolver, RoleService
  ],
  exports: []
})
export class UserPMModule { }