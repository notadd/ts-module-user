import { OnModuleInit } from "@nestjs/common";
import { ModulesContainer } from "@nestjs/core/injector/modules-container";
import { Module as ModuleEntity } from "./model/module.entity";
import { Permission } from "./model/permission.entity";
import { InfoGroup } from "./model/info.group.entity";
import { ScoreType } from "./model/score.type.entity";
import { InfoItem } from "./model/info.item.entity";
import { Func } from "./model/func.entity";
import { Role } from "./model/role.entity";
import { Repository } from "typeorm";
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
    private modules;
    constructor(moduleMap: ModulesContainer, roleRepository: Repository<Role>, funcRepository: Repository<Func>, moduleRepository: Repository<ModuleEntity>, infoItemRepository: Repository<InfoItem>, scoreTypeRepository: Repository<ScoreType>, infoGroupRepository: Repository<InfoGroup>, permissionRepository: Repository<Permission>);
    onModuleInit(): Promise<void>;
    iterateModule(): Promise<void>;
    addDefaultInfoGroup(): Promise<void>;
    addDefaultScoreType(): Promise<void>;
}
