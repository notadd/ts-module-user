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
const func_entity_1 = require("../model/func.entity");
const module_entity_1 = require("../model/module.entity");
const role_entity_1 = require("../model/role.entity");
let RoleService = class RoleService {
    constructor(funcRepository, roleRepository, moduleRepository) {
        this.funcRepository = funcRepository;
        this.roleRepository = roleRepository;
        this.moduleRepository = moduleRepository;
    }
    createRole(moduleToken, name, score) {
        return __awaiter(this, void 0, void 0, function* () {
            const module = yield this.moduleRepository.findOneById(moduleToken);
            if (!module) {
                throw new common_1.HttpException("指定模块token=" + moduleToken + "不存在", 415);
            }
            const exist = yield this.roleRepository.findOne({ name, moduleToken });
            if (exist) {
                throw new common_1.HttpException("指定模块token=" + moduleToken + "下，指定名称name=" + name + "角色已经存在", 420);
            }
            const role = this.roleRepository.create({ name, score, module });
            try {
                yield this.roleRepository.save(role);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    updateRole(id, name, score) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.roleRepository.findOneById(id);
            if (!role) {
                throw new common_1.HttpException("指定id=" + id + "角色不存在", 421);
            }
            if (name !== role.name) {
                const exist = yield this.roleRepository.findOne({ name, moduleToken: role.moduleToken });
                if (exist) {
                    throw new common_1.HttpException("指定模块token=" + role.moduleToken + "下，指定名称name=" + name + "角色已经存在", 420);
                }
            }
            try {
                role.name = name;
                role.score = score;
                yield this.roleRepository.save(role);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    deleteRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.roleRepository.findOneById(id);
            if (!role) {
                throw new common_1.HttpException("指定id=" + id + "角色不存在", 421);
            }
            try {
                yield this.roleRepository.remove(role);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    setFuncs(id, funcIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.roleRepository.findOneById(id);
            if (!role) {
                throw new common_1.HttpException("指定id=" + id + "角色不存在", 421);
            }
            const funcs = yield this.funcRepository.findByIds(funcIds);
            funcIds.forEach(funcId => {
                const find = funcs.find(func => {
                    return func.id === funcId;
                });
                if (!find) {
                    throw new common_1.HttpException("指定id=" + funcId + "功能不存在", 422);
                }
                if (find.moduleToken !== role.moduleToken) {
                    throw new common_1.HttpException("指定角色、功能必须属于同一个模块", 423);
                }
            });
            try {
                role.funcs = funcs;
                yield this.roleRepository.save(role);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
};
RoleService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(func_entity_1.Func)),
    __param(1, typeorm_1.InjectRepository(role_entity_1.Role)),
    __param(2, typeorm_1.InjectRepository(module_entity_1.Module)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RoleService);
exports.RoleService = RoleService;

//# sourceMappingURL=role.service.js.map
