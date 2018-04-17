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
const typeorm_1 = require("@nestjs/typeorm");
const crypto = require("crypto");
const typeorm_2 = require("typeorm");
const func_entity_1 = require("../model/func.entity");
const role_entity_1 = require("../model/role.entity");
const user_entity_1 = require("../model/user.entity");
let UserComponent = class UserComponent {
    constructor(funcRepository, roleRepository, userRepository) {
        this.funcRepository = funcRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }
    permissions(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneById(id, { relations: ["roles", "adds", "reduces"] });
            if (!user) {
                return [];
            }
            const result = [];
            let temp = [];
            const ids = new Set();
            for (let i = 0; i < user.roles.length; i++) {
                const role = yield this.roleRepository.findOneById(user.roles[i].id, { relations: ["funcs"] });
                if (role && role.funcs && role.funcs.length > 0) {
                    for (let j = 0; j < role.funcs.length; j++) {
                        const func = yield this.funcRepository.findOneById(role.funcs[i].id, { relations: ["permissions"] });
                        if (func) {
                            temp = temp.concat(func.permissions);
                        }
                    }
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
        });
    }
    login(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ userName });
            if (!user) {
                return false;
            }
            if (user.recycle) {
                return false;
            }
            const passwordWithSalt = crypto.createHash("sha256").update(password + user.salt).digest("hex");
            if (passwordWithSalt !== user.password) {
                return false;
            }
            return this.userRepository.findOneById(user.id, { select: ["id", "userName", "status", "recycle"] });
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOneById(id, { select: ["id", "userName", "status", "recycle"] });
        });
    }
    getUserByName(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne({ userName }, { select: ["id", "userName", "status", "recycle"] });
        });
    }
    isExist(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.userRepository.findOne(user);
            return !!exist;
        });
    }
};
UserComponent = __decorate([
    __param(0, typeorm_1.InjectRepository(func_entity_1.Func)),
    __param(1, typeorm_1.InjectRepository(role_entity_1.Role)),
    __param(2, typeorm_1.InjectRepository(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserComponent);
exports.UserComponent = UserComponent;
exports.UserComponentProvider = {
    provide: "UserComponentToken",
    useFactory: (funcRepository, roleRepository, userRepository) => {
        return new UserComponent(funcRepository, roleRepository, userRepository);
    },
    inject: ["FuncRepository", "RoleRepository", "UserRepository"]
};
