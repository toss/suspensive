"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isDifferentArray = (a = [], b = []) => a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
exports.default = isDifferentArray;
//# sourceMappingURL=isDifferentArray.js.map