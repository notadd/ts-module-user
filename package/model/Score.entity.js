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
const ScoreType_entity_1 = require("./ScoreType.entity");
const User_entity_1 = require("./User.entity");
let Score = class Score {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        name: 'id',
        type: 'integer'
    }),
    __metadata("design:type", Number)
], Score.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'value',
        type: 'decimal',
        precision: 14,
        scale: 6
    }),
    __metadata("design:type", Number)
], Score.prototype, "value", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Score.prototype, "scoreTypeId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ScoreType_entity_1.ScoreType, scoreType => scoreType.scores, {
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: 'CASCADE',
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinColumn({
        name: 'scoreTypeId',
        referencedColumnName: 'id'
    }),
    __metadata("design:type", ScoreType_entity_1.ScoreType)
], Score.prototype, "scoreType", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Score.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_entity_1.User, user => user.scores, {
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: 'CASCADE',
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinColumn({
        name: 'userId',
        referencedColumnName: 'id'
    }),
    __metadata("design:type", User_entity_1.User)
], Score.prototype, "user", void 0);
Score = __decorate([
    typeorm_1.Entity('score'),
    typeorm_1.Index('scoreTypeId_userId', ['scoreTypeId', 'userId'])
], Score);
exports.Score = Score;
