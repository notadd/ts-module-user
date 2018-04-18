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
const func_entity_1 = require("./func.entity");
const module_entity_1 = require("./module.entity");
const user_entity_1 = require("./user.entity");
let Role = class Role {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Role.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: "name",
        length: 20
    }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: "score",
    }),
    __metadata("design:type", Number)
], Role.prototype, "score", void 0);
__decorate([
    typeorm_1.ManyToMany(type => func_entity_1.Func, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: "role_func"
    }),
    __metadata("design:type", Array)
], Role.prototype, "funcs", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Role.prototype, "moduleToken", void 0);
__decorate([
    typeorm_1.ManyToOne(type => module_entity_1.Module, module => module.roles, {
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinColumn({
        name: "moduleToken",
        referencedColumnName: "token"
    }),
    __metadata("design:type", module_entity_1.Module)
], Role.prototype, "module", void 0);
__decorate([
    typeorm_1.ManyToMany(type => user_entity_1.User, user => user.roles, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Role.prototype, "users", void 0);
Role = __decorate([
    typeorm_1.Entity("role"),
    typeorm_1.Index("role_name_module_token", ["name", "moduleToken"])
], Role);
exports.Role = Role;
