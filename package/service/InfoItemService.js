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
const InfoItem_entity_1 = require("../model/InfoItem.entity");
let InfoItemService = class InfoItemService {
    constructor(infoItemRepository) {
        this.infoItemRepository = infoItemRepository;
    }
    createInfoItem(name, label, description, type, necessary, registerVisible, informationVisible, order) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist = yield this.infoItemRepository.findOne({ name });
            if (exist) {
                throw new common_1.HttpException('指定名称信息项已存在：' + name, 412);
            }
            if (necessary && !registerVisible) {
                throw new common_1.HttpException('指定名称name=' + name + '必填信息项，注册时必须可见', 412);
            }
            let item = this.infoItemRepository.create({
                name,
                label,
                default: false,
                description,
                type,
                necessary,
                registerVisible,
                informationVisible,
                order
            });
            try {
                yield this.infoItemRepository.save(item);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    updateInfoItem(id, name, label, description, type, necessary, registerVisible, informationVisible, order) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist = yield this.infoItemRepository.findOneById(id);
            if (!exist) {
                throw new common_1.HttpException('指定id=' + id + '信息项不存在', 413);
            }
            if (exist.default) {
                throw new common_1.HttpException('默认信息项不允许更新', 413);
            }
            if (necessary && !registerVisible) {
                throw new common_1.HttpException('指定名称name=' + name + '必填信息项，注册时必须可见', 412);
            }
            if (name !== exist.name) {
                let exist1 = yield this.infoItemRepository.findOne({ name });
                if (exist1) {
                    throw new common_1.HttpException('指定name=' + name + '信息项已存在', 412);
                }
            }
            exist.name = name;
            exist.label = label;
            exist.description = description;
            exist.type = type;
            exist.necessary = necessary;
            exist.registerVisible = registerVisible;
            exist.informationVisible = informationVisible;
            exist.order = order;
            try {
                yield this.infoItemRepository.save(exist);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    deleteInfoItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let exist = yield this.infoItemRepository.findOneById(id);
            if (!exist) {
                throw new common_1.HttpException('指定id=' + id + '信息项不存在', 413);
            }
            if (exist.default) {
                throw new common_1.HttpException('默认信息项不允许删除', 413);
            }
            try {
                yield this.infoItemRepository.remove(exist);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
    deleteInfoItems(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let infoItems = yield this.infoItemRepository.findByIds(ids);
            ids.forEach(id => {
                let find = infoItems.find(item => {
                    return item.id === id;
                });
                if (!find) {
                    throw new common_1.HttpException('指定id=' + id + '信息项不存在', 413);
                }
                if (find.default) {
                    throw new common_1.HttpException('默认信息项不允许删除', 413);
                }
            });
            try {
                yield this.infoItemRepository.remove(infoItems);
            }
            catch (err) {
                throw new common_1.HttpException('数据库错误' + err.toString(), 401);
            }
        });
    }
};
InfoItemService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(InfoItem_entity_1.InfoItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InfoItemService);
exports.InfoItemService = InfoItemService;
