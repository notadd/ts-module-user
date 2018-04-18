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
const user_entity_1 = require("./user.entity");
let Organization = Organization_1 = class Organization {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Organization.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: "name",
        length: 20,
        unique: true
    }),
    __metadata("design:type", String)
], Organization.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToMany(type => user_entity_1.User, user => user.organizations, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Organization.prototype, "users", void 0);
__decorate([
    typeorm_1.Column({
        name: "parentId",
        nullable: true
    }),
    __metadata("design:type", Number)
], Organization.prototype, "parentId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Organization_1, orientation => orientation.children, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: false,
        nullable: true,
        lazy: false,
        eager: false,
        onDelete: "CASCADE"
    }),
    typeorm_1.JoinColumn({
        name: "parentId",
        referencedColumnName: "id"
    }),
    __metadata("design:type", Organization)
], Organization.prototype, "parent", void 0);
__decorate([
    typeorm_1.OneToMany(type => Organization_1, orientation => orientation.parent, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Organization.prototype, "children", void 0);
Organization = Organization_1 = __decorate([
    typeorm_1.Entity("organization")
], Organization);
exports.Organization = Organization;
var Organization_1;
