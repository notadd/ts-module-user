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
const typeorm_1 = require("@nestjs/typeorm");
const user_service_1 = require("../service/user.service");
const func_entity_1 = require("../model/func.entity");
const role_entity_1 = require("../model/role.entity");
const user_entity_1 = require("../model/user.entity");
class UserComponent {
    constructor(funcRepository, roleRepository, userRepository, userService) {
        this.funcRepository = funcRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }
    permissions(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userService.permissions(id);
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne(id, { select: ["id", "userName", "status", "recycle"] });
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
    createUser(organizationId, userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userService.createUser(organizationId, userName, password);
        });
    }
    updateUser(id, userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userService.updateUser(id, userName, password);
        });
    }
    setRoles(id, roleIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userService.setRoles(id, roleIds);
        });
    }
    setPermissions(id, permissionIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setPermissions(id, permissionIds);
        });
    }
}
exports.UserComponent = UserComponent;
exports.UserComponentToken = "UserComponentToken";
exports.UserComponentProvider = {
    provide: exports.UserComponentToken,
    useFactory: (funcRepository, roleRepository, userRepository, userService) => {
        return new UserComponent(funcRepository, roleRepository, userRepository, userService);
    },
    inject: [typeorm_1.getRepositoryToken(func_entity_1.Func), typeorm_1.getRepositoryToken(role_entity_1.Role), typeorm_1.getRepositoryToken(user_entity_1.User), user_service_1.UserService]
};

//# sourceMappingURL=user.component.provider.js.map
