import { useCallback, useState } from 'react';
const useResetKey = () => {
    const [resetKey, setResetKey] = useState({});
    const reset = useCallback(() => setResetKey(prev => (Object.assign({}, prev))), []);
    return { resetKey, reset };
};
export default useResetKey;
//# sourceMappingURL=useResetKey.js.map