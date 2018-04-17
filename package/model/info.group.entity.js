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
let InfoGroup = class InfoGroup {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        name: "id",
        type: "integer"
    }),
    __metadata("design:type", Number)
], InfoGroup.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: "name",
        type: "varchar",
        length: "20",
        unique: true
    }),
    __metadata("design:type", String)
], InfoGroup.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: "default",
        type: "boolean"
    }),
    __metadata("design:type", Boolean)
], InfoGroup.prototype, "default", void 0);
__decorate([
    typeorm_1.Column({
        name: "status",
        type: "boolean"
    }),
    __metadata("design:type", Boolean)
], InfoGroup.prototype, "status", void 0);
__decorate([
    typeorm_1.ManyToMany(type => info_item_entity_1.InfoItem, infoItem => infoItem.groups, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinTable({
        name: "infogroup_infoitem"
    }),
    __metadata("design:type", Array)
], InfoGroup.prototype, "items", void 0);
InfoGroup = __decorate([
    typeorm_1.Entity("info_group")
], InfoGroup);
exports.InfoGroup = InfoGroup;
