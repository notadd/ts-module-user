import { Organization } from '../model/Organization';
import { Permission } from '../model/Permission';
import { InfoGroup } from '../model/InfoGroup';
import { ScoreType } from '../model/ScoreType';
import { InfoItem } from '../model/InfoItem';
import { UserInfo } from '../model/UserInfo';
import { Module } from '../model/Module';
import { Score } from '../model/Score';
import { User } from '../model/User';
import { Role } from '../model/Role';
import { Func } from '../model/Func';

import { createConnection } from 'typeorm';

export const ConnectionProvider = {
    provide:'UserPMModule.Connection',
    useFactory:async ()=>{
        return await createConnection({
            name:'user_pm',
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '123456',
            database: "user_pm",
            charset:'UTF8',
            dateStrings:false,
            entities: [
                Organization,
                Permission,
                InfoGroup,
                ScoreType,
                InfoItem,
                UserInfo,
                Module,
                Score,
                User,
                Func,
                Role
            ],
            logger:'simple-console',
            logging:null,
            synchronize:false,
            dropSchema:false
        })
    }
}