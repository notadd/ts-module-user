import { Organization } from '../model/Organization';
import { Connection, Repository } from 'typeorm';
import { Permission } from '../model/Permission';
import { Module } from '../model/Module';
import { User } from '../model/User';
import { Role } from '../model/Role';
import { Func } from '../model/Func';

const entityMap: Map<string, Function> = new Map()
entityMap.set('UserPMModule.OrganizationRepository', Organization)
entityMap.set('UserPMModule.PermissionRepository', Permission)
entityMap.set('UserPMModule.ModuleRepository', Module)
entityMap.set('UserPMModule.UserRepository', User)
entityMap.set('UserPMModule.RoleRepository', Role)
entityMap.set('UserPMModule.FuncRepository', Func)


class RepositoryProvider {
    provide: string
    useFactory: (connection: Connection) => Repository<any>
    inject: string[]
}

export let RepositorysProvider: Array<RepositoryProvider> = []

entityMap.forEach((entity, token, map) => {
    RepositorysProvider.push({
        provide: token,
        useFactory: (connection: Connection) => {
            return connection.getRepository(entity)
        },
        inject: ['UserPMModule.Connection']
    })
})

