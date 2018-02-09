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
            synchronize:true,
            dropSchema:true,
            charset:'UTF8',
            entities: [
            ]
        })
    }
}