"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var func_entity_1 = require("./func.entity");
var module_entity_1 = require("./module.entity");
var user_entity_1 = require("./user.entity");
/* 角色，一般由后台创建，一个角色包含多个功能，进而包含了功能下的权限，具有指定特定操作的权限
   角色不能跨模块，所以它只能包含属于同一个模块下的功能，当删除模块时，其所属角色也会删除
*/
var Role = /** @class */ (function () {
    function Role() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Role.prototype, "id");
    __decorate([
        typeorm_1.Column({
            name: "name",
            type: "varchar",
            length: 20
        })
    ], Role.prototype, "name");
    __decorate([
        typeorm_1.Column({
            name: "score",
            type: "integer"
        })
    ], Role.prototype, "score");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return func_entity_1.Func; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        }),
        typeorm_1.JoinTable({
            name: "role_func"
        })
    ], Role.prototype, "funcs");
    __decorate([
        typeorm_1.Column()
    ], Role.prototype, "moduleToken");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return module_entity_1.Module; }, function (module) { return module.roles; }, {
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
        })
    ], Role.prototype, "module");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return user_entity_1.User; }, function (user) { return user.roles; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        })
    ], Role.prototype, "users");
    Role = __decorate([
        typeorm_1.Entity("role"),
        typeorm_1.Index("role_name_module_token", ["name", "moduleToken"])
    ], Role);
    return Role;
}());
exports.Role = Role;
