const setItem=(key: string, value: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
    }
}
const getItem=(key: string) => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem(key) as string);
    }
    return null;
}
const removeItem=(key: string) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
}
export { setItem, getItem, removeItem };