import React, { useState } from 'react'
import EmailFetcher from './EmailFetcher'
import EmailList from './EmailList'
import FileUpload from './FileUpload'

function DriveUploader() {
    const [emails, setEmails] = useState([])

    const handleEmailsFetched = (fetchedEmails) => {
        setEmails(fetchedEmails)
    }

    return (
        <div>
            <EmailFetcher onEmailsFetched={handleEmailsFetched} />
            <EmailList emails={emails} />
            <FileUpload files={emails.flatMap((email) => email.attachments)} />
        </div>
    )
}

export default DriveUploader
