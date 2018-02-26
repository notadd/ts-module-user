import { UnionUserInfo, TextInfo, ArrayInfo, FileInfo } from '../interface/user/UnionUserInfo';
import { HttpException, Inject, Component } from '@nestjs/common';
import { Repository, Connection, EntityManager } from 'typeorm';
import { StoreComponent } from '../interface/StoreComponent';
import { Organization } from '../model/Organization';
import { Permission } from '../model/Permission';
import { InfoGroup } from '../model/InfoGroup';
import { InfoItem } from '../model/InfoItem';
import { UserInfo } from '../model/UserInfo';
import { Func } from '../model/Func';
import { Role } from '../model/Role';
import { User } from '../model/User';
import * as crypto from 'crypto';
import { IncomingMessage } from 'http';

@Component()
export class UserService {

    constructor(
        @Inject('StoreComponentToken') private readonly storeComponent: StoreComponent,
        @Inject('UserPMModule.Connection') private readonly connection: Connection,
        @Inject('UserPMModule.FuncRepository') private readonly funcRepository: Repository<Func>,
        @Inject('UserPMModule.RoleRepository') private readonly roleRepository: Repository<Role>,
        @Inject('UserPMModule.UserRepository') private readonly userRepository: Repository<User>,
        @Inject('UserPMModule.UserInfoRepository') private readonly userInfoRepository: Repository<UserInfo>,
        @Inject('UserPMModule.PermissionRepository') private readonly permissionRepository: Repository<Permission>,
        @Inject('UserPMModule.OrganizationRepository') private readonly organizationRepository: Repository<Organization>
    ) { }


    async getAll(): Promise<User[]> {
        return await this.userRepository.find({ recycle: false })
    }

    async getFreedomUsers(): Promise<User[]> {
        let users: User[] = await this.userRepository.find({ relations: ['organizations'] })
        return users.filter(user => {
            return (user.organizations === null || user.organizations === undefined || user.organizations.length === 0) && user.recycle === false
        })
    }

    async getRecycleUsers(): Promise<User[]> {
        return await this.userRepository.find({ recycle: true })
    }

    async userInfos(id: number): Promise<UserInfo[]> {
        let user: User = await this.userRepository.findOneById(id, { relations: ['userInfos'] })
        if (!user) {
            throw new HttpException('指定用户不存在', 406)
        }
        return user.userInfos
    }

    async roles(id: number): Promise<Role[]> {
        let user: User = await this.userRepository.findOneById(id, { relations: ['roles'] })
        if (!user) {
            throw new HttpException('指定用户不存在', 406)
        }
        return user.roles
    }

    async permissions(id: number): Promise<Permission[]> {
        let user: User = await this.userRepository.findOneById(id, { relations: ['roles', 'adds', 'reduces'] })
        if (!user) {
            throw new HttpException('指定用户不存在', 406)
        }
        //声明最后的结果
        let result: Permission[] = []
        //声明临时结果，未去重
        let temp: Permission[] = []
        //用来去重的集合
        let ids: Set<number> = new Set()
        //遍历获取所有角色拥有的权限
        for (let i = 0; i < user.roles.length; i++) {
            let role: Role = await this.roleRepository.findOneById(user.roles[i].id, { relations: ['funcs'] })
            for (let j = 0; j < role.funcs.length; j++) {
                let func: Func = await this.funcRepository.findOneById(role.funcs[i].id, { relations: ['permissions'] })
                temp.concat(func.permissions)
            }
        }
        //生成去重的集合
        temp.forEach(per => {
            if (!ids.has(per.id)) {
                ids.add(per.id)
                result.push(per)
            }
        })
        //遍历添加权限
        user.adds.forEach(per => {
            if (!ids.has(per.id)) {
                ids.add(per.id)
                result.push(per)
            }
        })
        //遍历减去权限
        user.reduces.forEach(per => {
            if (ids.has(per.id)) {
                ids.delete(per.id)
                let index = result.findIndex(p => {
                    return p.id === per.id
                })
                result.splice(index, 1)
            }
        })
        return result
    }


