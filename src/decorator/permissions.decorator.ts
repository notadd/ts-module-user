import "reflect-metadata";

export const PERMISSION_DEFINITION = "user:permission_definition";

export function Permissions(definitions: Array<{ name: string, description: string }>): ClassDecorator & MethodDecorator {
    return (target: any, key?, descriptor?) => {
        if (descriptor) {
            const exist = Reflect.getMetadata(PERMISSION_DEFINITION, target, key) || [];
            Reflect.defineMetadata(PERMISSION_DEFINITION, definitions.concat(exist), target, key);
            return descriptor;
        }
        const exist = Reflect.getMetadata(PERMISSION_DEFINITION, target) || [];
        Reflect.defineMetadata(PERMISSION_DEFINITION, definitions.concat(exist), target);
        return target;
    };
}
