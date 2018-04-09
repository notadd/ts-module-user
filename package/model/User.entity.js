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
const InfoItem_entity_1 = require("./InfoItem.entity");
const Organization_entity_1 = require("./Organization.entity");
const Permission_entity_1 = require("./Permission.entity");
const Role_entity_1 = require("./Role.entity");
const Score_entity_1 = require("./Score.entity");
const UserInfo_entity_1 = require("./UserInfo.entity");
let User = class User {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'user_name',
        type: 'varchar',
        length: '20',
        unique: true
    }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    typeorm_1.Column({
        name: 'password',
        type: 'varchar',
        length: 40
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({
        name: 'salt',
        type: 'varchar',
        length: 10
    }),
    __metadata("design:type", String)
], User.prototype, "salt", void 0);
__decorate([
    typeorm_1.Column({
        name: 'status',
        type: 'smallint'
    }),
    __metadata("design:type", Boolean)
], User.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({
        name: 'recycle',
        type: 'smallint'
    }),
    __metadata("design:type", Boolean)
], User.prototype, "recycle", void 0);
__decorate([
    typeorm_1.OneToMany(type => UserInfo_entity_1.UserInfo, userInfo => userInfo.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], User.prototype, "userInfos", void 0);
__decorate([
    typeorm_1.OneToMany(type => Score_entity_1.Score, score => score.user, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], User.prototype, "scores", void 0);
__decorate([
    typeorm_1.ManyToMany(type => InfoItem_entity_1.InfoItem, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: 'user_infoitem'
    }),
    __metadata("design:type", Array)
], User.prototype, "infoItems", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Permission_entity_1.Permission, permission => permission.addUsers, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: 'user_adds_permission'
    }),
    __metadata("design:type", Array)
], User.prototype, "adds", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Permission_entity_1.Permission, permission => permission.reduceUsers, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: 'user_reduces_permission'
    }),
    __metadata("design:type", Array)
], User.prototype, "reduces", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Role_entity_1.Role, role => role.users, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: 'user_role'
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Organization_entity_1.Organization, organization => organization.users, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: 'organization_user'
    }),
    __metadata("design:type", Array)
], User.prototype, "organizations", void 0);
User = __decorate([
    typeorm_1.Entity('user')
], User);
exports.User = User;