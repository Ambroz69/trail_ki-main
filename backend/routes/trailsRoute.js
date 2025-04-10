import express from 'express';
import { Trail } from '../models/trailModel.js';
import auth from '../auth.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isAudio = file.mimetype.startsWith('audio/');
    const folder = isAudio ? 'uploads/audio/' : 'uploads/'
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024, fileSize: 10 * 1024 * 1024 }, // 10MB file limit
});

// Route to Save a new Trail
router.post('/', auth, upload.single('thumbnail'), async (request, response) => {
  try {
    const { name, description, difficulty, locality, season, length, estimatedTime, language, points, translation } = request.body;
    const parsedPoints = JSON.parse(points);
    const parsedTranslation = JSON.parse(translation);
    let thumbnail = null;
    if (request.file) {
      thumbnail = request.file.path;
    }
    const newTrail = new Trail({ name, description, thumbnail, difficulty, locality, season, length, estimatedTime, language, points: parsedPoints, translation: parsedTranslation, creator: request.user.userId });
    await newTrail.save();
    return response.status(201).send(newTrail);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to upload an audio file and return its path
router.post('/upload-audio', auth, upload.single('audio'), async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).send({ message: 'No audio file uploaded' });
    }
    const audioPath = `/uploads/audio/${request.file.filename}`;
    response.status(200).json({ audioPath });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to Delete an Audio File
router.delete('/delete-audio', auth, async (request, response) => {
  try {
    const { existingAudio } = request.body;
    const audioPath = existingAudio;
    if (!audioPath) {
      return response.status(400).json({ message: 'No audio path provided' });
    }

    const filePath = path.join(process.cwd(), audioPath); // Convert to absolute path
    /*const filePath = '.' + audioPath;*/

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file
      console.log(`Deleted file: ${filePath}`);
      return response.status(200).json({ message: 'Audio deleted successfully' });
    } else {
      return response.status(404).json({ message: 'File not found' });
    }

  } catch (error) {
    console.error('Error deleting file:', error);
    response.status(500).json({ message: 'Failed to delete audio file' });
  }
});

// Route to get all trails from DB
router.get('/', auth, async (request, response) => {
  try {
    const trails = await Trail.find({});
    return response.status(201).send({
      count: trails.length,
      data: trails
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get one trail from DB by ID
router.get('/:id', auth, async (request, response) => {
  try {
    const { id } = request.params;
    const trail = await Trail.findById(id);
    return response.status(201).send(trail);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to Update a trail
router.put('/:id', auth, upload.single('thumbnail'), async (request, response) => {
  try {
    const { name, description, difficulty, locality, season, thumbnail, length, estimatedTime, language, points, translation } = request.body;
    const parsedPoints = JSON.parse(points);
    const parsedTranslation = JSON.parse(translation);
    //if (!name || !Array.isArray(parsedPoints) || parsedPoints.length === 0) {
    if (!name) {
      return response.status(400).send({
        message: 'Send all required fields: name and points array (with title, longitude, latitude)',
      });
    }

    for (let point of parsedPoints) {
      if (!point.title || !point.longitude || !point.latitude) {
        return response.status(400).send({
          message: 'Each point must have a title, longitude, and latitude',
        });
      }
    }

    const { id } = request.params;
    let existingTrail = await Trail.findById(id);
    if (!existingTrail) {
      return response.status(404).send({
        message: 'Trail not found',
      });
    }

    if (request.user.userRole !== "manager") {
      if (existingTrail.creator.toString() !== request.user.userId) {
        return response.status(403).json({ message: 'You are not authorized to perform this action' });
      }
    }

    let newThumbnail = existingTrail.thumbnail; // if there is no change, keep the old one
    if (request.file) {
      newThumbnail = request.file.path;
    }

    const updatedTrail = await Trail.findByIdAndUpdate(
      id,
      { name, description, difficulty, locality, season, thumbnail: newThumbnail, length, estimatedTime, language, points: parsedPoints, translation: parsedTranslation },
      { new: true }
    );

    if (!updatedTrail) {
      return response.status(404).send({
        message: 'Trail not found',
      });
    }

    response.status(200).send({
      message: 'Trail updated.',
      trail: updatedTrail,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Publish a trail
router.put('/publish/:id', auth, async (request, response) => {
  try {
    const { id } = request.params;
    let existingTrail = await Trail.findById(id);
    if (request.user.userRole !== "manager") {
      if (existingTrail.creator.toString() !== request.user.userId) {
        return response.status(403).json({ message: 'You are not authorized to perform this action' });
      }
    }
    const { published } = request.body;
    const updatedTrail = await Trail.findByIdAndUpdate(
      id,
      { published: published },
      { new: true }
    );

    if (!updatedTrail) {
      return response.status(404).send({
        message: 'Trail not found',
      });
    }

    response.status(200).send({
      message: 'Trail published.',
      trail: updatedTrail,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Clonning a trail
router.post('/clone/:id', auth, async (request, response) => {
  try {
    const { id } = request.params;
    const trail = await Trail.findById(id);

    if (!trail) {
      return response.status(404).send({
        message: 'Trail not found',
      });
    }

    const clonedTrail = new Trail({
      name: `${trail.name} (Copy)`,
      description: trail.description,
      thumbnail: trail.thumbnail,
      points: trail.points,
      season: trail.season,
      locality: trail.locality,
      length: trail.length || 0,
      difficulty: trail.difficulty,
      estimatedTime: trail.estimatedTime,
      language: trail.language,
      published: false, // Set published to false for the cloned trail
      creator: request.user.userId // new creator of the cloned trail
    });

    await clonedTrail.save();

    response.status(201).send({
      message: 'Trail cloned successfully.',
      trail: clonedTrail,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a trail
router.delete('/:id', auth, async (request, response) => {
  try {
    const { id } = request.params;
    let existingTrail = await Trail.findById(id);
    if (request.user.userRole !== "manager") {
      if (existingTrail.creator.toString() !== request.user.userId) {
        return response.status(403).json({ message: 'You are not authorized to perform this action' });
      }
    }
    // delete associated audio files
    existingTrail.points.forEach(point => {
      if (point.audioPath) {
        fs.unlinkSync('.' + point.audioPath, (error) => {
          if (error) console.log('Error deleting audio:', error);
        });
      }
    });
    const result = await Trail.findByIdAndDelete(id);
    if (!result) {
      return response.status(400).send({
        message: 'Trail not found',
      });
    }
    response.status(200).send({ message: 'Trail deleted successfully.' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
})

// Route for Delete a point of the trail
router.delete('/point/:trailId/:pointId', auth, async (request, response) => {
  const { trailId, pointId } = request.params;

  try {
    const trail = await Trail.findById(trailId);
    if (!trail) {
      return response.status(404).send({ message: 'Trail not found' });
    }
    const audioPath = trail.points[pointId].audioPath;
    if (audioPath) {
      fs.unlinkSync('.' + audioPath, (error) => {
        if (error) console.log('Error deleting audio:', error);
      });
    }
    const updatedPoints = trail.points.filter(point => point._id.toString() !== pointId);

    trail.points = updatedPoints;
    await trail.save();

    response.status(200).send({ message: 'Point deleted successfully.', trail: trail });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;