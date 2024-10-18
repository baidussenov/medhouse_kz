const argon2 = require('argon2')
const dotenv = require('dotenv')

// Load .env variables
dotenv.config()

const authenticateAdmin = async (req, res, next) => {
    const { password } = req.body

    if (!password) {
        return res.status(401).json({ message: 'Password is required' })
    }

    try {
        // Compare the hash of the provided password with the stored hash in .env
        const adminTokenHash = process.env.ADMIN_ACCESS_TOKEN

        // Use argon2 to verify the password
        const isValid = await argon2.verify(adminTokenHash, password)

        if (!isValid) {
            return res.status(403).json({ message: 'Invalid admin password' })
        }

        // If password is correct, proceed to the next middleware or controller
        next()
    } catch (error) {
        console.error('Error during admin authentication:', error)
        return res.status(500).json({ message: 'Server error during authentication' })
    }
}

module.exports = authenticateAdmin
