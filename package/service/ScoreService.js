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
const Score_entity_1 = require("../model/Score.entity");
const ScoreType_entity_1 = require("../model/ScoreType.entity");
const User_entity_1 = require("../model/User.entity");
const FloatUtil_1 = require("../util/FloatUtil");
let ScoreService = class ScoreService {
    constructor(floatUtil, userRepository, scoreRepository, scoreTypeRepository) {
        this.floatUtil = floatUtil;
        this.userRepository = userRepository;
        this.scoreRepository = scoreRepository;
        this.scoreTypeRepository = scoreTypeRepository;
    }
    getScore(userId, scoreTypeId) {
        return __awaiter(this, void 0, void 0, function* () {
            let scoreType = yield this.scoreTypeRepository.findOneById(scoreTypeId);
            if (!scoreType) {
                throw new common_1.HttpException('指定id=' + scoreTypeId + '积分类型不存在', 427);
            }
            let user = yield this.userRepository.findOneById(userId, { relations: ['scores'] });
            if (!user) {
                throw new common_1.HttpException('指定id=' + userId + '用户不存在', 428);
            }
            let score = user.scores.find(score => {
                return score.scoreTypeId === scoreType.id;
            });
            if (score) {
                if (scoreType.type === 'int') {
                    return Number.parseInt(score.value + '');
                }
                else if (scoreType.type === 'float') {
                    return Number.parseFloat(score.value + '');
                }
            }
            else {
                let score = this.scoreRepository.create({ value: 0, scoreType, user });
                try {
                    yield this.scoreRepository.save(score);
                }
                catch (err) {
                    throw new common_1.HttpException('数据库错误' + err.toString(), 401);
                }
                return 0;
            }
        });
    }
    setScore(userId, scoreTypeId, add) {
        return __awaiter(this, void 0, void 0, function* () {
            let scoreType = yield this.scoreTypeRepository.findOneById(scoreTypeId);
            if (!scoreType) {
                throw new common_1.HttpException('指定id=' + scoreTypeId + '积分类型不存在', 427);
            }
            let user = yield this.userRepository.findOneById(userId, { relations: ['scores'] });
            if (!user) {
                throw new common_1.HttpException('指定id=' + userId + '用户不存在', 428);
            }
            let score = user.scores.find(score => {
                return score.scoreTypeId === scoreType.id;
            });
            if (score) {
                if (scoreType.type === 'int') {
                    score.value = Number.parseInt(score.value + '') + Number.parseInt(add + '');
                }
                else if (scoreType.type === 'float') {
                    score.value = yield this.floatUtil.add(score.value, add);
                }
            }
            else {
                score = this.scoreRepository.create({ scoreType, user });
                if (scoreType.type === 'int') {
                    score.value = Number.parseInt(add + '');
                }
                else if (scoreType.type === 'float') {
                    score.value = Number.parseFloat(add + '');
                }
            }
            try {
                yield this.scoreRepository.save(score);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
};
ScoreService = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject(FloatUtil_1.FloatUtil)),
    __param(1, typeorm_1.InjectRepository(User_entity_1.User)),
    __param(2, typeorm_1.InjectRepository(Score_entity_1.Score)),
    __param(3, typeorm_1.InjectRepository(ScoreType_entity_1.ScoreType)),
    __metadata("design:paramtypes", [FloatUtil_1.FloatUtil,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ScoreService);
exports.ScoreService = ScoreService;
