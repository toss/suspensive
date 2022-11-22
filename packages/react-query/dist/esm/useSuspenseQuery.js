import { useQuery, } from '@tanstack/react-query';
export function useSuspenseQuery(queryKey, queryFn, options) {
    return useQuery(queryKey, queryFn, Object.assign(Object.assign({}, options), { suspense: true }));
}
//# sourceMappingURL=useSuspenseQuery.js.map