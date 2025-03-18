import express from "express";
import { PORT, mongoDBRUL } from "./config.js";
import mongoose from 'mongoose';
import trailsRoute from './routes/trailsRoute.js';
import usersRoute from './routes/usersRoute.js';
import certificationRoute from './routes/certificationRoute.js';
import reviewsRoute from './routes/reviewsRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

//Middleware for parsing request body - ak posielam ako json
app.use(express.json());

// middleware for handling cors policy
app.use(cors());
/*app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));*/

app.get('/', (request, response)=>{
    console.log(request);
    return response.status(234).send('WELCOME');
});

app.use('/trails', trailsRoute);
app.use('/users', usersRoute);
app.use('/certifications', certificationRoute);
app.use('/reviews', reviewsRoute);
app.use('/uploads', express.static('uploads'));
app.use('/uploads/audio', express.static('uploads/audio'));

mongoose.connect(mongoDBRUL)
.then(() => { 
    console.log('App connected to database'); 
    app.listen(PORT, () => {
        console.log(`App is listening to port: ${PORT}`);
    });
})
.catch((error) => { console.log(error);});