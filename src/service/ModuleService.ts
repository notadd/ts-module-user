import { Component, Inject, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from '../model/Module.entity';
import { IncomingMessage } from 'http';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';


@Component()
export class ModuleService {

    constructor(
        @InjectRepository(Module) private readonly moduleRepository: Repository<Module>
    ) { }

    async getAll(): Promise<Module[]> {
        return await this.moduleRepository.find({ relations: ['roles', 'funcs', 'permissions'] })
    }

}