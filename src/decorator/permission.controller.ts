import "reflect-metadata";

export const PERMISSION_CONTROLLER_OR = "userpm:permission_controller_or";
export const PERMISSION_CONTROLLER_AND = "userpm:permission_controller_and";

export function PermissionController(names: Array<string>, mode: "or" | "and" = "and") {
    return (target: object, key?, descriptor?) => {
        if (descriptor) {
            const or_exist: Array<string> = Reflect.getMetadata(PERMISSION_CONTROLLER_OR, descriptor.value) || [];
            const and_exist: Array<string> = Reflect.getMetadata(PERMISSION_CONTROLLER_AND, descriptor.value) || [];
            if (mode === "or") {
                Reflect.defineMetadata(PERMISSION_CONTROLLER_OR, names.concat(or_exist), descriptor.value);
            } else if (mode === "and") {
                Reflect.defineMetadata(PERMISSION_CONTROLLER_AND, names.concat(and_exist), descriptor.value);
            } else {
                throw new Error("mode参数不正确");
            }
            return descriptor;
        }
        const or_exist: Array<string> = Reflect.getMetadata(PERMISSION_CONTROLLER_OR, target) || [];
        const and_exist: Array<string> = Reflect.getMetadata(PERMISSION_CONTROLLER_AND, target) || [];
        if (mode === "or") {
            Reflect.defineMetadata(PERMISSION_CONTROLLER_OR, names.concat(or_exist), target);
        } else if (mode === "and") {
            Reflect.defineMetadata(PERMISSION_CONTROLLER_AND, names.concat(and_exist), target);
        } else {
            throw new Error("mode参数不正确");
        }
        return target;
    };
}