    async createUser(organizationId: number, userName: string, password: string, nickname: string, realName: string, sex: string, birthday: string, email: string, cellPhoneNumber: string): Promise<void> {
        let organizations: Organization[] = []
        if (organizationId) {
            let organization = await this.organizationRepository.findOneById(organizationId)
            if (!organization) {
                throw new HttpException('指定组织不存在', 402)
            }
            organizations.push(organization)
        }
        let exist: User = await this.userRepository.findOne({ userName })
        if (exist) {
            throw new HttpException('指定用户名已存在', 406)
        }
        try {
            let salt = crypto.createHash('md5').update(new Date().toString()).digest('hex').slice(0, 10)
            let passwordWithSalt = crypto.createHash('md5').update(password + salt).digest('hex')
            let user: User = this.userRepository.create({ userName, password: passwordWithSalt, salt, nickname, realName, sex, birthday: new Date(birthday), email, cellPhoneNumber, status: true, recycle: false, organizations })
            await this.userRepository.save(user)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async createUserWithUserInfo(req: IncomingMessage, organizationId: number, userName: string, password: string, nickname: string, realName: string, sex: string, birthday: string, email: string, cellPhoneNumber: string, groups: { groupId: number, infos: UnionUserInfo[] }[]): Promise<void> {
        let organizations: Organization[] = []
        if (organizationId) {
            let organization = await this.organizationRepository.findOneById(organizationId)
            if (!organization) {
                throw new HttpException('指定组织不存在', 402)
            }
            organizations.push(organization)
        }
        let exist: User = await this.userRepository.findOne({ userName })
        if (exist) {
            throw new HttpException('指定用户名已存在', 406)
        }
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let salt = crypto.createHash('md5').update(new Date().toString()).digest('hex').slice(0, 10)
            let passwordWithSalt = crypto.createHash('md5').update(password + salt).digest('hex')
            let user: User = this.userRepository.create({ userName, password: passwordWithSalt, salt, nickname, realName, sex, birthday: new Date(birthday), email, cellPhoneNumber, status: true, recycle: false, organizations })
            await queryRunner.manager.save(user)
            await this.addUserInfoGroups(req, queryRunner.manager, user, groups)
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            if (err instanceof HttpException) {
                throw err
            } else {
                throw new HttpException('出现了数据库错误' + err.toString(), 401)
            }
        }
    }

    async addUserInfo(req: IncomingMessage, id: number, groups: { groupId: number, infos: UnionUserInfo[] }[]): Promise<void> {
        let user: User = await this.userRepository.findOneById(id)
        if (!user) {
            throw new HttpException('指定用户不存在', 406)
        }
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.addUserInfoGroups(req, queryRunner.manager, user, groups)
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            if (err instanceof HttpException) {
                throw err
            } else {
                throw new HttpException('出现了数据库错误' + err.toString(), 401)
            }
        }

    }

