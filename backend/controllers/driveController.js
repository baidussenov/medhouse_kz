const fs = require('fs')
const path = require('path')
const { google } = require('googleapis')
require('dotenv').config() // Load environment variables from .env

// OAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(
    process.env.GDRIVE_CLIENT_ID,
    process.env.GDRIVE_CLIENT_SECRET,
    process.env.GDRIVE_REDIRECT_URI
)

// Token path (to store OAuth2 access token)
const TOKEN_PATH = 'config/token.json'

// Authenticate function: Gets the OAuth token
async function authenticate() {
    return new Promise((resolve, reject) => {
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return reject('Error loading token from disk, please authenticate')
            oAuth2Client.setCredentials(JSON.parse(token))
            resolve(oAuth2Client)
        })
    })
}

// Controller function to handle file upload
async function uploadToDrive(fileList, folderId = null) {
    try {
        const auth = await authenticate() // Ensure the user is authenticated
        const drive = google.drive({ version: 'v3', auth })

        for (const fileName of fileList) {
            const filePath = path.join(__dirname, '../downloads/', fileName)
            const fileMetadata = {
                name: path.basename(filePath),
                parents: folderId ? [folderId] : [], // Optionally upload to a specific folder
            }

            const media = {
                mimeType: 'application/octet-stream',
                body: fs.createReadStream(filePath),
            }

            const response = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id',
            })

            console.log(`File ${filePath} uploaded successfully. File ID: ${response.data.id}`)
        }
    } catch (error) {
        console.error('Error uploading files:', error)
        throw error
    }
}

module.exports = { uploadToDrive }
