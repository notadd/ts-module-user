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
var user_entity_1 = require("./user.entity");
/* 用户信息实体类，这里填的信息是用户现有信息之外的信息
*/
var UserInfo = /** @class */ (function () {
    function UserInfo() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], UserInfo.prototype, "id");
    __decorate([
        typeorm_1.Column({
            name: "value",
            type: "varchar",
            length: "120"
        })
    ], UserInfo.prototype, "value");
    __decorate([
        typeorm_1.Column({
            nullable: true
        })
    ], UserInfo.prototype, "userId");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return user_entity_1.User; }, function (user) { return user.userInfos; }, {
            cascadeInsert: false,
            cascadeUpdate: false,
            cascadeRemove: false,
            nullable: true,
            onDelete: "CASCADE",
            lazy: false,
            eager: false
        }),
        typeorm_1.JoinColumn({
            name: "userId",
            referencedColumnName: "id"
        })
    ], UserInfo.prototype, "user");
    __decorate([
        typeorm_1.Column({
            nullable: true
        })
    ], UserInfo.prototype, "infoItemId");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return info_item_entity_1.InfoItem; }, function (infoItem) { return infoItem.userInfos; }, {
            cascadeInsert: false,
            cascadeUpdate: false,
            cascadeRemove: false,
            nullable: true,
            onDelete: "CASCADE",
            lazy: false,
            eager: false
        }),
        typeorm_1.JoinColumn({
            name: "infoItemId",
            referencedColumnName: "id"
        })
    ], UserInfo.prototype, "infoItem");
    UserInfo = __decorate([
        typeorm_1.Entity("user_info"),
        typeorm_1.Index("infoItemId_userId", ["infoItemId", "userId"])
    ], UserInfo);
    return UserInfo;
}());
exports.UserInfo = UserInfo;
