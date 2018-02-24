import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent,getRepository } from 'typeorm'  
import { Organization } from '../model/Organization'  
  
/* 组织的订阅器，用来在删除组织之前，解除组织下所有用户的关系，如果不是以触发器形式实现，则还要修改 */
@EventSubscriber()  
export class OrganizationSubscriber implements EntitySubscriberInterface<Organization> {  
  
    listenTo() {  
        return Organization;  
    }  
  
    async beforeRemove(event: RemoveEvent<Organization>): Promise<void>{  
        let o:Organization = await getRepository(Organization).findOneById(event.entityId,{relations:['users']})
        o.users = []
        await getRepository(Organization).save(o) 
    }  
}  