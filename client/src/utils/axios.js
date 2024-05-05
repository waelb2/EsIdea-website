import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    }
})

export default instance;