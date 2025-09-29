// --- START OF DEBUGGING CODE ---
console.log('--- SERVER STARTING ---');
console.log('MONGO_URI from Render Env:', process.env.MONGO_URI);
console.log('JWT_SECRET from Render Env:', process.env.JWT_SECRET);
// --- END OF DEBUGGING CODE ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// --- Get Secrets from Environment Variables ---
const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));


// --- Mongoose Schemas ---

// User Schema (profileImage field removed)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Note Schema
const noteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);


// --- JWT Authentication Middleware ---
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret); 
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};


// --- API Routes ---

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password || password.length < 6) {
            return res.status(400).json({ message: 'Please provide all fields, password must be 6+ characters.' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});


// GET /api/profile
app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

// PUT /api/profile
app.put('/api/profile', authMiddleware, async (req, res) => {
    try {
        const { username, email } = req.body;
        const updateData = { username, email };

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
});


// Notes CRUD Routes...
app.post('/api/notes', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        const newNote = new Note({
            userId: req.user.id,
            title,
            content,
        });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.error('Create Note Error:', error);
        res.status(500).json({ message: 'Server error creating note' });
    }
});

app.get('/api/notes', authMiddleware, async (req, res) => {
    try {
        const { search } = req.query;
        let query = { userId: req.user.id };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }
        const notes = await Note.find(query).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        console.error('Get Notes Error:', error);
        res.status(500).json({ message: 'Server error fetching notes' });
    }
});

app.get('/api/notes/:id', authMiddleware, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ message: 'Note not found or user not authorized' });
        }
        res.json(note);
    } catch (error) {
        console.error('Get Single Note Error:', error);
        res.status(500).json({ message: 'Server error fetching note' });
    }
});

app.put('/api/notes/:id', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title, content },
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found or user not authorized' });
        }
        res.json(updatedNote);
    } catch (error) {
        console.error('Update Note Error:', error);
        res.status(500).json({ message: 'Server error updating note' });
    }
});

app.delete('/api/notes/:id', authMiddleware, async (req, res) => {
    try {
        const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found or user not authorized' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Delete Note Error:', error);
        res.status(500).json({ message: 'Server error deleting note' });
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

