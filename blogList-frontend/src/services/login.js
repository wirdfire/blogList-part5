import axios from "axios";
const baseUrl = '/api/login'

const login = async Credential => {
    const response = await axios.post(baseUrl, Credential)
    return response.data
}

export default { login }