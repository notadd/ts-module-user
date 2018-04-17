"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class UserComponent {
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
            return this.userRepository.createQueryBuilder("user").select(["user.id", "user.userName", "user.status", "user.recycle"]).where({ userName }).getOne();
        });
    }
    isExist(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.userRepository.findOne(user);
            return !!exist;
        });
    }
}
exports.UserComponent = UserComponent;
exports.UserComponentProvider = {
    provide: "UserComponentToken",
    useFactory: (funcRepository, roleRepository, userRepository) => {
        return new UserComponent(funcRepository, roleRepository, userRepository);
    },
    inject: ["FuncRepository", "RoleRepository", "UserRepository"]
};
