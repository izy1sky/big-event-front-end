import { request } from '@/utils/requests.js'
export const articleCategoryService = () => {
    return request.get('/category')
}

export const articleCategoryAddService = (categoryModel) => {
    return request.post("/category", categoryModel)
}

export const articleCategoryUpdateService = (categoryModel) => {
    return request.put("/category", categoryModel)
}

export const articleCategoryDeleteService = (id) => {
    return request.delete('/category?id=' + id)
}

export const articleListService = (listCondition) => {
    return request.get('/article', { params: listCondition })
}

export const articleAddService = (articleModel) => {
    return request.post('/article', articleModel)
}

export const articleUpdateService = (articleModel) => {
    return request.put('/article', articleModel)
}

export const articleDeleteService = (id) => {
    return request.delete('/article?id=' + id)
}