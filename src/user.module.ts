import { Global, Inject, Module, OnModuleInit } from "@nestjs/common";
import { ModulesContainer } from "@nestjs/core/injector/modules-container";
import { MetadataScanner } from "@nestjs/core/metadata-scanner";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PERMISSION_DEFINITION } from "./decorator/permission.definition";
import { UserComponentProvider } from "./export/user.component.provider";
import { MODULE_TOKEN } from "./guard/permission.guard";
import { Func } from "./model/func.entity";
import { InfoGroup } from "./model/info.group.entity";
import { InfoItem } from "./model/info.item.entity";
import { Module as Module1 } from "./model/module.entity";
import { Organization } from "./model/organization.entity";
import { Permission } from "./model/permission.entity";
import { Role } from "./model/role.entity";
import { Score } from "./model/score.entity";
import { ScoreType } from "./model/score.type.entity";
import { User } from "./model/user.entity";
import { UserInfo } from "./model/user.info.entity";
import { FuncResolver } from "./resolver/func.resolver";
import { InfoGroupResolver } from "./resolver/info.group.resolver";
import { InfoItemResolver } from "./resolver/info.item.resolver";
import { ModuleResolver } from "./resolver/module.resolver";
import { OrganizationResolver } from "./resolver/organization.resolver";
import { RoleResolver } from "./resolver/role.resolver";
import { ScoreResolver } from "./resolver/score.resolver";
import { ScoreTypeResolver } from "./resolver/score.type.resolver";
import { UserResolver } from "./resolver/user.resolver";
import { FuncService } from "./service/func.service";
import { InfoGroupService } from "./service/info.group.service";
import { InfoItemService } from "./service/info.item.service";
import { ModuleService } from "./service/module.service";
import { OrganizationService } from "./service/organization.service";
import { RoleService } from "./service/role.service";
import { ScoreService } from "./service/score.service";
import { ScoreTypeService } from "./service/score.type.service";
import { UserService } from "./service/user.service";
import { FloatUtil } from "./util/float.util";

@Global()
@Module({
    modules: [ TypeOrmModule.forFeature([ Module1, Organization, User, ScoreType, Score, InfoGroup, InfoItem, UserInfo, Role, Func, Permission ]) ],
    controllers: [],
    components: [
        FloatUtil,
        OrganizationService, OrganizationResolver,
        ScoreTypeService, ScoreTypeResolver,
        InfoGroupService, InfoGroupResolver,
        InfoItemService, InfoItemResolver,
        ModuleService, ModuleResolver,
        ScoreService, ScoreResolver,
        FuncService, FuncResolver,
        UserService, UserResolver,
        RoleService, RoleResolver,
        UserComponentProvider
    ],
    exports: [ UserComponentProvider ]
})
export class UserModule implements OnModuleInit {

    private readonly metadataScanner: MetadataScanner;

    constructor(
        @Inject(ModulesContainer.name) private readonly moduleMap: ModulesContainer,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(Func) private readonly funcRepository: Repository<Func>,
        @InjectRepository(Module) private readonly moduleRepository: Repository<Module1>,
        @InjectRepository(InfoItem) private readonly infoItemRepository: Repository<InfoItem>,
        @InjectRepository(ScoreType) private readonly scoreTypeRepository: Repository<ScoreType>,
        @InjectRepository(InfoGroup) private readonly infoGroupRepository: Repository<InfoGroup>,
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>
    ) {
        this.metadataScanner = new MetadataScanner();
    }

    async onModuleInit(): Promise<void> {
        // 遍历模块，检查权限定义
        await this.checkPermissionDefinition();
        // 确保默认信息组的存在
        await this.addDefaultInfoGroup();
        // 确保默认积分类型的存在
        await this.addDefaultScoreType();
    }

