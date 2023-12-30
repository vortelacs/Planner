import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";

const sleep = (delay: number) =>
{
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000';

axios.interceptors.response.use(response => {
    return sleep(1000).then(() => {
        return response;
    }).catch((error) => {
        console.log(error);
        return Promise.reject(error);
    })
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const request = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete(url).then<T>(responseBody),
}

const Activities = {
    list : () => request.get<Activity[]>('/Activities'),
    details : (id : string) => request.get<Activity>(`/Activities/${id}`),
    create : (activity : Activity) => request.post('/Activities', activity),
    update : (activity : Activity) => request.put(`/Activities/${activity.id}`, activity),
    delete : (id : string) => request.del(`/Activities/${id}`)
}

const agent ={
    Activities
}

export default agent