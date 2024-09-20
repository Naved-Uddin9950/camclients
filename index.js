import express from 'express';
import cors from 'cors';
import performerRoutes from './src/Routes/performer.routes.js';
import userRoutes from './src/Routes/user.routes.js';
import authRoutes from './src/Routes/auth.routes.js';
import messageRoutes from './src/Routes/message.routes.js';

// Constants
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/performer', performerRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/message', messageRoutes);

app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});