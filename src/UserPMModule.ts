import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { PERMISSION_DEFINITION } from './decorator/PermissionDefinition';
import { OrganizationResolver } from './resolver/OrganizationResolver';
import { Module, Global, OnModuleInit, Inject } from '@nestjs/common';
import { RepositorysProvider } from './database/RepositorysProvider';
import { OrganizationService } from './service/OrganizationService';
import { ConnectionProvider } from './database/ConnectionProvider';
import { InfoGroupResolver } from './resolver/InfoGroupResolver';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { InfoItemResolver } from './resolver/InfoItemResolver';
import { InfoGroupService } from './service/InfoGroupService';
import { InfoItemService } from './service/InfoItemService';
import { ModuleResolver } from './resolver/ModuleResolver';
import { ModuleService } from './service/ModuleService';
import { UserResolver } from './resolver/UserResolver';
import { FuncResolver } from './resolver/FuncResolver';
import { RoleResolver } from './resolver/RoleResolver';
import { MODULE_TOKEN } from './guard/PermissionGuard';
import { UserService } from './service/UserService';
import { FuncService } from './service/FuncService';
import { RoleService } from './service/RoleService';
import { Module as Module1 } from './model/Module';
import { Permission } from './model/Permission';
import { Repository } from 'typeorm';



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
  exports: [UserService]
})
export class UserPMModule implements OnModuleInit {

  private readonly metadataScanner: MetadataScanner
  constructor(
    @Inject(ModulesContainer.name) private readonly moduleMap: ModulesContainer,
    @Inject('UserPMModule.ModuleRepository') private readonly moduleRepository: Repository<Module1>,
    @Inject('UserPMModule.PermissionRepository') private readonly permissionRepository: Repository<Permission>
  ) {
    this.metadataScanner = new MetadataScanner()
  }



  async onModuleInit(): Promise<void> {
    await this.checkPermissionDefinition()
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
    //获取当前既有模块，关联获取模块具有的权限、功能、角色
    console.log('获取当前所有模块')
    let modules: Module1[] = await this.moduleRepository.find({ relations: ['permissions', 'funcs', 'roles'] })
    console.dir(modules)
    console.log('开始遍历模块')
    //遍历模块token、Module实例
    for (let [key, value] of this.moduleMap.entries()) {
      //模块名称，从token中解析出来
      let token = JSON.parse(key).module
      //组件,包含了路由
      let components = [...value.components, ...value.routes]
      //获取到的权限定义，使用map为了name不重复
      let permissions: Map<string, Permission> = new Map()
      //遍历组件、路由
      console.log('开始遍历模块token=' + token + '的组件')
      for (let component of components) {
        //名称、实例包装器
        let [key, value] = component
        //只有resolver、controller才会被遍历，其他组件上定义权限无效
        let isResolver = Reflect.getMetadata('graphql:resolver_type', value.metatype)
        let isController = Reflect.getMetadata('path', value.metatype, )
        if (isResolver || isController) {
          console.log('处理组件：' + key)
          //在需要进行权限判断的组件类上定义模块token，用来在guard中判断权限属于哪个模块
          Reflect.defineMetadata(MODULE_TOKEN, token, value.metatype)
          //获取组件、控制器类上定义的权限数组
          let pers: Permission[] = Reflect.getMetadata(PERMISSION_DEFINITION, value.metatype)
          //这里在同一个模块中重复定义的权限会被覆盖
          //保证了name不重复
          pers && pers.forEach(per => {
            permissions.set(per.name, per)
          })
          //遍历实例原型方法，获取方法上定义的权限
          let prototype = Object.getPrototypeOf(value.instance)
          this.metadataScanner.scanFromPrototype<any, Permission[]>(value.instance, prototype, name => {
            //获取到方法名，获取方法上定义的权限
            let pers: Permission[] = Reflect.getMetadata(PERMISSION_DEFINITION, value.metatype, name)
            pers && pers.forEach(per => {
              permissions.set(per.name, per)
            })
            return pers
          })
        }
      }
      //获取到一个模块下所有的权限定义之后，进行保存
      if (permissions.values) {
        //获取权限数组
        let pers: Permission[] = []
        for (let value of permissions.values()) {
          pers.push(value)
        }
        console.log('获取到模块下所有权限：')
        console.dir(pers)
        //查找模块是否已经存在
        let index = modules.findIndex(module => {
          return module.token === token
        })
        //如果模块已经存在
        if (index >= 0) {
          console.log('模块' + token + '已经存在')
          let module = modules[index]
          //对既有权限与本次扫描出权限根据name进行差分
          //遍历本次扫描结果
          for (let per of pers) {
            //在既有权限中进行查找
            let find: Permission = module.permissions.find(p => {
              return p.name === per.name
            })
            //如果本次扫描到权限在既有权限中未找到
            if (!find) {
              console.log('新增权限：')
              console.log(per)
              //说明为新增权限，保存它
              per.module = module
              await this.permissionRepository.save(per)
            }
            //如果找到则需要更新
            else {
              console.log('更新权限')
              console.log(find)
              find.description = per.description
              await this.permissionRepository.save(find)
            }
          }

          //遍历既有权限
          for (let p of module.permissions) {
            //在本次扫描到的权限中查找既有权限
            let find: Permission = pers.find(per => {
              return per.name === p.name
            })
            //如果未找到，说明这个既有权限被删除了
            //因为删除权限而带来的其他变化，暂时不管
            if (!find) {
              console.log('权限' + p.name + '未找到,将要被删除')
              await this.permissionRepository.remove(p)
            }
          }
          //将已经扫描到的模块从既有模块数组中移除
          modules.splice(index, 1)
        } else if (pers.length > 0) {
          console.log('模块' + token + '不存在，即将保存')
          //模块不存在，直接保存它与相应权限
          let module: Module1 = this.moduleRepository.create({ token, permissions: pers })
          await this.moduleRepository.save(module)
        } else {
          //模块不存在且没有权限，则不管它
        }
      }
    }
    //如果既有模块没有全部被扫描到，那么剩余模块被删除，连带权限、功能、角色
    if (modules.length > 0) {
      console.log('以下模块未找到，将要删除')
      console.dir(modules)
      await this.moduleRepository.remove(modules)
    }
  }
}