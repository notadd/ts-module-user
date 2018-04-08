import { OnModuleInit } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { Repository } from 'typeorm';
import { Func } from './model/Func.entity';
import { InfoGroup } from './model/InfoGroup.entity';
import { InfoItem } from './model/InfoItem.entity';
import { Module as Module1 } from './model/Module.entity';
import { Permission } from './model/Permission.entity';
import { Role } from './model/Role.entity';
import { ScoreType } from './model/ScoreType.entity';
export declare class UserModule implements OnModuleInit {
    private readonly moduleMap;
    private readonly roleRepository;
    private readonly funcRepository;
    private readonly moduleRepository;
    private readonly infoItemRepository;
    private readonly scoreTypeRepository;
    private readonly infoGroupRepository;
    private readonly permissionRepository;
    private readonly metadataScanner;
    constructor(moduleMap: ModulesContainer, roleRepository: Repository<Role>, funcRepository: Repository<Func>, moduleRepository: Repository<Module1>, infoItemRepository: Repository<InfoItem>, scoreTypeRepository: Repository<ScoreType>, infoGroupRepository: Repository<InfoGroup>, permissionRepository: Repository<Permission>);
    onModuleInit(): Promise<void>;
    checkPermissionDefinition(): Promise<void>;
    addDefaultInfoGroup(): Promise<void>;
    addDefaultScoreType(): Promise<void>;
}
