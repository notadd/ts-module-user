"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.PERMISSION_CONTROLLER_OR = "user:permission_controller_or";
exports.PERMISSION_CONTROLLER_AND = "user:permission_controller_and";
function Can(names, mode = "and") {
    return (target, key, descriptor) => {
        if (descriptor) {
            const orExist = Reflect.getMetadata(exports.PERMISSION_CONTROLLER_OR, descriptor.value) || [];
            const andExist = Reflect.getMetadata(exports.PERMISSION_CONTROLLER_AND, descriptor.value) || [];
            if (mode === "or") {
                Reflect.defineMetadata(exports.PERMISSION_CONTROLLER_OR, names.concat(orExist), descriptor.value);
            }
            else if (mode === "and") {
                Reflect.defineMetadata(exports.PERMISSION_CONTROLLER_AND, names.concat(andExist), descriptor.value);
            }
            else {
                throw new Error("mode参数不正确");
            }
            return descriptor;
        }
        const orExist = Reflect.getMetadata(exports.PERMISSION_CONTROLLER_OR, target) || [];
        const andExist = Reflect.getMetadata(exports.PERMISSION_CONTROLLER_AND, target) || [];
        if (mode === "or") {
            Reflect.defineMetadata(exports.PERMISSION_CONTROLLER_OR, names.concat(orExist), target);
        }
        else if (mode === "and") {
            Reflect.defineMetadata(exports.PERMISSION_CONTROLLER_AND, names.concat(andExist), target);
        }
        else {
            throw new Error("mode参数不正确");
        }
        return target;
    };
}
exports.Can = Can;

//# sourceMappingURL=can.decorator.js.map
