"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const erroSource = [
        {
            path: "",
            message: `${err.errmsg} is already Exist`,
        },
    ];
    const statusCode = 500;
    return {
        statusCode,
        message: err === null || err === void 0 ? void 0 : err.message,
        erroSource: erroSource,
    };
};
exports.default = handleDuplicateError;
