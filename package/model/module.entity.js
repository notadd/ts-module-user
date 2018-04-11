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
var permission_entity_1 = require("./permission.entity");
var role_entity_1 = require("./role.entity");
/* 模块实体，这个模块实体主要用于存储权限
   这个实体不提供写入接口，当用户中心模块启动时，扫描所有Module,获取其组件、控制器上的Permission定义
   然后将模块与其对应的权限存储到数据库，所有的权限只能由模块本身装饰器提供，因为权限是写死在代码里的
   当删除模块时也会删除其下所有权限
*/
var Module = /** @class */ (function () {
    function Module() {
    }
    __decorate([
        typeorm_1.PrimaryColumn({
            name: "token",
            type: "varchar",
            length: 100
        })
    ], Module.prototype, "token");
    __decorate([
        typeorm_1.OneToMany(function (type) { return permission_entity_1.Permission; }, function (permission) { return permission.module; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        })
    ], Module.prototype, "permissions");
    __decorate([
        typeorm_1.OneToMany(function (type) { return func_entity_1.Func; }, function (func) { return func.module; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        })
    ], Module.prototype, "funcs");
    __decorate([
        typeorm_1.OneToMany(function (type) { return role_entity_1.Role; }, function (role) { return role.module; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        })
    ], Module.prototype, "roles");
    Module = __decorate([
        typeorm_1.Entity("module")
    ], Module);
    return Module;
}());
exports.Module = Module;
