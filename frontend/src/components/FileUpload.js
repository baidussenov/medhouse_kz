import React, { useState } from 'react'
import apiService from '../services/apiService'

function FileUpload({ files }) {
    const [loading, setLoading] = useState(false)

    const handleUpload = async () => {
        setLoading(true)
        try {
            const fileList = files.map((file) => file.filename)
            await apiService.uploadFiles(fileList)
            alert('Files uploaded to Google Drive!')
        } catch (error) {
            console.error(error)
            alert('Failed to upload files')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <button onClick={handleUpload} disabled={loading || files.length === 0}>
                {loading ? 'Uploading...' : 'Upload to Google Drive'}
            </button>
        </div>
    )
}

export default FileUpload
