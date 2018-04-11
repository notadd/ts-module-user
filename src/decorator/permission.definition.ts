import "reflect-metadata";

export const PERMISSION_DEFINITION = "userpm:permission_definition";

export function PermissionDefinition(definitions: Array<{ name: string, description: string }>) {
    return (target: object, key?, descriptor?) => {
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
