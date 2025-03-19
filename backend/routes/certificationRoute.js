import express from 'express';
import { Certification } from '../models/certificationModel.js';
import auth from '../auth.js';

const router = express.Router();

// Route to Save the result of Certification
router.post('/', auth, async(request, response) => {
  try {
    const { userId, trail, score, status, answers } = request.body;
    // Check if there is an ongoing certification (status: null)
    let existingCertification = await Certification.findOne({
      userId: userId,
      trail: trail,
      status: null, // only continue unfinished attempt
    });

    if (existingCertification) {
      // Update the existing certification attempt
      existingCertification.score = score;
      existingCertification.answers = answers;
      existingCertification.status = status;
      await existingCertification.save();
      return response.status(200).json(existingCertification);
    }

    // if no unfinished attempt exists, create a new one
    const newCertification = new Certification({ userId, trail, score, status, answers });
    await newCertification.save();
    return response.status(201).send(newCertification);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
})

// Route to get all certifications from DB
/*router.get('/', auth, async (request, response) => {
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
});*/

// Route to get certifications for the logged-in user where status is not null
router.get('/', auth, async(request, response) => {
  try {
    const userId = request.user.userId;
    
    const certifications = await Certification.find({
      userId: userId,
      //status: { $ne: null}
    }).populate('trail');
    
    return response.status(201).send({
      count: certifications.length,
      data: certifications
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
})

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

// Route to update a certification
router.put('/:id', auth, async (request, response) => {
  try {
    const { score, status, answers } = request.body;
    const updatedCertification = await Certification.findByIdAndUpdate(
      request.params.id,
      { score, status, answers },
      { new: true }
    );
    response.status(200).json(updatedCertification);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get users certification for a trail (status has to be null - work in progress)
router.get('/user/:trailId', auth, async (request, response) => {
  try {
    const certification = await Certification.findOne({
      userId: request.user.userId,
      trail: request.params.trailId,
    }).sort({ completedAt: -1}); // get the latest attempt
    response.status(200).json(certification);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get users certification for a trail (status has to be null - work in progress)
router.get('/certificate/:trailId', auth, async (request, response) => {
  try {
    const certification = await Certification.findOne({
      userId: request.user.userId,
      trail: request.params.trailId,
      status: "Passed"
    }).sort({ score: -1}); // get the best attempt
    response.status(200).json(certification);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;