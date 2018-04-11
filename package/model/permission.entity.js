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
var user_entity_1 = require("./user.entity");
/* 权限实体，代表了执行某种操作的权限，属于某个模块
   目前所有权限由模块中使用装饰器提供，找到权限之后保存它
   不能在后台添加权限，因为添加也没用，权限的使用是写死在代码里的
   同一个模块下权限名不能重复，不同模块下可以重复
   当删除模块时，所有权限也会删除
*/
var Permission = /** @class */ (function () {
    function Permission() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Permission.prototype, "id");
    __decorate([
        typeorm_1.Column({
            name: "name",
            type: "varchar",
            length: 20
        })
    ], Permission.prototype, "name");
    __decorate([
        typeorm_1.Column({
            name: "description",
            type: "varchar",
            length: "50"
        })
    ], Permission.prototype, "description");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return user_entity_1.User; }, function (user) { return user.adds; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        })
    ], Permission.prototype, "addUsers");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return user_entity_1.User; }, function (user) { return user.reduces; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        })
    ], Permission.prototype, "reduceUsers");
    __decorate([
        typeorm_1.Column()
    ], Permission.prototype, "moduleToken");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return module_entity_1.Module; }, function (module) { return module.permissions; }, {
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
    ], Permission.prototype, "module");
    Permission = __decorate([
        typeorm_1.Entity("permission"),
        typeorm_1.Index("name_module_token", ["name", "moduleToken"])
    ], Permission);
    return Permission;
}());
exports.Permission = Permission;
