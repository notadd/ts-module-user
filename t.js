require('reflect-metadata')

class  User{

    some(){

    }
}   

let user = new User()
Reflect.defineMetadata('key','value',User)
console.log(Reflect.getMetadataKeys(User))
Reflect.defineMetadata('key1','value1',user,'some')
console.log(Reflect.getMetadataKeys(User))
console.log(Reflect.getMetadataKeys(user))
console.log(Reflect.getMetadataKeys(user.some))
console.log(Reflect.getMetadata('key1',user))
console.log(Reflect.getMetadata('key1',user.some))
console.log(Reflect.getMetadata('key1',user,'some'))

