import { useCallback, useState } from 'react';
export default function useResetKey() {
    const [resetKey, setResetKey] = useState(0);
    const reset = useCallback(() => setResetKey(prev => prev + 1), []);
    return { resetKey, reset };
}
//# sourceMappingURL=useResetKey.js.map