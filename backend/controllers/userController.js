const User = require('../models/User');

// GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpires');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Compute BMI
    let bmi = null;
    if (user.weight && user.heightFeet !== undefined) {
      const totalInches = user.heightFeet * 12 + (user.heightInches || 0);
      const meters = totalInches * 0.0254;
      bmi = (user.weight / (meters * meters)).toFixed(1);
    }

    res.status(200).json({ ...user.toObject(), bmi });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const { name, age, username, weight, heightFeet, heightInches, gymTime, notificationsEnabled } = req.body;

    // Check username uniqueness
    if (username && username !== req.user.username) {
      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(400).json({ message: 'Username already taken.' });
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, age, username, weight, heightFeet, heightInches, gymTime, notificationsEnabled },
      { new: true, runValidators: true }
    ).select('-password -otp -otpExpires');

    // Compute BMI
    let bmi = null;
    if (updated.weight && updated.heightFeet !== undefined) {
      const totalInches = updated.heightFeet * 12 + (updated.heightInches || 0);
      const meters = totalInches * 0.0254;
      bmi = (updated.weight / (meters * meters)).toFixed(1);
    }

    res.status(200).json({ ...updated.toObject(), bmi, message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getProfile, updateProfile };
