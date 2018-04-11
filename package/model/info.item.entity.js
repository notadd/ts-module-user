"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var info_group_entity_1 = require("./info.group.entity");
var user_info_entity_1 = require("./user.info.entity");
/* 信息项实体，代表了用户需要额外填写的信息项
   信息项与信息组为多对多关系，这个关系只是为了方便调用
   信息项与用户也是多对多关系，这个关系是为了记录哪些信息已经被填写
*/
var InfoItem = /** @class */ (function () {
    function InfoItem() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({
            name: "id",
            type: "integer"
        })
    ], InfoItem.prototype, "id");
    __decorate([
        typeorm_1.Column({
            name: "name",
            type: "varchar",
            length: "20",
            unique: true
        })
    ], InfoItem.prototype, "name");
    __decorate([
        typeorm_1.Column({
            name: "label",
            type: "varchar",
            length: "20"
        })
    ], InfoItem.prototype, "label");
    __decorate([
        typeorm_1.Column({
            name: "default",
            type: "smallint"
        })
    ], InfoItem.prototype, "default");
    __decorate([
        typeorm_1.Column({
            name: "description",
            type: "varchar",
            length: "40"
        })
    ], InfoItem.prototype, "description");
    __decorate([
        typeorm_1.Column({
            name: "type",
            type: "varchar"
        })
    ], InfoItem.prototype, "type");
    __decorate([
        typeorm_1.Column({
            name: "necessary",
            type: "smallint"
        })
    ], InfoItem.prototype, "necessary");
    __decorate([
        typeorm_1.Column({
            name: "register_visible",
            type: "smallint"
        })
    ], InfoItem.prototype, "registerVisible");
    __decorate([
        typeorm_1.Column({
            name: "information_visible",
            type: "smallint"
        })
    ], InfoItem.prototype, "informationVisible");
    __decorate([
        typeorm_1.Column({
            name: "order",
            type: "integer"
        })
    ], InfoItem.prototype, "order");
    __decorate([
        typeorm_1.OneToMany(function (type) { return user_info_entity_1.UserInfo; }, function (userInfo) { return userInfo.infoItem; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        })
    ], InfoItem.prototype, "userInfos");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return info_group_entity_1.InfoGroup; }, function (infoGroup) { return infoGroup.items; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        })
    ], InfoItem.prototype, "groups");
    InfoItem = __decorate([
        typeorm_1.Entity("info_item")
    ], InfoItem);
    return InfoItem;
}());
exports.InfoItem = InfoItem;
