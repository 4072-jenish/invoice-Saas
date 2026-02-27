const prisma = require("../../prisma");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const regUser = async (req, res) => {
    try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const user = await prisma.user.findUnique({
          where: { email },
        });
    
        if (!user) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
    
        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
    
        res.json({ message: "Login successful", token });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}




module.exports = {
    regUser,
    loginUser
}