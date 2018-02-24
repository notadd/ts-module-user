import { UnionUserInfo, TextInfo, ArrayInfo, FileInfo } from '../interface/user/UnionUserInfo';
import { HttpException, Inject, Component } from '@nestjs/common';
import { Repository, Connection, EntityManager } from 'typeorm';
import { StoreComponent } from '../interface/StoreComponent';
import { Organization } from '../model/Organization';
import { InfoGroup } from '../model/InfoGroup';
import { InfoItem } from '../model/InfoItem';
import { UserInfo } from '../model/UserInfo';
import { User } from '../model/User';
import * as crypto from 'crypto';
import { IncomingMessage } from 'http';

@Component()
export class UserService {

    constructor(
        @Inject('StoreComponentToken') private readonly storeComponent: StoreComponent,
        @Inject('UserPMModule.Connection') private readonly connection: Connection,
        @Inject('UserPMModule.UserRepository') private readonly userRepository: Repository<User>,
        @Inject('UserPMModule.UserInfoRepository') private readonly userInfoRepository: Repository<UserInfo>,
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

    async addUserInfoToUser(req: IncomingMessage, id: number, groups: { groupId: number, infos: UnionUserInfo[] }[]): Promise<void> {
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
                if (match.type === '单行文本框' || match.type === '多行文本框' || match.type === '单选框' || match.type === '日期时间选择' || match.type === '日期时间范围选择' || match.type === '下拉菜单') {
                    if (!(infos[j] as TextInfo).value) {
                        throw new HttpException('指定名称信息值:' + match.name + '不存在', 410)
                    }
                    if (!(typeof (infos[j] as TextInfo).value === 'string')) {
                        throw new HttpException('指定类型信息项:' + match.type + '必须为字符串', 410)
                    }
                    //普字符串类型值只需要删除前后空白
                    result = (infos[j] as TextInfo).value.trim()
                } else if (match.type === '多选框' || match.type === '复选框') {
                    if (!(infos[j] as ArrayInfo).array || (infos[j] as ArrayInfo).array.length === 0) {
                        throw new HttpException('指定名称信息值:' + match.name + '不存在', 410)
                    }
                    if (!((infos[j] as ArrayInfo).array instanceof Array)) {
                        throw new HttpException('指定类型信息项:' + match.type + '必须为数组', 410)
                    }
                    //数组类型以，连接各个元素为字符串
                    result = (infos[j] as ArrayInfo).array.join(',')
                } else if (match.type === '上传图片' || match.type === '上传文件') {
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
            if (userName) exist.userName = userName
            if (password) {
                let salt = crypto.createHash('md5').update(new Date().toString()).digest('hex').slice(0, 10)
                exist.password = crypto.createHash('md5').update(password + salt).digest('hex')
            }
            if (nickname) exist.nickname = nickname
            if (realName) exist.realName = realName
            if (sex) exist.sex = sex
            if (birthday) exist.birthday = new Date(birthday)
            if (email) exist.email = email
            if (cellPhoneNumber) exist.cellPhoneNumber = cellPhoneNumber
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
        if(exist.status===false){
            throw new HttpException('指定用户已经封禁', 406)
        }
        try {
            exist.status = false
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


}
