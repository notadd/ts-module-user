import { Component, Inject } from '@nestjs/common';
import { InfoGroup } from '../model/InfoGroup';
import { InfoItem } from '../model/InfoItem';
import { IncomingMessage } from 'http';
import { User } from '../model/User';
import * as crypto from 'crypto';


@Component()
export class InfoGroupService {

    constructor(
        @Inject('UserPMModule.InfoItemRepository') private readonly infoItemRepository: Repository<InfoItem>,
        @Inject('UserPMModule.InfoIGroupRepository') private readonly infoGroupRepository: Repository<InfoGroup>
    ) { }

}

