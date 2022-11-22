"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSuspenseQuery = void 0;
const react_query_1 = require("@tanstack/react-query");
function useSuspenseQuery(queryKey, queryFn, options) {
    return (0, react_query_1.useQuery)(queryKey, queryFn, Object.assign(Object.assign({}, options), { suspense: true }));
}
exports.useSuspenseQuery = useSuspenseQuery;
//# sourceMappingURL=useSuspenseQuery.js.map