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
const permission_controller_1 = require("../decorator/permission.controller");
const user_component_provider_1 = require("../export/user.component.provider");
exports.MODULE_TOKEN = "module_token";
let PermissionGuard = class PermissionGuard {
    constructor(userComponent) {
        this.userComponent = userComponent;
    }
    canActivate(req, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parent, handler } = context;
            const auth = req.headers.authentication;
            const user = { id: 1, recycle: false, status: true };
            let permissions;
            if (user) {
                permissions = yield this.userComponent.permissions(user.id);
                if (user.recycle) {
                    return false;
                }
                if (!user.status) {
                    permissions = [];
                }
            }
            else {
                permissions = [];
            }
            const classOr = Reflect.getMetadata(permission_controller_1.PERMISSION_CONTROLLER_OR, parent) || [];
            const classAnd = Reflect.getMetadata(permission_controller_1.PERMISSION_CONTROLLER_AND, parent) || [];
            const token = Reflect.getMetadata(exports.MODULE_TOKEN, parent);
            const classPass = this.checkPermission(permissions, classAnd, classOr, token);
            if (!classPass)
                return false;
            const methodOr = Reflect.getMetadata(permission_controller_1.PERMISSION_CONTROLLER_OR, handler) || [];
            const methodAnd = Reflect.getMetadata(permission_controller_1.PERMISSION_CONTROLLER_AND, handler) || [];
            const methodPass = this.checkPermission(permissions, methodAnd, methodOr, token);
            return methodPass;
        });
    }
    checkPermission(permissions, and, or, token) {
        for (let i = 0; i < and.length; i++) {
            const name = and[i];
            const find = permissions.find(per => {
                return per.name === name && per.moduleToken === token;
            });
            if (!find) {
                return false;
            }
        }
        for (let i = 0; i < or.length; i++) {
            const name = or[i];
            const find = permissions.find(per => {
                return per.name === name && per.moduleToken === token;
            });
            if (find) {
                break;
            }
            if (i === or.length - 1) {
                return false;
            }
        }
        return true;
    }
};
PermissionGuard = __decorate([
    common_1.Guard(),
    __param(0, common_1.Inject("UserComponentToken")),
    __metadata("design:paramtypes", [user_component_provider_1.UserComponent])
], PermissionGuard);
exports.PermissionGuard = PermissionGuard;

//# sourceMappingURL=permission.guard.js.map