    /* 在初始化钩子中遍历所有模块
       获取定义在Controller与Resolver上的权限定义
       权限定义可以定义在类上或者原型方法上，与UseGuard的使用方法相同
       一个位置可以定义多个权限，作为数组存储在元数据userpm:permission_definition中
       一个模块中定义的重复权限，会被覆盖，不会报错
       新增模块直接保存，既有模块对原有权限与本次扫描出权限进行差分，相同名称权限id不变，保证既有权限与功能关联不变
       如果原有模块没有在这次遍历中被发现权限，则模块连带权限、功能、角色一起删除
     */
    async checkPermissionDefinition(): Promise<void> {
        // 获取当前既有模块，关联获取模块具有的权限、功能、角色
        const modules: Array<Module1> = await this.moduleRepository.find({ relations: [ "permissions", "funcs", "roles" ] });
        // 遍历模块token、Module实例
        for (const [ key, value ] of this.moduleMap.entries()) {
            // 模块名称，直接使用nest容器里面存储Module的key，不会重复
            const token = key;
            // 组件,包含了路由
            const components = [ ...value.components, ...value.routes ];
            // 获取到的权限定义，使用map为了name不重复
            const permissions: Map<string, Permission> = new Map();
            // 遍历组件、路由
            for (const component of components) {
                // 名称、实例包装器
                const [ key, value ] = component;
                // 只有resolver、controller才会被遍历，其他组件上定义权限无效
                const isResolver = Reflect.getMetadata("graphql:resolver_type", value.metatype);
                const isController = Reflect.getMetadata("path", value.metatype,);
                if (isResolver || isController) {
                    // 在需要进行权限判断的组件类上定义模块token，用来在guard中判断权限属于哪个模块
                    Reflect.defineMetadata(MODULE_TOKEN, token, value.metatype);
                    // 获取组件、控制器类上定义的权限数组
                    const pers: Array<Permission> = Reflect.getMetadata(PERMISSION_DEFINITION, value.metatype);
                    // 这里在同一个模块中重复定义的权限会被覆盖
                    // 保证了name不重复
                    pers && pers.forEach(per => {
                        permissions.set(per.name, per);
                    });
                    // 遍历实例原型方法，获取方法上定义的权限
                    const prototype = Object.getPrototypeOf(value.instance);
                    this.metadataScanner.scanFromPrototype<any, Array<Permission>>(value.instance, prototype, name => {
                        // 获取到方法名，获取方法上定义的权限
                        const pers: Array<Permission> = Reflect.getMetadata(PERMISSION_DEFINITION, value.metatype, name);
                        pers && pers.forEach(per => {
                            permissions.set(per.name, per);
                        });
                        return pers;
                    });
                }
            }
            // 获取到一个模块下所有的权限定义之后，进行保存
            if (permissions.values) {
                // 获取权限数组
                const pers: Array<Permission> = [];
                for (const value of permissions.values()) {
                    pers.push(value);
                }
                // 查找模块是否已经存在
                const index = modules.findIndex(module => {
                    return module.token === token;
                });
                // 如果模块已经存在
                if (index >= 0) {
                    const module = modules[ index ];
                    // 对既有权限与本次扫描出权限根据name进行差分
                    // 遍历本次扫描结果
                    for (const per of pers) {
                        // 在既有权限中进行查找
                        const find: Permission|undefined = module.permissions.find(p => {
                            return p.name === per.name;
                        });
                        // 如果本次扫描到权限在既有权限中未找到
                        if (!find) {
                            // 说明为新增权限，保存它
                            per.module = module;
                            await this.permissionRepository.save(per);
                        }
                        // 如果找到则需要更新
                        else {
                            find.description = per.description;
                            await this.permissionRepository.save(find);
                        }
                    }

                    // 遍历既有权限
                    for (const p of module.permissions) {
                        // 在本次扫描到的权限中查找既有权限
                        const find: Permission|undefined = pers.find(per => {
                            return per.name === p.name;
                        });
                        // 如果未找到，说明这个既有权限被删除了
                        // 因为删除权限而带来的其他变化，暂时不管
                        if (!find) {
                            await this.permissionRepository.remove(p);
                        }
                    }
                    // 将已经扫描到的模块从既有模块数组中移除
                    modules.splice(index, 1);
                } else if (pers.length > 0) {
                    // 模块不存在，直接保存它与相应权限
                    const module: Module1 = this.moduleRepository.create({ token, permissions: pers });
                    await this.moduleRepository.save(module);
                } else {
                    // 模块不存在且没有权限，则不管它
                }
            }
        }
        // 如果既有模块没有全部被扫描到，那么剩余模块被删除，连带权限、功能、角色
        if (modules.length > 0) {
            /* 这里如果直接删除模块，因为外键检查会报错
               如果删除模块级联删除角色、功能、权限也会发生错误，因为者三者本身就有多对多关系
               这种情况下，角色-功能、功能-权限、角色-用户、权限-用户等关系都不会被自动解除
               只能单独删除角色、功能、权限，其相应关系也会删除，最后删除模块
            */
            for (let i = 0; i < modules.length; i++) {
                await this.roleRepository.remove(modules[ i ].roles);
                await this.funcRepository.remove(modules[ i ].funcs);
                await this.permissionRepository.remove(modules[ i ].permissions);
                await this.moduleRepository.remove(modules[ i ]);
            }
        }
    }

