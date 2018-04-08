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
const Func_entity_1 = require("../model/Func.entity");
const Role_entity_1 = require("../model/Role.entity");
const User_entity_1 = require("../model/User.entity");
let UserComponent = class UserComponent {
    constructor(funcRepository, roleRepository, userRepository) {
        this.funcRepository = funcRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }
    permissions(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOneById(id, { relations: ['roles', 'adds', 'reduces'] });
            if (!user) {
                return [];
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
    login(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne({ userName });
            if (!user) {
                return false;
            }
            if (user.recycle) {
                return false;
            }
            let passwordWithSalt = crypto.createHash('md5').update(password + user.salt).digest('hex');
            if (passwordWithSalt !== user.password) {
                return false;
            }
            return yield this.userRepository.findOneById(user.id, { select: ['id', 'userName', 'status', 'recycle'] });
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOneById(id, { select: ['id', 'userName', 'status', 'recycle'] });
        });
    }
    isExist(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist = yield this.userRepository.findOne(user);
            return !!exist;
        });
    }
};
UserComponent = __decorate([
    __param(0, typeorm_1.InjectRepository(Func_entity_1.Func)),
    __param(1, typeorm_1.InjectRepository(Role_entity_1.Role)),
    __param(2, typeorm_1.InjectRepository(User_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserComponent);
exports.UserComponent = UserComponent;
exports.UserComponentProvider = {
    provide: 'UserComponentToken',
    useFactory: (funcRepository, roleRepository, userRepository) => {
        return new UserComponent(funcRepository, roleRepository, userRepository);
    },
    inject: ['FuncRepository', 'RoleRepository', 'UserRepository']
};
