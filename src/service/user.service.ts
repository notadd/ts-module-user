import { Component, HttpException, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createHash } from "crypto";
import { IncomingMessage } from "http";
import { Repository } from "typeorm";
import { StoreComponent } from "../interface/store.component";
import { ArrayInfo, FileInfo, TextInfo, UnionUserInfo } from "../interface/user/union.user.info";
import { Func } from "../model/func.entity";
import { InfoGroup } from "../model/info.group.entity";
import { InfoItem } from "../model/info.item.entity";
import { Organization } from "../model/organization.entity";
import { Permission } from "../model/permission.entity";
import { Role } from "../model/role.entity";
import { User } from "../model/user.entity";
import { UserInfo } from "../model/user.info.entity";

@Component()
export class UserService {

    constructor(
        @Inject("StoreComponentToken") private readonly storeComponent: StoreComponent,
        @InjectRepository(Func) private readonly funcRepository: Repository<Func>,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(UserInfo) private readonly userInfoRepository: Repository<UserInfo>,
        @InjectRepository(InfoGroup) private readonly infoGroupRepository: Repository<InfoGroup>,
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
        @InjectRepository(Organization) private readonly organizationRepository: Repository<Organization>
    ) {
    }

    async getUserById(id: number): Promise<{ id: number, userName: string, status: boolean, recycle: boolean } | undefined> {
        return this.userRepository.findOneById(id, { select: ["id", "userName", "status", "recycle"] });
    }

    async getUserByName(userName: string): Promise<{ id: number, userName: string, status: boolean, recycle: boolean } | undefined> {
        return this.userRepository.createQueryBuilder("user").select(["user.id", "user.userName", "user.status", "user.recycle"]).where({ userName }).getOne();
    }

    async getAll(): Promise<Array<User>> {
        return this.userRepository.find({ recycle: false });
    }

    async getFreedomUsers(): Promise<Array<User>> {
        const users: Array<User> = await this.userRepository.find({ relations: [ "organizations" ] });
        return users.filter(user => {
            return (user.organizations === null || user.organizations === undefined || user.organizations.length === 0) && !user.recycle;
        });
    }

    async getRecycleUsers(): Promise<Array<User>> {
        return this.userRepository.find({ recycle: true });
    }

    /*返回用户信息时，需要提取其InfoItem对象以获取信息名称 */
    async userInfos(id: number): Promise<Array<{ name: string, value: string }>> {
        const user: User|undefined = await this.userRepository.findOneById(id, { relations: [ "userInfos" ] });
        if (!user) {
            throw new HttpException("指定用户不存在", 406);
        }
        const userInfos: Array<UserInfo> = await this.userInfoRepository
            .createQueryBuilder("userInfo")
            .leftJoinAndSelect("userInfo.infoItem", "infoItem", "userInfo.infoItemId=infoItem.id")
            .where("userInfo.userId = :id", { id })
            .getMany();

        return userInfos.map(userInfo => {
            return { name: userInfo.infoItem.name, value: userInfo.value };
        });
    }

    async roles(id: number): Promise<Array<Role>> {
        const user: User|undefined = await this.userRepository.findOneById(id, { relations: [ "roles" ] });
        if (!user) {
            throw new HttpException("指定用户不存在", 406);
        }
        return user.roles;
    }

