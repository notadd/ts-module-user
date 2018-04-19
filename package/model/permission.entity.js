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
const module_entity_1 = require("./module.entity");
const user_entity_1 = require("./user.entity");
let Permission = class Permission {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Permission.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: "name",
        length: 20
    }),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: "description",
        length: "50"
    }),
    __metadata("design:type", String)
], Permission.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToMany(type => user_entity_1.User, user => user.adds, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Permission.prototype, "addUsers", void 0);
__decorate([
    typeorm_1.ManyToMany(type => user_entity_1.User, user => user.reduces, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: false,
        eager: false
    }),
    __metadata("design:type", Array)
], Permission.prototype, "reduceUsers", void 0);
__decorate([
    typeorm_1.Column({
        length: 100
    }),
    __metadata("design:type", String)
], Permission.prototype, "moduleToken", void 0);
__decorate([
    typeorm_1.ManyToOne(type => module_entity_1.Module, module => module.permissions, {
        cascadeInsert: true,
        cascadeUpdate: false,
        cascadeRemove: false,
        onDelete: "RESTRICT",
        nullable: false,
        lazy: false,
        eager: false
    }),
    typeorm_1.JoinColumn({
        name: "moduleToken",
        referencedColumnName: "token"
    }),
    __metadata("design:type", module_entity_1.Module)
], Permission.prototype, "module", void 0);
Permission = __decorate([
    typeorm_1.Entity("permission"),
    typeorm_1.Index("name_module_token", ["name", "moduleToken"])
], Permission);
exports.Permission = Permission;

//# sourceMappingURL=permission.entity.js.map
