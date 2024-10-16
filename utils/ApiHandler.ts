import axiosClient from "./AxiosClient"

class ApiHandler {
    Execute = async (
        url: string,
        data?: any,
        method?: 'get' | 'post' | 'put' | 'delete'
    ) => {
        return await axiosClient(`/users${url}`,{
            method: method ?? 'get',
            data
        })
    }   
}

export default new ApiHandler