    async permissions(id: number): Promise<Array<Permission>> {
        const user: User|undefined = await this.userRepository.findOneById(id, { relations: [ "roles", "adds", "reduces" ] });
        if (!user) {
            throw new HttpException("指定id=" + id + "用户不存在", 406);
        }
        // 声明最后的结果
        const result: Array<Permission> = [];
        // 声明临时结果，未去重
        let temp: Array<Permission> = [];
        // 用来去重的集合
        const ids: Set<number> = new Set();
        // 遍历获取所有角色拥有的权限
        for (let i = 0; i < user.roles.length; i++) {
            const role: Role|undefined = await this.roleRepository.findOneById(user.roles[ i ].id, { relations: [ "funcs" ] });
            if (role && role.funcs && role.funcs.length > 0) {
                for (let j = 0; j < role.funcs.length; j++) {
                    const func: Func|undefined = await this.funcRepository.findOneById(role.funcs[ i ].id, { relations: [ "permissions" ] });
                    if (func) {
                        temp = temp.concat(func.permissions);
                    }
                }
            }
        }
        // 生成去重的集合
        temp.forEach(per => {
            if (!ids.has(per.id)) {
                ids.add(per.id);
                result.push(per);
            }
        });
        // 遍历添加权限
        user.adds.forEach(per => {
            if (!ids.has(per.id)) {
                ids.add(per.id);
                result.push(per);
            }
        });
        // 遍历减去权限
        user.reduces.forEach(per => {
            if (ids.has(per.id)) {
                ids.delete(per.id);
                const index = result.findIndex(p => {
                    return p.id === per.id;
                });
                result.splice(index, 1);
            }
        });
        result.sort((a, b) => {
            return a.id - b.id;
        });

        return result;
    }

