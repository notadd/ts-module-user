"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./user.entity");
/* 组织实体，组织可以互相包含，一个组织下可以包含多个组织，还可以包含多个用户
   组织完全与模块无关
*/
var Organization = /** @class */ (function () {
    function Organization() {
    }
    Organization_1 = Organization;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Organization.prototype, "id");
    __decorate([
        typeorm_1.Column({
            name: "name",
            type: "varchar",
            length: 20,
            unique: true
        })
    ], Organization.prototype, "name");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return user_entity_1.User; }, function (user) { return user.organizations; }, {
            cascadeInsert: true,
            cascadeUpdate: true,
            lazy: false,
            eager: false
        })
    ], Organization.prototype, "users");
    __decorate([
        typeorm_1.Column({
            name: "parentId",
            type: "integer",
            nullable: true
        })
    ], Organization.prototype, "parentId");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Organization_1; }, function (orientation) { return orientation.children; }, {
            cascadeInsert: true,
            cascadeUpdate: true,
            cascadeRemove: false,
            nullable: true,
            lazy: false,
            eager: false,
            onDelete: "CASCADE"
        }),
        typeorm_1.JoinColumn({
            name: "parentId",
            referencedColumnName: "id"
        })
    ], Organization.prototype, "parent");
    __decorate([
        typeorm_1.OneToMany(function (type) { return Organization_1; }, function (orientation) { return orientation.parent; }, {
            cascadeInsert: true,
            cascadeUpdate: true,
            lazy: false,
            eager: false
        })
    ], Organization.prototype, "children");
    Organization = Organization_1 = __decorate([
        typeorm_1.Entity("organization")
    ], Organization);
    return Organization;
    var Organization_1;
}());
exports.Organization = Organization;
