"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const errorSource = [
        {
            path: err === null || err === void 0 ? void 0 : err.path,
            message: err.message,
        },
    ];
    const statusCode = 500;
    return {
        statusCode,
        message: "Invalid ID",
        errorSource: errorSource,
    };
};
exports.default = handleCastError;
