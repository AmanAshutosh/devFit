const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../config/email');

const OTP_RESEND_COOLDOWN_MS = 60 * 1000;   // 60 seconds
const OTP_RESEND_MAX = 3;                    // max resends per registration

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser && !existingUser.isVerified) {
      // Re-registration resets the resend counter
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.password = password;
      existingUser.name = name;
      existingUser.mobile = mobile;
      existingUser.otpResendCount = 0;
      existingUser.otpResendLastAt = undefined;
      await existingUser.save();
      await sendOTPEmail(email, name, otp);
      return res.status(200).json({ message: 'OTP resent. Please verify your email.' });
    }

    const user = new User({ name, email, password, mobile, otp, otpExpires, otpResendCount: 0 });
    user.username = user.generateUsername();
    await user.save();

    await sendOTPEmail(email, name, otp);

    res.status(201).json({ message: 'Registration successful. Please verify your email with the OTP sent.' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified.' });
    }
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Please register again.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error during OTP verification.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Update streak
    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastActive === today) {
      // Already logged in today, keep streak
    } else if (lastActive === yesterday) {
      user.streak = (user.streak || 0) + 1;
    } else {
      user.streak = 1; // Reset streak
    }
    user.lastActiveDate = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        streak: user.streak,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// POST /api/auth/resend-otp
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ message: 'Email already verified. Please login.' });

    // Max resend attempts
    if ((user.otpResendCount || 0) >= OTP_RESEND_MAX) {
      return res.status(429).json({ message: 'Maximum OTP attempts reached. Please register again.' });
    }

    // 60-second cooldown
    if (user.otpResendLastAt) {
      const elapsed = Date.now() - new Date(user.otpResendLastAt).getTime();
      if (elapsed < OTP_RESEND_COOLDOWN_MS) {
        const secondsLeft = Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsed) / 1000);
        return res.status(429).json({ message: `Please wait ${secondsLeft}s before requesting a new OTP.` });
      }
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.otpResendCount = (user.otpResendCount || 0) + 1;
    user.otpResendLastAt = new Date();
    await user.save();

    await sendOTPEmail(email, user.name, otp);

    res.status(200).json({
      message: 'New OTP sent to your email.',
      attemptsLeft: OTP_RESEND_MAX - user.otpResendCount,
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error. Could not resend OTP.' });
  }
};

module.exports = { register, verifyOTP, login, resendOTP };
