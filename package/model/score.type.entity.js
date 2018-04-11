"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var score_entity_1 = require("./score.entity");
/* 积分类型 */
var ScoreType = /** @class */ (function () {
    function ScoreType() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({
            name: "id",
            type: "integer"
        })
    ], ScoreType.prototype, "id");
    __decorate([
        typeorm_1.Column({
            name: "name",
            type: "varchar",
            length: "20",
            unique: true
        })
    ], ScoreType.prototype, "name");
    __decorate([
        typeorm_1.Column({
            name: "type",
            type: "varchar"
        })
    ], ScoreType.prototype, "type");
    __decorate([
        typeorm_1.Column({
            name: "default",
            type: "smallint"
        })
    ], ScoreType.prototype, "default");
    __decorate([
        typeorm_1.Column({
            name: "description",
            type: "varchar"
        })
    ], ScoreType.prototype, "description");
    __decorate([
        typeorm_1.OneToMany(function (type) { return score_entity_1.Score; }, function (score) { return score.scoreType; }, {
            cascadeInsert: true,
            cascadeUpdate: false,
            lazy: false,
            eager: false
        })
    ], ScoreType.prototype, "scores");
    ScoreType = __decorate([
        typeorm_1.Entity("score_type")
    ], ScoreType);
    return ScoreType;
}());
exports.ScoreType = ScoreType;
