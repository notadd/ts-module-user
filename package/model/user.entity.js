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
const info_item_entity_1 = require("./info.item.entity");
const organization_entity_1 = require("./organization.entity");
const permission_entity_1 = require("./permission.entity");
const role_entity_1 = require("./role.entity");
const score_entity_1 = require("./score.entity");
const user_info_entity_1 = require("./user.info.entity");
let User = class User {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: "user_name",
        type: "varchar",
        length: "20",
        unique: true
    }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    typeorm_1.Column({
        name: "password",
        type: "varchar",
        length: 70
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({
        name: "salt",
        type: "varchar",
        length: 10
    }),
    __metadata("design:type", String)
], User.prototype, "salt", void 0);
__decorate([
    typeorm_1.Column({
        name: "status",
        type: "boolean"
    }),
    __metadata("design:type", Boolean)
], User.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({
        name: "recycle",
        type: "boolean"
    }),
    __metadata("design:type", Boolean)
], User.prototype, "recycle", void 0);
__decorate([
    typeorm_1.OneToMany(type => user_info_entity_1.UserInfo, userInfo => userInfo.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], User.prototype, "userInfos", void 0);
__decorate([
    typeorm_1.OneToMany(type => score_entity_1.Score, score => score.user, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], User.prototype, "scores", void 0);
__decorate([
    typeorm_1.ManyToMany(type => info_item_entity_1.InfoItem, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: "user_infoitem"
    }),
    __metadata("design:type", Array)
], User.prototype, "infoItems", void 0);
__decorate([
    typeorm_1.ManyToMany(type => permission_entity_1.Permission, permission => permission.addUsers, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: "user_adds_permission"
    }),
    __metadata("design:type", Array)
], User.prototype, "adds", void 0);
__decorate([
    typeorm_1.ManyToMany(type => permission_entity_1.Permission, permission => permission.reduceUsers, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: "user_reduces_permission"
    }),
    __metadata("design:type", Array)
], User.prototype, "reduces", void 0);
__decorate([
    typeorm_1.ManyToMany(type => role_entity_1.Role, role => role.users, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: "user_role"
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    typeorm_1.ManyToMany(type => organization_entity_1.Organization, organization => organization.users, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: "organization_user"
    }),
    __metadata("design:type", Array)
], User.prototype, "organizations", void 0);
User = __decorate([
    typeorm_1.Entity("user")
], User);
exports.User = User;
