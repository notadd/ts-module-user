import { ConnectionProvider } from './database/ConnectionProvider';
import { RepositorysProvider } from './database/RepositorysProvider';
import { Module, Global} from '@nestjs/common';

@Global()
@Module({
  modules: [],
  controllers: [],
  components: [ConnectionProvider, ...RepositorysProvider],
  exports: [...RepositorysProvider]
})
export class UserPMModule { }