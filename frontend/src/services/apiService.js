import axios from 'axios'

const API_URL = 'http://127.0.0.1:5000/api' // Update with your backend API URL

const apiService = {
    fetchEmails: (senderId, day, password) => {
        return axios.post(`${API_URL}/email/fetch`, { senderId, day, password })
    },

    uploadFiles: (fileList, folderId = null) => {
        return axios.post(`${API_URL}/drive/upload`, { fileList, folderId })
    },
}

export default apiService
