import { request } from '@/utils/requests.js'

export const userRegisterService = (registerData) => {
    const params = new URLSearchParams()
    for (let key in registerData) {
        console.log(key, registerData[key]);
        params.append(key, registerData[key])
    }
    return request.post("/user/register", params)
}

export const userLoginService = function(registerData) {
    const params = new URLSearchParams()
    for (let key in registerData) {
        console.log(key, registerData[key]);
        params.append(key, registerData[key])
    }
    return request.post('/user/login', params)
}

export const userInfoService = () => {
    return request.get('/user/userInfo')
}

export const userInfoUpdateService = (userInfoModel) => {
    return request.put('/user/update', userInfoModel)
}

export const userUpdateAvatarService = (imgUrl) => {
    const params = new URLSearchParams()
    params.append('avatarUrl', imgUrl)
    return request.patch('/user/updateAvatar', params)
}

export const userResetPasswordService = (resetPasswordModel) => {
    return request.patch('/user/updatePwd', resetPasswordModel)
}