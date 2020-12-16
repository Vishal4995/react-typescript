import axios from 'axios';

axios.interceptors.request.use((config) => {
    return config
})

axios.interceptors.response.use((config) => {
    return config
})

export { AuthService } from './auth.service';