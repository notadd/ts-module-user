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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Func_entity_1 = require("./Func.entity");
const Permission_entity_1 = require("./Permission.entity");
const Role_entity_1 = require("./Role.entity");
let Module = class Module {
};
__decorate([
    typeorm_1.PrimaryColumn({
        name: 'token',
        type: 'varchar',
        length: 100
    }),
    __metadata("design:type", String)
], Module.prototype, "token", void 0);
__decorate([
    typeorm_1.OneToMany(type => Permission_entity_1.Permission, permission => permission.module, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Module.prototype, "permissions", void 0);
__decorate([
    typeorm_1.OneToMany(type => Func_entity_1.Func, func => func.module, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Module.prototype, "funcs", void 0);
__decorate([
    typeorm_1.OneToMany(type => Role_entity_1.Role, role => role.module, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Module.prototype, "roles", void 0);
Module = __decorate([
    typeorm_1.Entity('module')
], Module);
exports.Module = Module;
