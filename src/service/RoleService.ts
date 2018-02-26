import { Component, Inject, HttpException } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { Func } from '../model/Func';
import { Role } from '../model/Role';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
WS

@Component()
export class RoleService {

    constructor(
        @Inject('UserPMModule.FuncRepository') private readonly funcRepository: Repository<Func>,
        @Inject('UserPMModule.RoleRepository') private readonly roleRepository: Repository<Role>
    ) { }

}