    /* 为指定用户添加信息组方法，注意添加时这些信息组还未存在于用户信息中
       可以在初始注册时添加多个信息组，也可以为一个已存在用户添加多个信息组
       添加与更新信息组是两个方法
    */
    async addUserInfoGroups(req: IncomingMessage, manager: EntityManager, user: User, groups: { groupId: number, infos: UnionUserInfo[] }[]): Promise<void> {
        let existAddGroups: InfoGroup[]
        //用户上已经添加过的信息组
        if (user.infoGroups) {
            existAddGroups = user.infoGroups
        }
        //遍历信息组
        for (let i = 0; i < groups.length; i++) {
            let { groupId, infos } = groups[i]
            //如果这个信息组已经添加到用户，抛出异常
            if (existAddGroups.find(group => {
                return group.id === groupId
            })) {
                throw new HttpException('指定信息组id=' + groupId + '已经添加到用户id=' + user.id, 407)
            }
            //查找信息组，关联它下面的信息项
            let group: InfoGroup = await manager.findOneById(InfoGroup, groupId, { relations: ['items'] })
            //指定信息组不存在，也要异常
            if (!group) {
                throw new HttpException('指定信息组id=' + groupId + '不存在', 408)
            }
            //获取所有信息项
            let items: InfoItem[] = group.items
            //所有必填信息项
            let necessary: InfoItem[] = items.filter(item => {
                return item.necessary === true
            })
            //遍历得到的信息
            for (let j = 0; j < infos.length; j++) {
                let { name }: UnionUserInfo = infos[j]
                let result: string
                //查找名称匹配的信息项
                let match: InfoItem = items.find(item => {
                    return item.name === name
                })
                //如果接收到的信息项名称不存在，抛出异常
                if (!match) {
                    throw new HttpException('指定名称信息项:' + name + '不存在于信息组id=' + groupId + '中', 409)
                }
                //根据不同类型信息项校验信息类型，顺便转换信息值
                //'单行文本框', '多行文本框', '单选框', '多选框', '复选框', '日期时间选择', '日期时间范围选择', '下拉菜单', '上传图片', '上传文件'
                if (match.type === 'text' || match.type === 'textarea' || match.type === 'radio' || match.type === 'datetime' || match.type === 'datetimescope' || match.type === 'pulldownmenu') {
                    if (!(infos[j] as TextInfo).value) {
                        throw new HttpException('指定名称信息值:' + match.name + '不存在', 410)
                    }
                    if (!(typeof (infos[j] as TextInfo).value === 'string')) {
                        throw new HttpException('指定类型信息项:' + match.type + '必须为字符串', 410)
                    }
                    //普字符串类型值只需要删除前后空白
                    result = (infos[j] as TextInfo).value.trim()
                } else if (match.type === 'checkbox') {
                    if (!(infos[j] as ArrayInfo).array || (infos[j] as ArrayInfo).array.length === 0) {
                        throw new HttpException('指定名称信息值:' + match.name + '不存在', 410)
                    }
                    if (!((infos[j] as ArrayInfo).array instanceof Array)) {
                        throw new HttpException('指定类型信息项:' + match.type + '必须为数组', 410)
                    }
                    //数组类型以，连接各个元素为字符串
                    result = (infos[j] as ArrayInfo).array.join(',')
                } else if (match.type === 'uploadimage' || match.type === 'uploadfile') {
                    if (!(infos[j] as FileInfo).base64) {
                        throw new HttpException('指定类型信息项:' + match.type + '必须具有文件base64编码', 410)
                    }
                    if (!(infos[j] as FileInfo).rawName) {
                        throw new HttpException('指定类型信息项:' + match.type + '必须具有文件原名', 410)
                    }
                    if (!(infos[j] as FileInfo).bucketName) {
                        throw new HttpException('指定类型信息项:' + match.type + '必须具有文件存储空间名', 410)
                    }
                    //文件类型，上传到存储插件，并保存访问url
                    let { bucketName, name, type } = await this.storeComponent.upload((infos[j] as FileInfo).bucketName, (infos[j] as FileInfo).base64, (infos[j] as FileInfo).rawName, null)
                    result = await this.storeComponent.getUrl(req, bucketName, name, type, null)
                }
                let userInfo: UserInfo = this.userInfoRepository.create({ key: name, value: result, user })
                await this.userInfoRepository.save(userInfo)
                let index = necessary.findIndex(item => {
                    return item.id === match.id
                })
                if (index >= 0) {
                    necessary.slice(index, 1)
                }
            }
            //如果必填项没有填写，抛出异常
            if (necessary.length !== 0) {
                throw new HttpException('指定信息项:' + necessary + '为必填项', 410)
            }
        }
    }

