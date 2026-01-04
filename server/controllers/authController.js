import { token } from '../middleware/token.js'
import { Detail } from '../models/detailModel.js'
import bcrypt from 'bcrypt'

export const login = async (req, res) => {
  try {
    const { restaurantId, username, password } = req.body
    

    //  Validate input
    if (!restaurantId || !username || !password) {
      return res
        .status(400)
        .json({ message: 'Restaurant ID, Username and password are required' })
    }

    // Find restaurant with matching ID and username in one query
    const detail = await Detail.findOne({
      restaurantId: restaurantId,
      'loginCredentials.username': username,
    })

    if (!detail) {
      
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const storedPassword = detail.loginCredentials.password

    // Compare hashed password with entered password
    const isMatch = await bcrypt.compare(password, storedPassword)
    if (!isMatch) {
      // console.log(' Password mismatch for user:', username)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    //  Generate JWT token & set cookie
    const jwtToken = token(res, { username })
    // console.log(` Token generated & set in cookie for user: ${username}`)

    return res.status(200).json({
      message: 'Login successful',
      username,
      token: jwtToken,
    })
  } catch (error) {
    console.error(' Error during login:', error.message)
    res
      .status(500)
      .json({ message: 'Error during login', error: error.message })
  }
}

export const logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    })
    return res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    console.error('🔥 Error during logout:', error.message)
    res
      .status(500)
      .json({ message: 'Error during logout', error: error.message })
  }
}

export const updateCredentials = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { username, oldPassword, password: newPassword } = req.body;

    // Validate input
    if (!username || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Username, old password, and new password are required' });
    }

    // Find restaurant with matching ID
    const detail = await Detail.findOne(
  { restaurantId },
  {
    'loginCredentials.username': 1,
    'loginCredentials.password': 1,
    _id: 0
  }
);


    if (!detail) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const storedPassword = detail.loginCredentials.password;
console.log(`From auth controller ${detail}`)
    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, storedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update credentials
    detail.loginCredentials.username = username;
    detail.loginCredentials.password = hashedPassword;

    await detail.save();

    return res.status(200).json({ message: 'Username & password updated successfully' });
  } catch (error) {
    console.error('Error updating credentials:', error.message);
    return res.status(500).json({ message: 'Error updating credentials', error: error.message });
  }
};
