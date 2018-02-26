import { Component, Inject, HttpException } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { Func } from '../model/Func';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';


@Component()
export class FuncService {

    constructor(
        @Inject('UserPMModule.FuncRepository') private readonly funcRepository: Repository<Func>
    ) { }

}