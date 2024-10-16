const fs = require('fs')
const path = require('path')
const Sender = require('../models/senderModel')
const { ImapFlow } = require('imapflow')
const moment = require('moment')
const pino = require('pino')()
require('dotenv').config()

pino.level = 'silent'

// Fetch emails and list out titles and xlsx file names, and download attachments
exports.fetchAndDownloadOrders = async (req, res) => {
    const { senderId, day } = req.body

    const targetDate = moment(day, 'YYYY-MM-DD')
    if (!targetDate.isValid()) {
        return res.status(400).json({ success: false, message: 'Invalid date format, use YYYY-MM-DD.' })
    }

    try {
        ensureDownloadDirExists()

        const sender = await Sender.findByPk(senderId)
        if (!sender) {
            return res.status(404).json({ success: false, message: 'Sender not found.' })
        }

        const email = process.env.HOST_EMAIL
        const password = process.env.HOST_PASS
        const client = new ImapFlow({
            host: 'imap.mail.ru',
            port: 993,
            secure: true,
            auth: {
                user: email,
                pass: password,
            },
            logger: pino,
        })

        await client.connect()

        // Make sure you're searching in the right folder
        await client.mailboxOpen('INBOX')

        // Search for emails from the sender and on the target date
        const messages = await client.search({
            from: sender.email,
            on: targetDate.toDate(),
        })

        const filePaths = []
        const emailList = []
        for (let uid of messages) {
            // Fetch the message's envelope and body structure
            const message = await client.fetchOne(uid, { envelope: true, bodyStructure: true })

            const emailTitle = message.envelope.subject
            const emailDate = message.envelope.date
            const emailFrom = message.envelope.from[0].address
            const emailTo = message.envelope.to.map((recipient) => recipient.address).join(', ')

            // Recursive function to extract attachment filenames and download them
            const downloadAttachments = async (parts, uid) => {
                if (!parts) return []

                const downloadedFiles = []
                for (const part of parts) {
                    // Check for attachment disposition and ensure it's a .xlsx file
                    if (part.disposition === 'attachment' && part.dispositionParameters?.filename.endsWith('.xlsx')) {
                        const attachmentFilename = part.dispositionParameters.filename

                        // Download the attachment content
                        const { content, meta } = await client.download(uid, part.part)

                        // Define where to save the attachment
                        const savePath = path.join(__dirname, '../downloads', attachmentFilename)

                        // Pipe the content to a file
                        content.pipe(fs.createWriteStream(savePath))
                        console.log(`Downloaded attachment: ${attachmentFilename}`)

                        downloadedFiles.push(attachmentFilename)
                        filePaths.push(attachmentFilename)
                    }
                }
                return downloadedFiles
            }

            const attachmentList = await downloadAttachments(message.bodyStructure.childNodes, uid)

            // Add the base information (from, to, subject, date) and attachments to the array
            emailList.push({
                emailTitle,
                emailDate,
                emailFrom,
                emailTo,
                attachments: attachmentList,
            })
        }

        await client.logout()

        res.json({
            success: true,
            filePaths,
            data: emailList,
            message: `Fetched and downloaded attachments for sender ${sender.email} on ${day}.`,
        })
    } catch (err) {
        console.error('Error fetching orders:', err)
        res.status(500).json({ success: false, message: 'Error fetching orders.' })
    }
}

// Ensure that the `downloads` directory exists
const ensureDownloadDirExists = () => {
    const downloadDir = path.join(__dirname, '..', 'downloads')
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir)
    }
}