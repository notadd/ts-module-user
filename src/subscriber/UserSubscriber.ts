import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent,getRepository } from 'typeorm'  
import { User } from '../model/User'  
  
/* 用户的订阅器，用来在删除用户之前，解除用户与组织的关系 */
@EventSubscriber()  
export class UserSubscriber implements EntitySubscriberInterface<User> {  
  
    listenTo() {  
        return User;  
    }  
  
    async beforeRemove(event: RemoveEvent<User>): Promise<void>{  
        let user:User = await getRepository(User).findOneById(event.entityId,{relations:['organizations']})
        user.organizations = []
        await getRepository(User).save(user) 
    }  
}  