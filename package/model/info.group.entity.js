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
/* 信息组，包含多个信息项
   目前信息组不属于任何模块，会写入一些默认信息组，由不同模块根据id调用信息组，一个模块可能会调用多个信息组
   模块在什么时候调用信息组，还是未知
   所谓信息组只是信息的分组，不代表其他东西，用户只会保存已经填写的信息项，以及相应的信息
   信息组只是为了方便调用多个信息项
*/
var InfoGroup = /** @class */ (function () {
    function InfoGroup() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({
            name: "id",
            type: "integer"
        })
    ], InfoGroup.prototype, "id");
    __decorate([
        typeorm_1.Column({
            name: "name",
            type: "varchar",
            length: "20",
            unique: true
        })
    ], InfoGroup.prototype, "name");
    __decorate([
        typeorm_1.Column({
            name: "default",
            type: "smallint"
        })
    ], InfoGroup.prototype, "default");
    __decorate([
        typeorm_1.Column({
            name: "status",
            type: "smallint"
        })
    ], InfoGroup.prototype, "status");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return info_item_entity_1.InfoItem; }, function (infoItem) { return infoItem.groups; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        }),
        typeorm_1.JoinTable({
            name: "infogroup_infoitem"
        })
    ], InfoGroup.prototype, "items");
    InfoGroup = __decorate([
        typeorm_1.Entity("info_group")
    ], InfoGroup);
    return InfoGroup;
}());
exports.InfoGroup = InfoGroup;
