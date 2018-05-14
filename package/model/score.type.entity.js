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
const score_entity_1 = require("./score.entity");
let ScoreType = class ScoreType {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        name: "id",
    }),
    __metadata("design:type", Number)
], ScoreType.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: "name",
        length: "20",
        unique: true
    }),
    __metadata("design:type", String)
], ScoreType.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: "type",
        length: "20"
    }),
    __metadata("design:type", String)
], ScoreType.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({
        name: "default",
    }),
    __metadata("design:type", Boolean)
], ScoreType.prototype, "default", void 0);
__decorate([
    typeorm_1.Column({
        name: "description",
        length: 50
    }),
    __metadata("design:type", String)
], ScoreType.prototype, "description", void 0);
__decorate([
    typeorm_1.OneToMany(type => score_entity_1.Score, score => score.scoreType, {
        cascade: ["insert"],
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], ScoreType.prototype, "scores", void 0);
ScoreType = __decorate([
    typeorm_1.Entity("score_type")
], ScoreType);
exports.ScoreType = ScoreType;

//# sourceMappingURL=score.type.entity.js.map
