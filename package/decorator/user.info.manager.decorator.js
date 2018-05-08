"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.USER_INFO_MANAGER = "user:user_info_manager";
function UserInfoManager() {
    return (target) => {
        Reflect.defineMetadata(exports.USER_INFO_MANAGER, true, target);
        return target;
    };
}
exports.UserInfoManager = UserInfoManager;

//# sourceMappingURL=user.info.manager.decorator.js.map
