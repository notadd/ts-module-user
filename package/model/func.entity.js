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
const module_entity_1 = require("./module.entity");
const permission_entity_1 = require("./permission.entity");
let Func = class Func {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Func.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: "name",
        type: "varchar",
        length: 20
    }),
    __metadata("design:type", String)
], Func.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToMany(type => permission_entity_1.Permission, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: "function_permission",
    }),
    __metadata("design:type", Array)
], Func.prototype, "permissions", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Func.prototype, "moduleToken", void 0);
__decorate([
    typeorm_1.ManyToOne(type => module_entity_1.Module, module => module.funcs, {
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
], Func.prototype, "module", void 0);
Func = __decorate([
    typeorm_1.Entity("function"),
    typeorm_1.Index("func_name_module_token", ["name", "moduleToken"])
], Func);
exports.Func = Func;
