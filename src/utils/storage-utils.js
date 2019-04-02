
const USER_KEY = 'user'; 

export function setItem(value) {
    if (!value || typeof value === 'function') {
        console.log('保存用户数据失败',value)
        return;
    }
    localStorage.setItem(USER_KEY, JSON.stringify(value) )
}

export function getItem() {
    const user = localStorage.getItem(USER_KEY);
    if(!user) return ''
    return JSON.parse(user);
}

export function removeItem() {
    localStorage.removeItem(USER_KEY)
}