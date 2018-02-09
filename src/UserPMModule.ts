import { ConnectionProvider } from './database/ConnectionProvider';
import { Module ,Global} from '@nestjs/common';

@Global()
@Module({
  modules: [],
  controllers: [],
  components: [ConnectionProvider],
  exports: []
})
export class UserPMModule{}