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
const Score_entity_1 = require("./Score.entity");
let ScoreType = class ScoreType {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        name: 'id',
        type: 'integer'
    }),
    __metadata("design:type", Number)
], ScoreType.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'name',
        type: 'varchar',
        length: '20',
        unique: true
    }),
    __metadata("design:type", String)
], ScoreType.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: 'type',
        type: 'varchar',
    }),
    __metadata("design:type", String)
], ScoreType.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({
        name: 'default',
        type: 'smallint'
    }),
    __metadata("design:type", Boolean)
], ScoreType.prototype, "default", void 0);
__decorate([
    typeorm_1.Column({
        name: 'description',
        type: 'varchar'
    }),
    __metadata("design:type", String)
], ScoreType.prototype, "description", void 0);
__decorate([
    typeorm_1.OneToMany(type => Score_entity_1.Score, score => score.scoreType, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], ScoreType.prototype, "scores", void 0);
ScoreType = __decorate([
    typeorm_1.Entity('score_type')
], ScoreType);
exports.ScoreType = ScoreType;
