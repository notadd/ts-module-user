"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var info_item_entity_1 = require("./info.item.entity");
var organization_entity_1 = require("./organization.entity");
var permission_entity_1 = require("./permission.entity");
var role_entity_1 = require("./role.entity");
var score_entity_1 = require("./score.entity");
var user_info_entity_1 = require("./user.info.entity");
/* 用户实体类，id自动生成、用户名必须唯一
   用户可以属于多个组织，也可以不属于组织，为自由用户
   用户拥有多个角色、进而拥有其下的权限
   用户还可以单独指定增加、减少的权限，用来对角色权限做补充
*/
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], User.prototype, "id");
    __decorate([
        typeorm_1.Column({
            name: "user_name",
            type: "varchar",
            length: "20",
            unique: true
        })
    ], User.prototype, "userName");
    __decorate([
        typeorm_1.Column({
            name: "password",
            type: "varchar",
            length: 40
        })
    ], User.prototype, "password");
    __decorate([
        typeorm_1.Column({
            name: "salt",
            type: "varchar",
            length: 10
        })
    ], User.prototype, "salt");
    __decorate([
        typeorm_1.Column({
            name: "status",
            type: "smallint"
        })
    ], User.prototype, "status");
    __decorate([
        typeorm_1.Column({
            name: "recycle",
            type: "smallint"
        })
    ], User.prototype, "recycle");
    __decorate([
        typeorm_1.OneToMany(function (type) { return user_info_entity_1.UserInfo; }, function (userInfo) { return userInfo.user; }, {
            cascadeInsert: true,
            cascadeUpdate: true,
            lazy: false,
            eager: false
        })
    ], User.prototype, "userInfos");
    __decorate([
        typeorm_1.OneToMany(function (type) { return score_entity_1.Score; }, function (score) { return score.user; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        })
    ], User.prototype, "scores");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return info_item_entity_1.InfoItem; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        }),
        typeorm_1.JoinTable({
            name: "user_infoitem"
        })
    ], User.prototype, "infoItems");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return permission_entity_1.Permission; }, function (permission) { return permission.addUsers; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        }),
        typeorm_1.JoinTable({
            name: "user_adds_permission"
        })
    ], User.prototype, "adds");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return permission_entity_1.Permission; }, function (permission) { return permission.reduceUsers; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        }),
        typeorm_1.JoinTable({
            name: "user_reduces_permission"
        })
    ], User.prototype, "reduces");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return role_entity_1.Role; }, function (role) { return role.users; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        }),
        typeorm_1.JoinTable({
            name: "user_role"
        })
    ], User.prototype, "roles");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return organization_entity_1.Organization; }, function (organization) { return organization.users; }, {
            cascadeInsert: true,
            cascadeUpdate: true,
            lazy: false,
            eager: false
        }),
        typeorm_1.JoinTable({
            name: "organization_user"
        })
    ], User.prototype, "organizations");
    User = __decorate([
        typeorm_1.Entity("user")
    ], User);
    return User;
}());
exports.User = User;
