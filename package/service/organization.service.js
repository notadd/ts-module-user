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
const typeorm_2 = require("typeorm");
const organization_entity_1 = require("../model/organization.entity");
const user_entity_1 = require("../model/user.entity");
let OrganizationService = class OrganizationService {
    constructor(userRepository, organizationRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }
    getRoots() {
        return __awaiter(this, void 0, void 0, function* () {
            const os = yield this.organizationRepository.createQueryBuilder("o").leftJoinAndSelect("o.parent", "parent").getMany();
            return os.filter(o => !o.parent);
        });
    }
    getChildren(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = yield this.organizationRepository.findOne(id, { relations: ["children"] });
            if (!o) {
                throw new common_1.HttpException("指定父组织id=" + id + "不存在", 402);
            }
            return o.children;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.organizationRepository.find();
        });
    }
    createOrganization(name, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let parent;
            if (parentId !== undefined && parentId !== null) {
                parent = yield this.organizationRepository.findOne(parentId);
                if (!parent) {
                    throw new common_1.HttpException("指定父组织id=" + parentId + "不存在", 402);
                }
            }
            const exist = yield this.organizationRepository.findOne({ name });
            if (exist) {
                throw new common_1.HttpException("指定名称name=" + name + "组织已存在", 403);
            }
            const organization = this.organizationRepository.create({ name, parent });
            try {
                yield this.organizationRepository.save(organization);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    updateOrganization(id, name, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.organizationRepository.findOne(id);
            if (!exist) {
                throw new common_1.HttpException("指定id=" + id + "组织不存在", 404);
            }
            if (name !== exist.name) {
                const exist = yield this.organizationRepository.findOne({ name });
                if (exist) {
                    throw new common_1.HttpException("指定name=" + name + "组织已存在", 404);
                }
            }
            let parent;
            if (parentId !== undefined && parentId !== null) {
                parent = yield this.organizationRepository.findOne(parentId);
                if (!parent) {
                    throw new common_1.HttpException("指定父组织id=" + parentId + "不存在", 402);
                }
            }
            try {
                exist.name = name;
                exist.parent = parent;
                yield this.organizationRepository.save(exist);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    deleteOrganization(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.organizationRepository.findOne(id, { relations: ["children"] });
            if (!exist) {
                throw new common_1.HttpException("指定id=" + id + "组织不存在", 404);
            }
            if (exist.children && exist.children.length > 0) {
                throw new common_1.HttpException("指定组织存在子组织，无法删除", 404);
            }
            try {
                yield this.organizationRepository.remove(exist);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    getUsersInOrganization(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = yield this.organizationRepository.findOne(id, { relations: ["users"] });
            if (!o) {
                throw new common_1.HttpException("指定id=" + id + "父组织不存在", 402);
            }
            return o.users.filter(user => {
                return !user.recycle;
            });
        });
    }
    addUserToOrganization(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = yield this.organizationRepository.findOne(id, { relations: ["users"] });
            if (!o) {
                throw new common_1.HttpException("指定id=" + id + "组织不存在", 402);
            }
            const user = yield this.userRepository.findOne(userId);
            if (!user) {
                throw new common_1.HttpException("指定id=" + userId + "用户不存在", 402);
            }
            const exist = o.users.find(user => {
                return user.id === userId;
            });
            if (exist) {
                throw new common_1.HttpException("指定用户id=" + userId + "已存在于指定组织id=" + id + "中", 402);
            }
            o.users.push(user);
            try {
                yield this.organizationRepository.save(o);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    addUsersToOrganization(id, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = yield this.organizationRepository.findOne(id, { relations: ["users"] });
            if (!o) {
                throw new common_1.HttpException("指定id=" + id + "组织不存在", 402);
            }
            const users = yield this.userRepository.findByIds(userIds);
            userIds.forEach(id => {
                const find = users.find(user => {
                    return user.id === id;
                });
                if (!find) {
                    throw new common_1.HttpException("指定id=" + id + "用户不存在", 402);
                }
            });
            o.users.forEach(user => {
                const match = userIds.find(id => {
                    return id === user.id;
                });
                if (match) {
                    throw new common_1.HttpException("指定用户id=" + user.id + "已存在于指定组织id=" + id + "中", 402);
                }
            });
            o.users.push(...users);
            try {
                yield this.organizationRepository.save(o);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    removeUserFromOrganization(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = yield this.organizationRepository.findOne(id, { relations: ["users"] });
            if (!o) {
                throw new common_1.HttpException("指定id=" + id + "组织不存在", 402);
            }
            const user = yield this.userRepository.findOne(userId);
            if (!user) {
                throw new common_1.HttpException("指定id=" + userId + "用户不存在", 402);
            }
            const index = o.users.findIndex(user => {
                return user.id === userId;
            });
            if (index < 0) {
                throw new common_1.HttpException("指定用户id=" + userId + "不存在于指定组织id=" + id + "中", 402);
            }
            o.users.splice(index, 1);
            try {
                yield this.organizationRepository.save(o);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    removeUsersFromOrganization(id, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = yield this.organizationRepository.findOne(id, { relations: ["users"] });
            if (!o) {
                throw new common_1.HttpException("指定id=" + id + "组织不存在", 402);
            }
            const users = yield this.userRepository.findByIds(userIds);
            userIds.forEach(userId => {
                const find = users.find(user => {
                    return user.id === userId;
                });
                if (!find) {
                    throw new common_1.HttpException("指定id=" + userId + "用户不存在", 402);
                }
                const index = o.users.findIndex(user => {
                    return user.id === userId;
                });
                if (index < 0) {
                    throw new common_1.HttpException("指定用户id=" + userId + "不存在于指定组织id=" + id + "中", 402);
                }
                o.users.splice(index, 1);
            });
            try {
                yield this.organizationRepository.save(o);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
};
OrganizationService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(1, typeorm_1.InjectRepository(organization_entity_1.Organization)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrganizationService);
exports.OrganizationService = OrganizationService;

//# sourceMappingURL=organization.service.js.map
