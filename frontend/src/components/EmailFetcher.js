import React, { useState } from 'react'
import apiService from '../services/apiService'

function EmailFetcher() {
    const [senderId, setSenderId] = useState('')
    const [day, setDay] = useState('')
    const [emails, setEmails] = useState([])
    const [loading, setLoading] = useState(false)

    const handleFetchEmails = async () => {
        setLoading(true)
        try {
            const response = await apiService.fetchEmails(senderId, day)
            setEmails(response.data.emailList)
            alert('Emails fetched successfully!')
        } catch (error) {
            console.error(error)
            alert('Failed to fetch emails')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2>Fetch Emails</h2>
            <input
                type="text"
                placeholder="Sender ID"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
            />
            <input
                type="date"
                value={day}
                onChange={(e) => setDay(e.target.value)}
            />
            <button onClick={handleFetchEmails} disabled={loading}>
                {loading ? 'Fetching...' : 'Fetch Emails'}
            </button>
        </div>
    )
}

export default EmailFetcher
