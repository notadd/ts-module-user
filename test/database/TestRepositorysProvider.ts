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
entityMap.set('UserPMModule.OrganizationRepository', Organization)
entityMap.set('UserPMModule.PermissionRepository', Permission)
entityMap.set('UserPMModule.InfoGroupRepository', InfoGroup)
entityMap.set('UserPMModule.ScoreTypeRepository', ScoreType)
entityMap.set('UserPMModule.InfoItemRepository', InfoItem)
entityMap.set('UserPMModule.UserInfoRepository', UserInfo)
entityMap.set('UserPMModule.ModuleRepository', Module)
entityMap.set('UserPMModule.ScoreRepository', Score)
entityMap.set('UserPMModule.UserRepository', User)
entityMap.set('UserPMModule.RoleRepository', Role)
entityMap.set('UserPMModule.FuncRepository', Func)


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
        inject: ['UserPMModule.Connection']
    })
})






