import { Organization } from '../../src/model/Organization';
import { Permission } from '../../src/model/Permission';
import { InfoGroup } from '../../src/model/InfoGroup';
import { ScoreType } from '../../src/model/ScoreType';
import { InfoItem } from '../../src/model/InfoItem';
import { UserInfo } from '../../src/model/UserInfo';
import { Module } from '../../src/model/Module';
import { Score } from '../../src/model/Score';
import { User } from '../../src/model/User';
import { Role } from '../../src/model/Role';
import { Func } from '../../src/model/Func';
import { createConnection } from 'typeorm';

export const TestConnectionProvider = {
    provide:'UserPMModule.Connection',
    useFactory:async ()=>{
        return await createConnection({
            name:'user_pm_test',
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '123456',
            database: "test",
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
            synchronize:true,
            dropSchema:true
        })
    }
}