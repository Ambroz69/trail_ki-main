import express from 'express';
import { Certification } from '../models/certificationModel.js';
import auth from '../auth.js';

const router = express.Router();

// Route to Save the result of Certification
router.post('/', auth, async(request, response) => {
  try {
    const { userId, trail, score, status, answers } = request.body;
    const newCertification = new Certification({ userId, trail, score, status, answers });
    await newCertification.save();
    return response.status(201).send(newCertification);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
})

// Route to get all certifications from DB
router.get('/', auth, async (request, response) => {
  try {
    const certifications = await Certification.find({});
    return response.status(201).send({
      count: certifications.length,
      data: certifications
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get one certification from DB by ID
router.get('/:id', auth, async (request, response) => {
  try {
    const { id } = request.params;
    const certification = await Certification.findById(id);
    return response.status(201).send(certification);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});