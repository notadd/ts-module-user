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
const info_group_entity_1 = require("./info.group.entity");
const user_info_entity_1 = require("./user.info.entity");
let InfoItem = class InfoItem {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], InfoItem.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: "name",
        length: 100,
        unique: true
    }),
    __metadata("design:type", String)
], InfoItem.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: "label",
        length: 100
    }),
    __metadata("design:type", String)
], InfoItem.prototype, "label", void 0);
__decorate([
    typeorm_1.Column({
        name: "default",
    }),
    __metadata("design:type", Boolean)
], InfoItem.prototype, "default", void 0);
__decorate([
    typeorm_1.Column({
        name: "description",
        length: 200
    }),
    __metadata("design:type", String)
], InfoItem.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        name: "type",
        length: 100
    }),
    __metadata("design:type", String)
], InfoItem.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({
        name: "necessary",
    }),
    __metadata("design:type", Boolean)
], InfoItem.prototype, "necessary", void 0);
__decorate([
    typeorm_1.Column({
        name: "register_visible",
    }),
    __metadata("design:type", Boolean)
], InfoItem.prototype, "registerVisible", void 0);
__decorate([
    typeorm_1.Column({
        name: "information_visible",
    }),
    __metadata("design:type", Boolean)
], InfoItem.prototype, "informationVisible", void 0);
__decorate([
    typeorm_1.Column({
        name: "order",
    }),
    __metadata("design:type", Number)
], InfoItem.prototype, "order", void 0);
__decorate([
    typeorm_1.OneToMany(type => user_info_entity_1.UserInfo, userInfo => userInfo.infoItem, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], InfoItem.prototype, "userInfos", void 0);
__decorate([
    typeorm_1.ManyToMany(type => info_group_entity_1.InfoGroup, infoGroup => infoGroup.items, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], InfoItem.prototype, "groups", void 0);
InfoItem = __decorate([
    typeorm_1.Entity("info_item")
], InfoItem);
exports.InfoItem = InfoItem;
