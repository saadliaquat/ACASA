import User from '../models/User.js';



export const register = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            res.json({ message: 'Login successful', user: user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