    async updateUser(id: number, userName: string, password: string, nickname: string, realName: string, sex: string, birthday: string, email: string, cellPhoneNumber: string): Promise<void> {
        let exist: User = await this.userRepository.findOneById(id)
        if (!exist) {
            throw new HttpException('指定用户不存在', 406)
        }
        try {
            exist.userName = userName
            let salt = crypto.createHash('md5').update(new Date().toString()).digest('hex').slice(0, 10)
            exist.salt = salt
            exist.password = crypto.createHash('md5').update(password + salt).digest('hex')
            exist.nickname = nickname
            exist.realName = realName
            exist.sex = sex
            exist.birthday = new Date(birthday)
            exist.email = email
            exist.cellPhoneNumber = cellPhoneNumber
            await this.userRepository.save(exist)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async bannedUser(id: number): Promise<void> {
        let exist: User = await this.userRepository.findOneById(id)
        if (!exist) {
            throw new HttpException('指定用户不存在', 406)
        }
        if (exist.recycle === true) {
            throw new HttpException('指定用户已存在回收站中', 406)
        }
        if (exist.status === false) {
            throw new HttpException('指定用户已经封禁', 406)
        }
        try {
            exist.status = false
            await this.userRepository.save(exist)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async unBannedUser(id: number): Promise<void> {
        let exist: User = await this.userRepository.findOneById(id)
        if (!exist) {
            throw new HttpException('指定用户不存在', 406)
        }
        if (exist.recycle === true) {
            throw new HttpException('指定用户已存在回收站中', 406)
        }
        if (exist.status === true) {
            throw new HttpException('指定用户不需要解封', 406)
        }
        try {
            exist.status = true
            await this.userRepository.save(exist)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async softDeleteUser(id: number): Promise<void> {
        let exist: User = await this.userRepository.findOneById(id)
        if (!exist) {
            throw new HttpException('指定用户不存在', 406)
        }
        if (exist.recycle === true) {
            throw new HttpException('指定用户已存在回收站中', 406)
        }
        try {
            exist.recycle = true
            await this.userRepository.save(exist)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async restoreUser(id: number): Promise<void> {
        let exist: User = await this.userRepository.findOneById(id)
        if (!exist) {
            throw new HttpException('指定用户不存在', 406)
        }
        if (exist.recycle === false) {
            throw new HttpException('指定用户不存在回收站中', 406)
        }
        try {
            exist.recycle = false
            await this.userRepository.save(exist)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async restoreUsers(ids: number[]): Promise<void> {
        let users: User[] = await this.userRepository.findByIds(ids)
        if (!users || users.length === 0) {
            throw new HttpException('指定用户不存在', 406)
        }
        ids.forEach(id => {
            let find: User = users.find(user => {
                return user.id === id
            })
            if (!find) {
                throw new HttpException('指定id=' + id + '用户未找到', 406)
            }
            if (find.recycle === false) {
                throw new HttpException('指定用户id=' + id + '不在回收站中', 406)
            }
            find.recycle === true
        })
        try {
            await Promise.all(users.map(async user => {
                return this.userRepository.save(user)
            }, this))
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async deleteUser(id: number): Promise<void> {
        let exist: User = await this.userRepository.findOneById(id)
        if (!exist) {
            throw new HttpException('指定用户不存在', 406)
        }
        if (exist.recycle === false) {
            throw new HttpException('指定用户不存在回收站中', 406)
        }
        try {
            await this.userRepository.removeById(id)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async deleteUsers(ids: number[]): Promise<void> {
        let users: User[] = await this.userRepository.findByIds(ids)
        ids.forEach(id => {
            let find = users.find(user => {
                return user.id === id
            })
            if (!find) {
                throw new HttpException('指定id=' + id + '的用户不存在', 406)
            }
            if (find.recycle == false) {
                throw new HttpException('指定用户id=' + id + '不存在于回收站中', 406)
            }
        })
        try {
            await this.userRepository.removeByIds(ids)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

    async setPermissions(id: number, permissionIds: number[]): Promise<void> {
        let user: User = await this.userRepository.findOneById(id, { relations: ['roles', 'adds', 'reduces'] })
        if (!user) {
            throw new HttpException('指定用户不存在', 406)
        }
        //声明从role获取的权限集合
        let result: Permission[] = []
        //声明临时结果，未去重
        let temp: Permission[] = []
        //用来去重的集合
        let ids: Set<number> = new Set()
        //遍历获取所有角色拥有的权限
        for (let i = 0; i < user.roles.length; i++) {
            let role: Role = await this.roleRepository.findOneById(user.roles[i].id, { relations: ['funcs'] })
            for (let j = 0; j < role.funcs.length; j++) {
                let func: Func = await this.funcRepository.findOneById(role.funcs[i].id, { relations: ['permissions'] })
                temp.concat(func.permissions)
            }
        }
        //生成去重的集合
        temp.forEach(per => {
            if (!ids.has(per.id)) {
                ids.add(per.id)
                result.push(per)
            }
        })
        //对参数进行去重
        permissionIds = [].concat(...new Set(permissionIds))
        //声明计算出来的添加权限、减少权限、以及参数指定的权限
        let adds: Permission[] = []
        let reduces: Permission[] = []
        let permissions: Permission[] = await this.permissionRepository.findByIds(permissionIds)
        //遍历获取添加的权限
        permissions.forEach(per => {
            let find = result.find(p => {
                return p.id === per.id
            })
            //如果参数设置的权限在角色拥有权限中未找到，则为添加的权限
            if (!find) {
                adds.push(per)
            }
        })
        //遍历获取减少的权限
        result.forEach(per => {
            let find = permissions.find(p => {
                return p.id === per.id
            })
            //如果角色拥有权限在参数指定的结果中未找到，那么说吗这个权限被减去了
            if (!find) {
                reduces.push(per)
            }
        })
        try {
            user.adds = adds
            user.reduces = reduces
            await this.userRepository.save(user)
        } catch (err) {
            throw new HttpException('数据库错误' + err.toString(), 401)
        }
    }

}
