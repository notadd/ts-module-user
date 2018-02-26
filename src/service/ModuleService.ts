import { Component, Inject, HttpException } from '@nestjs/common';
import { Module } from '../model/Module';
import { IncomingMessage } from 'http';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';


@Component()
export class ModuleService {

    constructor(
        @Inject('UserPMModule.ModuleRepository') private readonly moduleRepository: Repository<Module>
    ) { }

    async getAll(): Promise<Module[]> {
        return await this.moduleRepository.find({ relations: ['roles', 'funcs', 'permissions'] })
    }

}