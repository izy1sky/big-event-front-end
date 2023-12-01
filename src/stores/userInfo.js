import { defineStore } from "pinia"
import { ref } from "vue"
const useUserInfoStore = defineStore('userInfo', () => {
    //定义状态相关的内容
    const userInfo = ref({})
    const setUserInfo = (newInfo) => {
        userInfo.value = newInfo
    }
    const removeUserInfo = () => {
        userInfo.value = {}
    }

    return {
        userInfo, setUserInfo, removeUserInfo
    }
}, {
    persist: true
})

export default useUserInfoStore