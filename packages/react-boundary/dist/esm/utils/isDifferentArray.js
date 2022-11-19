const isDifferentArray = (a = [], b = []) => a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
export default isDifferentArray;
//# sourceMappingURL=isDifferentArray.js.map