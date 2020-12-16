import axios from 'axios';

export class AuthService {
    constructor() { }

    signup(params: any) {
        return axios.post('', params)
    }

    login(params: any) {
        return axios.post('', params)
    }

    forgotPassword(params: any) {
        return axios.post('', params)
    }

}
