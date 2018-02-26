import { Component, Inject, HttpException } from '@nestjs/common';
import { Permission } from '../model/Permission';
import { Module } from '../model/Module';
import { IncomingMessage } from 'http';
import { Role } from '../model/Role';
import { Func } from '../model/Func';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';


@Component()
export class ModuleService {

    constructor(
        @Inject('UserPMModule.ModuleRepository') private readonly moduleRepository: Repository<Module>
    ) { }

}