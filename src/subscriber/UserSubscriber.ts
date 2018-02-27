import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent,getRepository } from 'typeorm'  
import { User } from '../model/User'  
  
/* 用户的订阅器，用来在删除用户之前，解除用户与组织的关系
    之前的测试中发现删除组织时，组织、用户关系会自动解除，删除用户时会报错，所以创建了这个订阅器
    后来又发现不会报错，删除用户可以直接删除，可能是使用了remove的缘故，暂时不管
*/
@EventSubscriber()  
export class UserSubscriber implements EntitySubscriberInterface<User> {  
  
    listenTo() {  
        return User;  
    }  
  
    async beforeRemove(event: RemoveEvent<User>): Promise<void>{  
        let user:User = await getRepository(User,'user_pm').findOneById(event.entityId,{relations:['organizations']})
        user.organizations = []
        await getRepository(User,'user_pm').save(user) 
    }  
}  