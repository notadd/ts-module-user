import { Injectable, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ScoreType } from "../model/score.type.entity";

@Injectable()
export class ScoreTypeService {

    constructor(
        @InjectRepository(ScoreType) private readonly scoreTypeRepository: Repository<ScoreType>
    ) {
    }

    async getAll(): Promise<Array<ScoreType>> {
        return this.scoreTypeRepository.find();
    }

    async createScoreType(name: string, type: string, description: string): Promise<void> {
        const exist: ScoreType|undefined = await this.scoreTypeRepository.findOne({ name });
        if (exist) {
            throw new HttpException("指定名称name=" + name + "积分类型已存在", 424);
        }
        // 方法中创建的积分项都是非默认的
        const scoreType: ScoreType|undefined = this.scoreTypeRepository.create({ name, type, default: false, description });
        try {
            await this.scoreTypeRepository.save(scoreType);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async updateScoreType(id: number, name: string, type: string, description: string): Promise<void> {
        const original: ScoreType|undefined = await this.scoreTypeRepository.findOne(id);
        if (!original) {
            throw new HttpException("指定id=" + id + "积分类型不存在", 425);
        }
        if (original.default) {
            throw new HttpException("默认积分类型不允许更改", 426);
        }
        if (name !== original.name) {
            const exist: ScoreType|undefined = await this.scoreTypeRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定名称name=" + name + "积分类型已存在", 424);
            }
        }
        try {
            original.name = name;
            original.type = type;
            original.description = description;
            await this.scoreTypeRepository.save(original);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async deleteScoreType(id: number): Promise<void> {
        const exist: ScoreType|undefined = await this.scoreTypeRepository.findOne(id);
        if (!exist) {
            throw new HttpException("指定id=" + id + "积分类型不存在", 425);
        }
        if (exist.default) {
            throw new HttpException("默认积分类型不允许删除", 426);
        }
        try {
            await this.scoreTypeRepository.remove(exist);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }

    async deleteScoreTypes(ids: Array<number>): Promise<void> {
        const exists: Array<ScoreType> = await this.scoreTypeRepository.findByIds(ids);
        ids.forEach(id => {
            const find: ScoreType|undefined = exists.find(exist => {
                return exist.id === id;
            });
            if (!find) {
                throw new HttpException("指定id=" + id + "积分类型不存在", 425);
            }
            if (find.default) {
                throw new HttpException("默认积分类型不允许删除", 426);
            }
        });
        try {
            await this.scoreTypeRepository.remove(exists);
        } catch (err) {
            throw new HttpException("数据库错误" + err.toString(), 401);
        }
    }
}
