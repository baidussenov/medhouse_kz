import React from 'react'

function EmailList({ emails }) {
    return (
        <div>
            <h2>Email List</h2>
            <ul>
                {emails.map((email, index) => (
                    <li key={index}>
                        <h3>{email.emailTitle}</h3>
                        <p>From: {email.emailFrom}</p>
                        <p>Date: {email.emailDate}</p>
                        <p>Attachments:</p>
                        <ul>
                            {email.attachments.map((file, i) => (
                                <li key={i}>{file}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default EmailList
