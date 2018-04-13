import { OnModuleInit } from "@nestjs/common";
import { ModulesContainer } from "@nestjs/core/injector/modules-container";
import { Repository } from "typeorm";
import { Func } from "./model/func.entity";
import { InfoGroup } from "./model/info.group.entity";
import { InfoItem } from "./model/info.item.entity";
import { Module as ModuleEntity } from "./model/module.entity";
import { Permission } from "./model/permission.entity";
import { Role } from "./model/role.entity";
import { ScoreType } from "./model/score.type.entity";
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
    constructor(moduleMap: ModulesContainer, roleRepository: Repository<Role>, funcRepository: Repository<Func>, moduleRepository: Repository<ModuleEntity>, infoItemRepository: Repository<InfoItem>, scoreTypeRepository: Repository<ScoreType>, infoGroupRepository: Repository<InfoGroup>, permissionRepository: Repository<Permission>);
    onModuleInit(): Promise<void>;
    checkPermissionDefinition(): Promise<void>;
    addDefaultInfoGroup(): Promise<void>;
    addDefaultScoreType(): Promise<void>;
}
