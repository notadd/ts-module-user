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
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../model/user.entity");
const jwt = require("jsonwebtoken");
const typeorm_2 = require("typeorm");
let AuthService = class AuthService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
        this.secretKey = "secretKey";
        this.expiresIn = 3600;
    }
    createToken(user) {
        return jwt.sign(user, this.secretKey, { expiresIn: this.expiresIn });
    }
    validateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.usersRepository.findOne(user.id, { select: ["id", "userName", "status", "recycle"] });
            if (!exist || !exist.status || exist.recycle) {
                return false;
            }
            return exist;
        });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthService);
exports.AuthService = AuthService;

//# sourceMappingURL=auth.service.js.map
