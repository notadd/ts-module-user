import { Organization } from '../../src/model/Organization';
import { Permission } from '../../src/model/Permission';
import { InfoGroup } from '../../src/model/InfoGroup';
import { ScoreType } from '../../src/model/ScoreType';
import { InfoItem } from '../../src/model/InfoItem';
import { UserInfo } from '../../src/model/UserInfo';
import { Connection, Repository } from 'typeorm';
import { Module } from '../../src/model/Module';
import { Score } from '../../src/model/Score';
import { User } from '../../src/model/User';
import { Role } from '../../src/model/Role';
import { Func } from '../../src/model/Func';

const entityMap: Map<string, Function> = new Map()
entityMap.set('UserModule.OrganizationRepository', Organization)
entityMap.set('UserModule.PermissionRepository', Permission)
entityMap.set('UserModule.InfoGroupRepository', InfoGroup)
entityMap.set('UserModule.ScoreTypeRepository', ScoreType)
entityMap.set('UserModule.InfoItemRepository', InfoItem)
entityMap.set('UserModule.UserInfoRepository', UserInfo)
entityMap.set('UserModule.ModuleRepository', Module)
entityMap.set('UserModule.ScoreRepository', Score)
entityMap.set('UserModule.UserRepository', User)
entityMap.set('UserModule.RoleRepository', Role)
entityMap.set('UserModule.FuncRepository', Func)


class RepositoryProvider {
    provide: string
    useFactory: (connection: Connection) => Repository<any>
    inject: string[]
}

export let TestRepositorysProvider: Array<RepositoryProvider> = []

entityMap.forEach((entity, token, map) => {
    TestRepositorysProvider.push({
        provide: token,
        useFactory: (connection: Connection) => {
            return connection.getRepository(entity)
        },
        inject: ['UserModule.Connection']
    })
})






