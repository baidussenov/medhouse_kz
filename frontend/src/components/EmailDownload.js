import React, { useState } from 'react'
import apiService from '../services/apiService'


const EmailDownload = () => {
    const [senderId, setSenderId] = useState('')
    const [date, setDate] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleDownload = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            // Make a POST request to the backend to fetch and download emails
            const response = await apiService.fetchEmails(senderId, date, password)

            if (response.data.success) {
                // Send another request to upload to Google Drive
                await apiService.uploadFiles(
                    response.data.filePaths, // This should be an array of file names
                    process.env.REACT_APP_GDRIVE_FOLDER_ID
                )

                setMessage(`Emails retrieved and uploaded to Google Drive successfully!`)
            } else {
                setMessage(response.data.message || 'Error fetching emails')
            }
        } catch (error) {
            console.error('Error during email fetching:', error)
            setMessage('Error fetching or uploading emails.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleDownload}>
                <div>
                    <label>Sender ID:</label>
                    <input
                        type="text"
                        value={senderId}
                        onChange={(e) => setSenderId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Date (YYYY-MM-DD):</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Admin Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Fetch and Download Emails'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default EmailDownload
