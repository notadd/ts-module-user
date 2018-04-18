import "reflect-metadata";

export const PERMISSION_CONTROLLER_OR = "user:permission_controller_or";
export const PERMISSION_CONTROLLER_AND = "user:permission_controller_and";

export function Can(names: Array<string>, mode: "or" | "and" = "and") {
    return (target: object, key?, descriptor?) => {
        if (descriptor) {
            const orExist: Array<string> = Reflect.getMetadata(PERMISSION_CONTROLLER_OR, descriptor.value) || [];
            const andExist: Array<string> = Reflect.getMetadata(PERMISSION_CONTROLLER_AND, descriptor.value) || [];
            if (mode === "or") {
                Reflect.defineMetadata(PERMISSION_CONTROLLER_OR, names.concat(orExist), descriptor.value);
            } else if (mode === "and") {
                Reflect.defineMetadata(PERMISSION_CONTROLLER_AND, names.concat(andExist), descriptor.value);
            } else {
                throw new Error("mode参数不正确");
            }
            return descriptor;
        }
        const orExist: Array<string> = Reflect.getMetadata(PERMISSION_CONTROLLER_OR, target) || [];
        const andExist: Array<string> = Reflect.getMetadata(PERMISSION_CONTROLLER_AND, target) || [];
        if (mode === "or") {
            Reflect.defineMetadata(PERMISSION_CONTROLLER_OR, names.concat(orExist), target);
        } else if (mode === "and") {
            Reflect.defineMetadata(PERMISSION_CONTROLLER_AND, names.concat(andExist), target);
        } else {
            throw new Error("mode参数不正确");
        }
        return target;
    };
}
