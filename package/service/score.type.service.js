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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const score_type_entity_1 = require("../model/score.type.entity");
let ScoreTypeService = class ScoreTypeService {
    constructor(scoreTypeRepository) {
        this.scoreTypeRepository = scoreTypeRepository;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.scoreTypeRepository.find();
        });
    }
    createScoreType(name, type, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.scoreTypeRepository.findOne({ name });
            if (exist) {
                throw new common_1.HttpException(`指定名称name=${name}积分类型已存在`, 424);
            }
            const scoreType = this.scoreTypeRepository.create({ name, type, default: false, description });
            try {
                yield this.scoreTypeRepository.save(scoreType);
            }
            catch (err) {
                throw new common_1.HttpException(`数据库错误：${err.toString()}`, 401);
            }
        });
    }
    updateScoreType(id, name, type, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const original = yield this.scoreTypeRepository.findOne(id);
            if (!original) {
                throw new common_1.HttpException(`指定id=${id}积分类型不存在`, 425);
            }
            if (original.default) {
                throw new common_1.HttpException("默认积分类型不允许更改", 426);
            }
            if (name !== original.name) {
                const exist = yield this.scoreTypeRepository.findOne({ name });
                if (exist) {
                    throw new common_1.HttpException(`指定名称name=${name}积分类型已存在`, 424);
                }
            }
            try {
                original.name = name;
                original.type = type;
                original.description = description;
                yield this.scoreTypeRepository.save(original);
            }
            catch (err) {
                throw new common_1.HttpException(`数据库错误：${err.toString()}`, 401);
            }
        });
    }
    deleteScoreType(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.scoreTypeRepository.findOne(id);
            if (!exist) {
                throw new common_1.HttpException(`指定id=${id}积分类型不存在`, 425);
            }
            if (exist.default) {
                throw new common_1.HttpException("默认积分类型不允许删除", 426);
            }
            try {
                yield this.scoreTypeRepository.remove(exist);
            }
            catch (err) {
                throw new common_1.HttpException(`数据库错误：${err.toString()}`, 401);
            }
        });
    }
    deleteScoreTypes(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.scoreTypeRepository.findByIds(ids);
            ids.forEach(id => {
                const find = exists.find(exist => {
                    return exist.id === id;
                });
                if (!find) {
                    throw new common_1.HttpException(`指定id=${id}积分类型不存在`, 425);
                }
                if (find.default) {
                    throw new common_1.HttpException("默认积分类型不允许删除", 426);
                }
            });
            try {
                yield this.scoreTypeRepository.remove(exists);
            }
            catch (err) {
                throw new common_1.HttpException(`数据库错误：${err.toString()}`, 401);
            }
        });
    }
};
ScoreTypeService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(score_type_entity_1.ScoreType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ScoreTypeService);
exports.ScoreTypeService = ScoreTypeService;

//# sourceMappingURL=score.type.service.js.map