    async createUser(organizationId: number, userName: string, password: string): Promise<void> {
        const organizations: Array<Organization> = [];
        if (organizationId) {
            const organization = await this.organizationRepository.findOneById(organizationId);
            if (!organization) {
                throw new HttpException("指定id=" + organizationId + "组织不存在", 402);
            }
            organizations.push(organization);
        }
        const exist: User|undefined = await this.userRepository.findOne({ userName });
        if (exist) {
            throw new HttpException("指定userName=" + userName + "用户已存在", 406);
        }
        try {
            const salt = createHash("sha256").update(new Date().toString()).digest("hex").slice(0, 10);
            const passwordWithSalt = createHash("sha256").update(password + salt).digest("hex");
            const user: User = this.userRepository.create({
                userName,
                password: passwordWithSalt,
                salt,
                status: true,
                recycle: false,
                organizations
            });
            await this.userRepository.save(user);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async createUserWithUserInfo(req: IncomingMessage, organizationId: number, userName: string, password: string, groups: Array<{ groupId: number, infos: Array<UnionUserInfo> }>): Promise<void> {
        const organizations: Array<Organization> = [];
        if (organizationId) {
            const organization = await this.organizationRepository.findOneById(organizationId);
            if (!organization) {
                throw new HttpException("指定id=" + organizationId + "组织不存在", 402);
            }
            organizations.push(organization);
        }
        const exist: User|undefined = await this.userRepository.findOne({ userName });
        if (exist) {
            throw new HttpException("指定userName=" + userName + "用户已存在", 406);
        }
        const salt = createHash("sha256").update(new Date().toString()).digest("hex").slice(0, 10);
        const passwordWithSalt = createHash("sha256").update(password + salt).digest("hex");
        const user: User = this.userRepository.create({
            userName,
            password: passwordWithSalt,
            salt,
            status: true,
            recycle: false,
            organizations,
            userInfos: [],
            infoItems: []
        });
        for (let i = 0; i < groups.length; i++) {
            const { groupId, infos } = groups[ i ];
            const group: InfoGroup|undefined = await this.infoGroupRepository.findOneById(groupId, { relations: [ "items" ] });
            if (!group) {
                throw new HttpException("指定信息组id=" + groupId + "不存在", 408);
            }
            await this.addUserInfosAndInfoItems(req, user, group, infos);
        }
        try {
            await this.userRepository.save(user);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async addUserInfoToUser(req: IncomingMessage, id: number, groups: Array<{ groupId: number, infos: Array<UnionUserInfo> }>): Promise<void> {
        const user: User|undefined = await this.userRepository.findOneById(id, { relations: [ "userInfos", "infoItems" ] });
        if (!user) {
            throw new HttpException("指定id=" + id + "用户不存在", 406);
        }
        for (let i = 0; i < groups.length; i++) {
            const { groupId, infos } = groups[ i ];
            const group: InfoGroup|undefined = await this.infoGroupRepository.findOneById(groupId, { relations: [ "items" ] });
            if (!group) {
                throw new HttpException("指定信息组id=" + groupId + "不存在", 408);
            }
            await this.addUserInfosAndInfoItems(req, user, group, infos);
        }
        try {
            await this.userRepository.save(user);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    /* 将指定信息组的信息加入到用户对象中，里面没有数据库更改操作，只是改变了用户的userInfos、infoItems两个属性，当save时新的userInfo会被插入，旧的会被更新，infoItem与user的关系会被建立*/
    async addUserInfosAndInfoItems(req: IncomingMessage, user: User, group: InfoGroup, infos: Array<UnionUserInfo>): Promise<void> {
        // 获取所有信息项
        const items: Array<InfoItem> = group.items || [];
        // 所有必填信息项
        const necessary: Array<InfoItem> = items.filter(item => {
            return item.necessary === true;
        });
        // 遍历得到的信息
        for (let j = 0; j < infos.length; j++) {
            const { name }: UnionUserInfo = infos[ j ];
            // 查找名称匹配的信息项
            const match: InfoItem|undefined = items.find(item => {
                return item.name === name;
            });
            // 如果接收到的信息项名称不存在，抛出异常
            if (!match) {
                throw new HttpException("指定名称信息项:" + name + "不存在于信息组id=" + group.id + "中", 409);
            }
            /*获取根据信息项类型转换后的信息值 */
            const result: string = await this.transfromInfoValue(req, match, infos[ j ]);
            /*如果此时user中已经包含同名信息项，后来的覆盖先前的，因为相同信息项可能存在于多个组当中，而添加时可能出现一次添加多个组信息的情况，所以可能出现同类信息项 */
            const userInfoIndex = user.userInfos.findIndex(userInfo => userInfo.infoItemId === match.id);
            if (userInfoIndex >= 0) {
                /*如果当前遍历的信息项对应的信息已经存在于用户的信息当中，直接修改其value
                  当创建用户时，出现重复，修改value后就会只保存新的用户信息
                  当添加用户信息时，出现重复，就会修改以前的信息，并且cascaedUpdate*/
                user.userInfos[ userInfoIndex ].value = result;
            } else {
                /*不存在添加新的 */
                user.userInfos.push(this.userInfoRepository.create({ infoItem: match, value: result }));
            }
            /*获取填写的必填信息项的下标 */
            const index = necessary.findIndex(item => {
                return item.id === match.id;
            });
            if (index >= 0) {
                /*移除填写过的必填信息项 */
                necessary.splice(index, 1);
            }
            /*将添加后的信息项加入用户，如果重复保存时会字段去重 */
            user.infoItems.push(match);
        }
        // 如果必填项没有填写，抛出异常
        if (necessary.length !== 0) {
            const names = necessary.map(item => item.name);
            throw new HttpException("指定信息项:" + names.join(",") + "为必填项", 410);
        }
    }

    async transfromInfoValue(req: IncomingMessage, match: InfoItem, info: UnionUserInfo): Promise<string> {
        let result: string;
        // 根据不同类型信息项校验信息类型，顺便转换信息值
        // "单行文本框", "多行文本框", "单选框", "多选框", "复选框", "日期时间选择", "日期时间范围选择", "下拉菜单", "上传图片", "上传文件"
        if (match.type === "text" || match.type === "textarea" || match.type === "radio" || match.type === "date" || match.type === "number" || match.type === "pulldownmenu") {
            if (!(info as TextInfo).value) {
                throw new HttpException("指定名称信息值:" + match.name + "不存在", 410);
            }
            if (typeof (info as TextInfo).value !== "string") {
                throw new HttpException("指定名称信息项name=" + match.name + "必须为字符串", 410);
            }
            // 普字符串类型值只需要删除前后空白
            result = (info as TextInfo).value.trim();
        } else if (match.type === "checkbox") {
            if (!(info as ArrayInfo).array || (info as ArrayInfo).array.length === 0) {
                throw new HttpException("指定名称信息值:" + match.name + "不存在", 410);
            }
            if (!((info as ArrayInfo).array instanceof Array)) {
                throw new HttpException("指定名称信息项name=" + match.name + "必须为数组", 410);
            }
            // 数组类型以，连接各个元素为字符串
            result = (info as ArrayInfo).array.join(",");
        } else {
            if (!(info as FileInfo).base64) {
                throw new HttpException("指定名称信息项name=" + match.name + "必须具有文件base64编码", 410);
            }
            if (!(info as FileInfo).rawName) {
                throw new HttpException("指定名称信息项name=" + match.name + "必须具有文件原名", 410);
            }
            if (!(info as FileInfo).bucketName) {
                throw new HttpException("指定名称信息项name=" + match.name + "必须具有文件存储空间名", 410);
            }
            // 文件类型，上传到存储插件，并保存访问url
            const { bucketName, name, type } = await this.storeComponent.upload((info as FileInfo).bucketName, (info as FileInfo).rawName, (info as FileInfo).base64, undefined);
            result = await this.storeComponent.getUrl(req, bucketName, name, type, undefined as any);
        }
        return result;
    }

    async updateUser(id: number, userName: string, password: string): Promise<void> {
        const exist: User|undefined = await this.userRepository.findOneById(id);
        if (!exist) {
            throw new HttpException("指定id=" + id + "用户不存在", 406);
        }
        if (userName !== exist.userName) {
            const sameUser: User|undefined = await this.userRepository.findOne({ userName });
            if (sameUser) {
                throw new HttpException("指定userName=" + userName + "用户已存在", 406);
            }
        }
        try {
            exist.userName = userName;
            const salt = createHash("sha256").update(new Date().toString()).digest("hex").slice(0, 10);
            exist.salt = salt;
            exist.password = createHash("sha256").update(password + salt).digest("hex");
            await this.userRepository.save(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async bannedUser(id: number): Promise<void> {
        const exist: User|undefined = await this.userRepository.findOneById(id);
        if (!exist) {
            throw new HttpException("指定id=" + id + "用户不存在", 406);
        }
        if (exist.recycle) {
            throw new HttpException("指定id=" + id + "用户已存在回收站中", 406);
        }
        if (!exist.status) {
            throw new HttpException("指定id=" + id + "用户已经封禁", 406);
        }
        try {
            exist.status = false;
            await this.userRepository.save(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async unBannedUser(id: number): Promise<void> {
        const exist: User|undefined = await this.userRepository.findOneById(id);
        if (!exist) {
            throw new HttpException("指定id=" + id + "用户不存在", 406);
        }
        if (exist.recycle) {
            throw new HttpException("指定id=" + id + "用户已存在回收站中", 406);
        }
        if (exist.status) {
            throw new HttpException("指定id=" + id + "用户不需要解封", 406);
        }
        try {
            exist.status = true;
            await this.userRepository.save(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async softDeleteUser(id: number): Promise<void> {
        const exist: User|undefined = await this.userRepository.findOneById(id);
        if (!exist) {
            throw new HttpException("指定id=" + id + "用户不存在", 406);
        }
        if (exist.recycle) {
            throw new HttpException("指定id=" + id + "用户已存在回收站中", 406);
        }
        try {
            exist.recycle = true;
            await this.userRepository.save(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async restoreUser(id: number): Promise<void> {
        const exist: User|undefined = await this.userRepository.findOneById(id);
        if (!exist) {
            throw new HttpException("指定id=" + id + "用户不存在", 406);
        }
        if (!exist.recycle) {
            throw new HttpException("指定id=" + id + "用户不存在回收站中", 406);
        }
        try {
            exist.recycle = false;
            await this.userRepository.save(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async restoreUsers(ids: Array<number>): Promise<void> {
        const users: Array<User> = await this.userRepository.findByIds(ids);
        ids.forEach(id => {
            const find: User|undefined = users.find(user => {
                return user.id === id;
            });
            if (!find) {
                throw new HttpException("指定id=" + id + "用户不存在", 406);
            }
            if (!find.recycle) {
                throw new HttpException("指定用户id=" + id + "不在回收站中", 406);
            }
            find.recycle = false;
        });
        try {
            await this.userRepository.save(users);

        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async deleteUser(id: number): Promise<void> {
        const exist: User|undefined = await this.userRepository.findOneById(id);
        if (!exist) {
            throw new HttpException("指定id=" + id + "用户不存在", 406);
        }
        if (!exist.recycle) {
            throw new HttpException("指定id=" + id + "用户不存在回收站中", 406);
        }
        try {
            await this.userRepository.remove(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async deleteUsers(ids: Array<number>): Promise<void> {
        const users: Array<User> = await this.userRepository.findByIds(ids);
        ids.forEach(id => {
            const find = users.find(user => {
                return user.id === id;
            });
            if (!find) {
                throw new HttpException("指定id=" + id + "用户不存在", 406);
            }
            if (!find.recycle) {
                throw new HttpException("指定id=" + id + "用户不存在于回收站中", 406);
            }
        });
        try {
            await this.userRepository.remove(users);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async setRoles(id: number, roleIds: Array<number>): Promise<void> {
        const user: User|undefined = await this.userRepository.findOneById(id, { relations: [ "roles" ] });
        if (!user) {
            throw new HttpException("指定id=" + id + "用户不存在", 406);
        }
        const roles: Array<Role> = await this.roleRepository.findByIds(roleIds);
        roleIds.forEach(roleId => {
            const find = roles.find(role => {
                return role.id === roleId;
            });
            if (!find) {
                throw new HttpException("指定id=" + roleId + "角色不存在", 406);
            }
        });
        user.roles = roles;
        try {
            await this.userRepository.save(user);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async setPermissions(id: number, permissionIds: Array<number>): Promise<void> {
        const user: User|undefined = await this.userRepository.findOneById(id, { relations: [ "roles", "adds", "reduces" ] });
        if (!user) {
            throw new HttpException("指定id=" + id + "用户不存在", 406);
        }
        // 声明从role获取的权限集合
        const result: Array<Permission> = [];
        // 声明临时结果，未去重
        let temp: Array<Permission> = [];
        // 用来去重的集合
        const ids: Set<number> = new Set();
        // 遍历获取所有角色拥有的权限
        for (let i = 0; i < user.roles.length; i++) {
            const role: Role|undefined = await this.roleRepository.findOneById(user.roles[ i ].id, { relations: [ "funcs" ] });
            if (role && role.funcs && role.funcs.length > 0) {
                for (let j = 0; j < role.funcs.length; j++) {
                    const func: Func|undefined = await this.funcRepository.findOneById(role.funcs[ i ].id, { relations: [ "permissions" ] });
                    if (func) {
                        temp = temp.concat(func.permissions);
                    }
                }
            }
        }
        // 生成去重的集合
        temp.forEach(per => {
            if (!ids.has(per.id)) {
                ids.add(per.id);
                result.push(per);
            }
        });
        // 对参数进行去重
        permissionIds = [].concat(...new Set(permissionIds) as any);
        // 声明计算出来的添加权限、减少权限、以及参数指定的权限
        const adds: Array<Permission> = [];
        const reduces: Array<Permission> = [];
        const permissions: Array<Permission> = await this.permissionRepository.findByIds(permissionIds);
        // 遍历获取添加的权限
        permissions.forEach(per => {
            const find = result.find(p => {
                return p.id === per.id;
            });
            // 如果参数设置的权限在角色拥有权限中未找到，则为添加的权限
            if (!find) {
                adds.push(per);
            }
        });
        // 遍历获取减少的权限
        result.forEach(per => {
            const find = permissions.find(p => {
                return p.id === per.id;
            });
            // 如果角色拥有权限在参数指定的结果中未找到，那么说吗这个权限被减去了
            if (!find) {
                reduces.push(per);
            }
        });
        try {
            user.adds = adds;
            user.reduces = reduces;
            await this.userRepository.save(user);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

}
