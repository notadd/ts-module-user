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
const permission_entity_1 = require("../model/permission.entity");
let FuncService = class FuncService {
    constructor(funcRepository, moduleRepository, permissionRepository) {
        this.funcRepository = funcRepository;
        this.moduleRepository = moduleRepository;
        this.permissionRepository = permissionRepository;
    }
    createFunc(moduleToken, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const module = yield this.moduleRepository.findOneById(moduleToken);
            if (!module) {
                throw new common_1.HttpException("指定模块token=" + moduleToken + "不存在", 415);
            }
            const exist = yield this.funcRepository.findOne({ name, moduleToken });
            if (exist) {
                throw new common_1.HttpException("指定模块token=" + moduleToken + "下，指定名称name=" + name + "功能已经存在", 416);
            }
            const func = this.funcRepository.create({ name, module });
            try {
                yield this.funcRepository.save(func);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    updateFunc(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const func = yield this.funcRepository.findOneById(id);
            if (!func) {
                throw new common_1.HttpException("指定id=" + id + "功能不存在", 417);
            }
            if (name !== func.name) {
                const exist = yield this.funcRepository.findOne({ name, moduleToken: func.moduleToken });
                if (exist) {
                    throw new common_1.HttpException("指定模块token=" + func.moduleToken + "下，指定名称name=" + name + "功能已经存在", 416);
                }
                try {
                    func.name = name;
                    yield this.funcRepository.save(func);
                }
                catch (err) {
                    throw new common_1.HttpException("数据库错误" + err.toString(), 401);
                }
            }
        });
    }
    deleteFunc(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const func = yield this.funcRepository.findOneById(id);
            if (!func) {
                throw new common_1.HttpException("指定id=" + id + "功能不存在", 417);
            }
            try {
                yield this.funcRepository.remove(func);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    setPermissions(id, permissionIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const func = yield this.funcRepository.findOneById(id, { relations: ["permissions"] });
            if (!func) {
                throw new common_1.HttpException("指定id=" + id + "功能不存在", 417);
            }
            const pers = yield this.permissionRepository.findByIds(permissionIds, { relations: ["module"] });
            permissionIds.forEach(permissionId => {
                const find = pers.find(per => {
                    return per.id === permissionId;
                });
                if (!find) {
                    throw new common_1.HttpException("指定id=" + permissionId + "权限不存在", 418);
                }
                if (find.moduleToken !== func.moduleToken) {
                    throw new common_1.HttpException("指定功能、权限只能属于同一个模块", 419);
                }
            });
            try {
                func.permissions = pers;
                yield this.funcRepository.save(func);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
};
FuncService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(func_entity_1.Func)),
    __param(1, typeorm_1.InjectRepository(module_entity_1.Module)),
    __param(2, typeorm_1.InjectRepository(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FuncService);
exports.FuncService = FuncService;

//# sourceMappingURL=func.service.js.map
