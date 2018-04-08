import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from '../model/Module.entity';

@Component()
export class ModuleService {

    constructor(
        @InjectRepository(Module) private readonly moduleRepository: Repository<Module>
    ) {
    }

    async getAll(): Promise<Module[]> {
        return await this.moduleRepository.find({ relations: [ 'roles', 'funcs', 'permissions' ] })
    }

}