    /* 添加默认信息组，包含基本信息组、认证信息组
      虽然信息组、信息项的id为自动生成，但是如果save方法保存的对象指定了id，在保存时会使用指定的id，如果指定id已存在，则会更新
    */
    async addDefaultInfoGroup() {
        const base: InfoGroup = this.infoGroupRepository.create({ id: 1, name: "Base", default: true, status: true });
        const nickname: InfoItem = this.infoItemRepository.create({
            id: 1,
            name: "nickname",
            label: "昵称",
            default: true,
            description: "用户昵称",
            type: "text",
            necessary: true,
            registerVisible: true,
            informationVisible: true,
            order: 1
        });
        const sex: InfoItem = this.infoItemRepository.create({
            id: 2,
            name: "sex",
            label: "性别",
            default: true,
            description: "用户性别，只能为男或女",
            type: "radio",
            necessary: true,
            registerVisible: true,
            informationVisible: true,
            order: 2
        });
        const age: InfoItem = this.infoItemRepository.create({
            id: 3,
            name: "age",
            label: "年龄",
            default: true,
            description: "用户年龄，只能为数字",
            type: "number",
            necessary: true,
            registerVisible: true,
            informationVisible: true,
            order: 3
        });
        const birthday: InfoItem = this.infoItemRepository.create({
            id: 4,
            name: "birthday",
            label: "生日",
            default: true,
            description: "用户生日",
            type: "date",
            necessary: true,
            registerVisible: true,
            informationVisible: true,
            order: 4
        });
        const headPortrait: InfoItem = this.infoItemRepository.create({
            id: 5,
            name: "headPortrait",
            label: "头像",
            default: true,
            description: "用户头像，必须为上传图片，需要预览",
            type: "uploadimagewithpreview",
            necessary: true,
            registerVisible: true,
            informationVisible: true,
            order: 5
        });
        const sign: InfoItem = this.infoItemRepository.create({
            id: 6,
            name: "sign",
            label: "签名",
            default: true,
            description: "用户签名，为多行文本",
            type: "textarea",
            necessary: true,
            registerVisible: true,
            informationVisible: true,
            order: 6
        });
        base.items = [ nickname, sex, age, birthday, headPortrait, sign ];
        await this.infoGroupRepository.save(base);
        const authentication: InfoGroup = this.infoGroupRepository.create({
            id: 2,
            name: "authentication",
            default: true,
            status: true
        });
        const email: InfoItem = this.infoItemRepository.create({
            id: 7,
            name: "email",
            label: "邮箱",
            default: true,
            description: "用户邮箱",
            type: "text",
            necessary: true,
            registerVisible: true,
            informationVisible: true,
            order: 1
        });
        const realName: InfoItem = this.infoItemRepository.create({
            id: 8,
            name: "realName",
            label: "姓名",
            default: true,
            description: "用户真实姓名",
            type: "text",
            necessary: true,
            registerVisible: true,
            informationVisible: true,
            order: 2
        });
        const idNumber: InfoItem = this.infoItemRepository.create({
            id: 9,
            name: "idNumber",
            label: "身份证号",
            default: true,
            description: "用户身份证号",
            type: "text",
            necessary: true,
            registerVisible: true,
            informationVisible: true,
            order: 3
        });
        const idImage: InfoItem = this.infoItemRepository.create({
            id: 10,
            name: "idImage",
            label: "身份证图片",
            default: true,
            description: "用户身份证图片，正反面在同一页",
            type: "uploadfile",
            necessary: true,
            registerVisible: true,
            informationVisible: true,
            order: 4
        });
        const cellPhoneNumber: InfoItem = this.infoItemRepository.create({
            id: 11,
            name: "cellPhoneNumber",
            label: "手机号",
            default: true,
            description: "用户手机号",
            type: "text",
            necessary: true,
            registerVisible: true,
            informationVisible: true,
            order: 5
        });
        authentication.items = [ email, realName, idNumber, idImage, cellPhoneNumber ];
        await this.infoGroupRepository.save(authentication);
    }

    /* 添加默认积分类型 */
    async addDefaultScoreType() {
        const scoreType1: ScoreType = this.scoreTypeRepository.create({
            id: 1,
            name: "积分",
            type: "int",
            default: true,
            description: "积分，用于......"
        });
        const scoreType2: ScoreType = this.scoreTypeRepository.create({
            id: 2,
            name: "贡献",
            type: "int",
            default: true,
            description: "贡献，用于......"
        });
        const scoreType3: ScoreType = this.scoreTypeRepository.create({
            id: 3,
            name: "威望",
            type: "int",
            default: true,
            description: "威望，用于......"
        });
        const scoreType4: ScoreType = this.scoreTypeRepository.create({
            id: 4,
            name: "余额",
            type: "float",
            default: true,
            description: "余额，用于......"
        });
        await this.scoreTypeRepository.save([ scoreType1, scoreType2, scoreType3, scoreType4 ]);
    }
}
