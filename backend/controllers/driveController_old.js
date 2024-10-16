const { google } = require('googleapis')
const fs = require('fs')
const Order = require('../models/orderModel')

// Upload file to Google Drive
exports.uploadToDrive = async (req, res) => {
    const { filePath, city } = req.body

    const auth = new google.auth.OAuth2(
        process.env.GDRIVE_CLIENT_ID,
        process.env.GDRIVE_CLIENT_SECRET,
        process.env.GDRIVE_REDIRECT_URI
    )

    auth.setCredentials({ refresh_token: process.env.GDRIVE_REFRESH_TOKEN })

    const drive = google.drive({ version: 'v3', auth })

    try {
        const fileMetadata = {
            name: filePath,
            parents: [/* Google Drive Folder ID */]
        }
        const media = {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            body: fs.createReadStream(filePath)
        }

        const response = await drive.files.create({
            resource: fileMetadata,
            media,
            fields: 'id'
        })

        // Log successful upload in database
        Order.create({ city, file_name: filePath, upload_status: 'Success' }, (err, data) => {
            if (err) return res.status(500).json({ success: false, message: 'Error logging upload' })
        })

        res.json({ success: true, message: 'File uploaded successfully' })
    } catch (err) {
        console.log('Error uploading file:', err)
        res.status(500).json({ success: false, message: 'Upload failed' })
    }
}
