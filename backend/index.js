import express from "express";
import { PORT, mongoDBRUL } from "./config.js";
import mongoose from 'mongoose';
import trailsRoute from './routes/trailsRoute.js';
import usersRoute from './routes/usersRoute.js';
import certificationRoute from './routes/certificationRoute.js';
import reviewsRoute from './routes/reviewsRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

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
//app.use('/uploads', express.static('uploads'));
//app.use('/uploads/audio', express.static('uploads/audio'));
// render disk changes
app.use('/uploads', express.static('/uploads'));
app.use('/uploads/audio', express.static('/uploads/audio'));

// MULTER ERROR HANDLER 
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FIELD_VALUE') {
        return res.status(400).send({ message: "multer_file_limit" });
      }
      return res.status(400).send({ message: err.message });
    } else if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    next();
  });

mongoose.connect(mongoDBRUL)
.then(() => { 
    console.log('App connected to database'); 
    app.listen(PORT, () => {
        console.log(`App is listening to port: ${PORT}`);
    });
})
.catch((error) => { console.log(error);});