"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var module_entity_1 = require("./module.entity");
var permission_entity_1 = require("./permission.entity");
/* 功能实体，功能是权限的集合
   功能与权限是多对多关系，但是功能是属于某个模块的，一个功能所包含的权限也都是同一个模块的
   模块删除时，其下包含的功能将会一起删除
*/
var Func = /** @class */ (function () {
    function Func() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Func.prototype, "id");
    __decorate([
        typeorm_1.Column({
            name: "name",
            type: "varchar",
            length: 20
        })
    ], Func.prototype, "name");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return permission_entity_1.Permission; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        }),
        typeorm_1.JoinTable({
            name: "function_permission"
        })
    ], Func.prototype, "permissions");
    __decorate([
        typeorm_1.Column()
    ], Func.prototype, "moduleToken");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return module_entity_1.Module; }, function (module) { return module.funcs; }, {
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
    ], Func.prototype, "module");
    Func = __decorate([
        typeorm_1.Entity("function"),
        typeorm_1.Index("func_name_module_token", ["name", "moduleToken"])
    ], Func);
    return Func;
}());
exports.Func = Func;
