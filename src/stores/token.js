//定义store
import { defineStore } from "pinia";
import { ref } from "vue";

// 第一个参数 状态的名字 唯一性
// 第二个参数 函数，返回定义状态的所有内容
export const useTokenStore = defineStore('token', () => {
    // 定义状态的内容
    const token = ref('')
    const setToken = (str) => {
        token.value = str
    }
    const removeToken = () => {
        token.value = ''
    }

    return {
        token, setToken, removeToken
    }
}, {
    persist: true
})