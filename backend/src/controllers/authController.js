const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async(req,res) => {
    try{
        const {name, email,password} = req.body;
        if (!name || !email || !password) return res.status(400).json({message:"Missing fields"});

        const exists = await User.findOne({ email });
        if(exists) return res.status(400).json({message: "Email already in use"});

        const passwordHash = await bcrypt.hash(password,10)
        const user = await User.create({ name,email,passwordHash });

        return res.status(201).json({ message: " User registered", userid:user._id});
    }catch(err){
        return res.status(500).json({error: err.message });
    }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ================================
    // SET HTTP-ONLY COOKIE
    // ================================
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,       // true only in production (HTTPS)
      sameSite: "lax",     // DEV MODE SAFE (no SameSite=None issues)
      maxAge: 24 * 60 * 60 * 1000
    });

    // Response (no token needed in JSON anymore)
    return res.json({
      message: "Login successful"
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
