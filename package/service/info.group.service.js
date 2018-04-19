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
const info_group_entity_1 = require("../model/info.group.entity");
const info_item_entity_1 = require("../model/info.item.entity");
let InfoGroupService = class InfoGroupService {
    constructor(infoItemRepository, infoGroupRepository) {
        this.infoItemRepository = infoItemRepository;
        this.infoGroupRepository = infoGroupRepository;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.infoGroupRepository.find();
        });
    }
    getInfoItems(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoGroup = yield this.infoGroupRepository.findOneById(id, { relations: ["items"] });
            return infoGroup ? infoGroup.items : undefined;
        });
    }
    createInfoGroup(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.infoGroupRepository.findOne({ name });
            if (exist) {
                throw new common_1.HttpException("给定名称name=" + name + "信息组已存在", 407);
            }
            const infoGroup = this.infoGroupRepository.create({ name, default: false, status: true });
            try {
                yield this.infoGroupRepository.save(infoGroup);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    updateInfoGroup(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.infoGroupRepository.findOneById(id);
            if (!exist) {
                throw new common_1.HttpException("给定id=" + id + "信息组不存在", 408);
            }
            if (exist.default) {
                throw new common_1.HttpException("默认信息组不可更改", 408);
            }
            if (name !== exist.name) {
                const exist1 = yield this.infoGroupRepository.findOne({ name });
                if (exist1) {
                    throw new common_1.HttpException("指定名称信息组已存在：" + name, 408);
                }
            }
            try {
                exist.name = name;
                yield this.infoGroupRepository.save(exist);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    deleteInfoGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.infoGroupRepository.findOneById(id);
            if (!exist) {
                throw new common_1.HttpException("给定id=" + id + "信息组不存在", 408);
            }
            if (exist.default) {
                throw new common_1.HttpException("默认信息组不可删除", 408);
            }
            try {
                yield this.infoGroupRepository.remove(exist);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    addInfoItem(id, infoItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.infoGroupRepository.findOneById(id, { relations: ["items"] });
            if (!group) {
                throw new common_1.HttpException("给定id=" + id + "信息组不存在", 408);
            }
            if (group.default) {
                throw new common_1.HttpException("默认信息组不可更改", 408);
            }
            const item = yield this.infoItemRepository.findOneById(infoItemId);
            if (!item) {
                throw new common_1.HttpException("指定id=" + infoItemId + "信息项不存在", 409);
            }
            if (item.default) {
                throw new common_1.HttpException("默认信息项不可添加", 408);
            }
            const find = group.items.find(item => {
                return item.id === id;
            });
            if (find) {
                throw new common_1.HttpException("指定信息项id=" + infoItemId + "已经存在于指定信息组id=" + id + "中", 410);
            }
            try {
                group.items.push(item);
                yield this.infoGroupRepository.save(group);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
    removeInfoItem(id, infoItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.infoGroupRepository.findOneById(id, { relations: ["items"] });
            if (!group) {
                throw new common_1.HttpException("给定id=" + id + "信息组不存在", 408);
            }
            if (group.default) {
                throw new common_1.HttpException("默认信息组不可更改", 408);
            }
            const item = yield this.infoItemRepository.findOneById(infoItemId);
            if (!item) {
                throw new common_1.HttpException("指定id=" + infoItemId + "信息项不存在", 409);
            }
            const index = group.items.findIndex(item => {
                return item.id === id;
            });
            if (index < 0) {
                throw new common_1.HttpException("指定信息项id=" + infoItemId + "不存在于指定信息组id=" + id + "中", 411);
            }
            try {
                group.items.splice(index, 1);
                yield this.infoGroupRepository.save(group);
            }
            catch (err) {
                throw new common_1.HttpException("数据库错误" + err.toString(), 401);
            }
        });
    }
};
InfoGroupService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(info_item_entity_1.InfoItem)),
    __param(1, typeorm_1.InjectRepository(info_group_entity_1.InfoGroup)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InfoGroupService);
exports.InfoGroupService = InfoGroupService;

//# sourceMappingURL=info.group.service.js.map
