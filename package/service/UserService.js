"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crypto = require("crypto");
const typeorm_2 = require("typeorm");
const Func_entity_1 = require("../model/Func.entity");
const InfoGroup_entity_1 = require("../model/InfoGroup.entity");
const Organization_entity_1 = require("../model/Organization.entity");
const Permission_entity_1 = require("../model/Permission.entity");
const Role_entity_1 = require("../model/Role.entity");
const User_entity_1 = require("../model/User.entity");
const UserInfo_entity_1 = require("../model/UserInfo.entity");
let UserService = class UserService {
    constructor(storeComponent, funcRepository, roleRepository, userRepository, userInfoRepository, infoGroupRepository, permissionRepository, organizationRepository) {
        this.storeComponent = storeComponent;
        this.funcRepository = funcRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
        this.infoGroupRepository = infoGroupRepository;
        this.permissionRepository = permissionRepository;
        this.organizationRepository = organizationRepository;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find({ recycle: false });
        });
    }
    getFreedomUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield this.userRepository.find({ relations: ['organizations'] });
            return users.filter(user => {
                return (user.organizations === null || user.organizations === undefined || user.organizations.length === 0) && !user.recycle;
            });
        });
    }
    getRecycleUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find({ recycle: true });
        });
    }
    userInfos(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOneById(id, { relations: ['userInfos'] });
            if (!user) {
                throw new common_1.HttpException('指定用户不存在', 406);
            }
            let userInfos = yield this.userInfoRepository.createQueryBuilder("userInfo").leftJoinAndSelect('userInfo.infoItem', 'infoItem', 'userInfo.infoItemId=infoItem.id').where("userInfo.userId = :id", { id }).getMany();
            return userInfos.map(userInfo => {
                return { name: userInfo.infoItem.name, value: userInfo.value };
            });
        });
    }
    roles(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOneById(id, { relations: ['roles'] });
            if (!user) {
                throw new common_1.HttpException('指定用户不存在', 406);
            }
            return user.roles;
        });
    }
    permissions(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOneById(id, { relations: ['roles', 'adds', 'reduces'] });
            if (!user) {
                throw new common_1.HttpException('指定id=' + id + '用户不存在', 406);
            }
            let result = [];
            let temp = [];
            let ids = new Set();
            for (let i = 0; i < user.roles.length; i++) {
                let role = yield this.roleRepository.findOneById(user.roles[i].id, { relations: ['funcs'] });
                for (let j = 0; j < role.funcs.length; j++) {
                    let func = yield this.funcRepository.findOneById(role.funcs[i].id, { relations: ['permissions'] });
                    temp = temp.concat(func.permissions);
                }
            }
            temp.forEach(per => {
                if (!ids.has(per.id)) {
                    ids.add(per.id);
                    result.push(per);
                }
            });
            user.adds.forEach(per => {
                if (!ids.has(per.id)) {
                    ids.add(per.id);
                    result.push(per);
                }
            });
            user.reduces.forEach(per => {
                if (ids.has(per.id)) {
                    ids.delete(per.id);
                    let index = result.findIndex(p => {
                        return p.id === per.id;
                    });
                    result.splice(index, 1);
                }
            });
            result.sort((a, b) => {
                return a.id - b.id;
            });
            return result;
        });
    }
    createUser(organizationId, userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let organizations = [];
            if (organizationId) {
                let organization = yield this.organizationRepository.findOneById(organizationId);
                if (!organization) {
                    throw new common_1.HttpException('指定id=' + organizationId + '组织不存在', 402);
                }
                organizations.push(organization);
            }
            let exist = yield this.userRepository.findOne({ userName });
            if (exist) {
                throw new common_1.HttpException('指定userName=' + userName + '用户已存在', 406);
            }
            try {
                let salt = crypto.createHash('md5').update(new Date().toString()).digest('hex').slice(0, 10);
                let passwordWithSalt = crypto.createHash('md5').update(password + salt).digest('hex');
                let user = this.userRepository.create({
                    userName,
                    password: passwordWithSalt,
                    salt,
                    status: true,
                    recycle: false,
                    organizations
                });
                yield this.userRepository.save(user);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    createUserWithUserInfo(req, organizationId, userName, password, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            let organizations = [];
            if (organizationId) {
                let organization = yield this.organizationRepository.findOneById(organizationId);
                if (!organization) {
                    throw new common_1.HttpException('指定id=' + organizationId + '组织不存在', 402);
                }
                organizations.push(organization);
            }
            let exist = yield this.userRepository.findOne({ userName });
            if (exist) {
                throw new common_1.HttpException('指定userName=' + userName + '用户已存在', 406);
            }
            let salt = crypto.createHash('md5').update(new Date().toString()).digest('hex').slice(0, 10);
            let passwordWithSalt = crypto.createHash('md5').update(password + salt).digest('hex');
            let user = this.userRepository.create({
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
                let { groupId, infos } = groups[i];
                let group = yield this.infoGroupRepository.findOneById(groupId, { relations: ['items'] });
                if (!group) {
                    throw new common_1.HttpException('指定信息组id=' + groupId + '不存在', 408);
                }
                yield this.addUserInfosAndInfoItems(req, user, group, infos);
            }
            try {
                yield this.userRepository.save(user);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    addUserInfoToUser(req, id, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOneById(id, { relations: ['userInfos', 'infoItems'] });
            if (!user) {
                throw new common_1.HttpException('指定id=' + id + '用户不存在', 406);
            }
            for (let i = 0; i < groups.length; i++) {
                let { groupId, infos } = groups[i];
                let group = yield this.infoGroupRepository.findOneById(groupId, { relations: ['items'] });
                if (!group) {
                    throw new common_1.HttpException('指定信息组id=' + groupId + '不存在', 408);
                }
                yield this.addUserInfosAndInfoItems(req, user, group, infos);
            }
            try {
                yield this.userRepository.save(user);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    addUserInfosAndInfoItems(req, user, group, infos) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = group.items || [];
            let necessary = items.filter(item => {
                return !!item.necessary;
            });
            for (let j = 0; j < infos.length; j++) {
                let { name } = infos[j];
                let match = items.find(item => {
                    return item.name === name;
                });
                if (!match) {
                    throw new common_1.HttpException('指定名称信息项:' + name + '不存在于信息组id=' + group.id + '中', 409);
                }
                let result = yield this.transfromInfoValue(req, match, infos[j]);
                let userInfoIndex = user.userInfos.findIndex(userInfo => userInfo.infoItemId === match.id);
                if (userInfoIndex >= 0) {
                    user.userInfos[userInfoIndex].value = result;
                }
                else {
                    user.userInfos.push(this.userInfoRepository.create({ infoItem: match, value: result }));
                }
                let index = necessary.findIndex(item => {
                    return item.id === match.id;
                });
                if (index >= 0) {
                    necessary.splice(index, 1);
                }
                user.infoItems.push(match);
            }
            if (necessary.length !== 0) {
                let names = necessary.map(item => item.name);
                throw new common_1.HttpException('指定信息项:' + names.join(',') + '为必填项', 410);
            }
        });
    }
    transfromInfoValue(req, match, info) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if (match.type === 'text' || match.type === 'textarea' || match.type === 'radio' || match.type === 'date' || match.type === 'number' || match.type === 'pulldownmenu') {
                if (!info.value) {
                    throw new common_1.HttpException('指定名称信息值:' + match.name + '不存在', 410);
                }
                if (!(typeof info.value === 'string')) {
                    throw new common_1.HttpException('指定名称信息项name=' + match.name + '必须为字符串', 410);
                }
                result = info.value.trim();
            }
            else if (match.type === 'checkbox') {
                if (!info.array || info.array.length === 0) {
                    throw new common_1.HttpException('指定名称信息值:' + match.name + '不存在', 410);
                }
                if (!(info.array instanceof Array)) {
                    throw new common_1.HttpException('指定名称信息项name=' + match.name + '必须为数组', 410);
                }
                result = info.array.join(',');
            }
            else if (match.type === 'uploadimagewithpreview' || match.type === 'uploadfile') {
                if (!info.base64) {
                    throw new common_1.HttpException('指定名称信息项name=' + match.name + '必须具有文件base64编码', 410);
                }
                if (!info.rawName) {
                    throw new common_1.HttpException('指定名称信息项name=' + match.name + '必须具有文件原名', 410);
                }
                if (!info.bucketName) {
                    throw new common_1.HttpException('指定名称信息项name=' + match.name + '必须具有文件存储空间名', 410);
                }
                let { bucketName, name, type } = yield this.storeComponent.upload(info.bucketName, info.rawName, info.base64, null);
                result = yield this.storeComponent.getUrl(req, bucketName, name, type, null);
            }
            return result;
        });
    }
    updateUser(id, userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist = yield this.userRepository.findOneById(id);
            if (!exist) {
                throw new common_1.HttpException('指定id=' + id + '用户不存在', 406);
            }
            if (userName !== exist.userName) {
                let sameUser = yield this.userRepository.findOne({ userName });
                if (sameUser) {
                    throw new common_1.HttpException('指定userName=' + userName + '用户已存在', 406);
                }
            }
            try {
                exist.userName = userName;
                let salt = crypto.createHash('md5').update(new Date().toString()).digest('hex').slice(0, 10);
                exist.salt = salt;
                exist.password = crypto.createHash('md5').update(password + salt).digest('hex');
                yield this.userRepository.save(exist);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    bannedUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist = yield this.userRepository.findOneById(id);
            if (!exist) {
                throw new common_1.HttpException('指定id=' + id + '用户不存在', 406);
            }
            if (exist.recycle) {
                throw new common_1.HttpException('指定id=' + id + '用户已存在回收站中', 406);
            }
            if (!exist.status) {
                throw new common_1.HttpException('指定id=' + id + '用户已经封禁', 406);
            }
            try {
                exist.status = false;
                yield this.userRepository.save(exist);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    unBannedUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist = yield this.userRepository.findOneById(id);
            if (!exist) {
                throw new common_1.HttpException('指定id=' + id + '用户不存在', 406);
            }
            if (exist.recycle) {
                throw new common_1.HttpException('指定id=' + id + '用户已存在回收站中', 406);
            }
            if (exist.status) {
                throw new common_1.HttpException('指定id=' + id + '用户不需要解封', 406);
            }
            try {
                exist.status = true;
                yield this.userRepository.save(exist);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    softDeleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist = yield this.userRepository.findOneById(id);
            if (!exist) {
                throw new common_1.HttpException('指定id=' + id + '用户不存在', 406);
            }
            if (exist.recycle) {
                throw new common_1.HttpException('指定id=' + id + '用户已存在回收站中', 406);
            }
            try {
                exist.recycle = true;
                yield this.userRepository.save(exist);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    restoreUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist = yield this.userRepository.findOneById(id);
            if (!exist) {
                throw new common_1.HttpException('指定id=' + id + '用户不存在', 406);
            }
            if (!exist.recycle) {
                throw new common_1.HttpException('指定id=' + id + '用户不存在回收站中', 406);
            }
            try {
                exist.recycle = false;
                yield this.userRepository.save(exist);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    restoreUsers(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield this.userRepository.findByIds(ids);
            ids.forEach(id => {
                let find = users.find(user => {
                    return user.id === id;
                });
                if (!find) {
                    throw new common_1.HttpException('指定id=' + id + '用户不存在', 406);
                }
                if (!find.recycle) {
                    throw new common_1.HttpException('指定用户id=' + id + '不在回收站中', 406);
                }
                find.recycle === true;
            });
            try {
                yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    return this.userRepository.save(user);
                }), this));
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist = yield this.userRepository.findOneById(id);
            if (!exist) {
                throw new common_1.HttpException('指定id=' + id + '用户不存在', 406);
            }
            if (!exist.recycle) {
                throw new common_1.HttpException('指定id=' + id + '用户不存在回收站中', 406);
            }
            try {
                yield this.userRepository.remove(exist);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    deleteUsers(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield this.userRepository.findByIds(ids);
            ids.forEach(id => {
                let find = users.find(user => {
                    return user.id === id;
                });
                if (!find) {
                    throw new common_1.HttpException('指定id=' + id + '用户不存在', 406);
                }
                if (!find.recycle) {
                    throw new common_1.HttpException('指定id=' + id + '用户不存在于回收站中', 406);
                }
            });
            try {
                yield this.userRepository.remove(users);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    setRoles(id, roleIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOneById(id, { relations: ['roles'] });
            if (!user) {
                throw new common_1.HttpException('指定id=' + id + '用户不存在', 406);
            }
            let roles = yield this.roleRepository.findByIds(roleIds);
            roleIds.forEach(roleId => {
                let find = roles.find(role => {
                    return role.id === roleId;
                });
                if (!find) {
                    throw new common_1.HttpException('指定id=' + roleId + '角色不存在', 406);
                }
            });
            user.roles = roles;
            try {
                yield this.userRepository.save(user);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    setPermissions(id, permissionIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOneById(id, { relations: ['roles', 'adds', 'reduces'] });
            if (!user) {
                throw new common_1.HttpException('指定id=' + id + '用户不存在', 406);
            }
            let result = [];
            let temp = [];
            let ids = new Set();
            for (let i = 0; i < user.roles.length; i++) {
                let role = yield this.roleRepository.findOneById(user.roles[i].id, { relations: ['funcs'] });
                for (let j = 0; j < role.funcs.length; j++) {
                    let func = yield this.funcRepository.findOneById(role.funcs[i].id, { relations: ['permissions'] });
                    temp = temp.concat(func.permissions);
                }
            }
            temp.forEach(per => {
                if (!ids.has(per.id)) {
                    ids.add(per.id);
                    result.push(per);
                }
            });
            permissionIds = [].concat(...new Set(permissionIds));
            let adds = [];
            let reduces = [];
            let permissions = yield this.permissionRepository.findByIds(permissionIds);
            permissions.forEach(per => {
                let find = result.find(p => {
                    return p.id === per.id;
                });
                if (!find) {
                    adds.push(per);
                }
            });
            result.forEach(per => {
                let find = permissions.find(p => {
                    return p.id === per.id;
                });
                if (!find) {
                    reduces.push(per);
                }
            });
            try {
                user.adds = adds;
                user.reduces = reduces;
                yield this.userRepository.save(user);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
};
UserService = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject('StoreComponentToken')),
    __param(1, typeorm_1.InjectRepository(Func_entity_1.Func)),
    __param(2, typeorm_1.InjectRepository(Role_entity_1.Role)),
    __param(3, typeorm_1.InjectRepository(User_entity_1.User)),
    __param(4, typeorm_1.InjectRepository(UserInfo_entity_1.UserInfo)),
    __param(5, typeorm_1.InjectRepository(InfoGroup_entity_1.InfoGroup)),
    __param(6, typeorm_1.InjectRepository(Permission_entity_1.Permission)),
    __param(7, typeorm_1.InjectRepository(Organization_entity_1.Organization)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
