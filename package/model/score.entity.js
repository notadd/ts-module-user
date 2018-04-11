"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var score_type_entity_1 = require("./score.type.entity");
var user_entity_1 = require("./user.entity");
/* 积分值，属于用户 */
var Score = /** @class */ (function () {
    function Score() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({
            name: "id",
            type: "integer"
        })
    ], Score.prototype, "id");
    __decorate([
        typeorm_1.Column({
            name: "value",
            type: "decimal",
            precision: 14,
            scale: 6
        })
    ], Score.prototype, "value");
    __decorate([
        typeorm_1.Column()
    ], Score.prototype, "scoreTypeId");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return score_type_entity_1.ScoreType; }, function (scoreType) { return scoreType.scores; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            cascadeRemove: false,
            onDelete: "CASCADE",
            lazy: false,
            eager: false
        }),
        typeorm_1.JoinColumn({
            name: "scoreTypeId",
            referencedColumnName: "id"
        })
    ], Score.prototype, "scoreType");
    __decorate([
        typeorm_1.Column()
    ], Score.prototype, "userId");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return user_entity_1.User; }, function (user) { return user.scores; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            cascadeRemove: false,
            onDelete: "CASCADE",
            lazy: false,
            eager: false
        }),
        typeorm_1.JoinColumn({
            name: "userId",
            referencedColumnName: "id"
        })
    ], Score.prototype, "user");
    Score = __decorate([
        typeorm_1.Entity("score"),
        typeorm_1.Index("scoreTypeId_userId", ["scoreTypeId", "userId"])
    ], Score);
    return Score;
}());
exports.Score = Score;
