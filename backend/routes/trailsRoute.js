import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import auth from '../auth.js';
import { Trail } from '../models/trailModelB.js';
import { TrailTranslation } from '../models/trailTranslation.js';
import { Point } from '../models/pointModel.js';
import { PointTranslation } from '../models/pointTranslation.js';
import { Quiz } from '../models/quizModel.js';
import { QuizTranslation } from '../models/quizTranslation.js';
import { User } from '../models/userModel.js';
import { Review } from '../models/reviewModel.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isAudio = file.mimetype.startsWith('audio/');
    //const folder = isAudio ? 'uploads/audio/' : 'uploads/';
    const folder = isAudio ? '/uploads/audio/' : '/uploads/'; //render disk changes
    fs.mkdirSync(folder, { recursive: true }); // ensures path exists
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

// helper to populate trail with translations
const populateTrail = async (trail, lang) => {
  const base = trail.toObject();
  if (!lang || lang === trail.language) return base;

  const trailTranslation = await TrailTranslation.findOne({ trail: trail._id, language: lang });
  if (trailTranslation) {
    base.name = trailTranslation.name;
    base.description = trailTranslation.description;
    base.translated = true;
  }

  const populatedPoints = [];
  for (const pointId of trail.points) {
    const point = await Point.findById(pointId);
    if (!point) continue;
    const pointObj = point.toObject();

    if (lang !== point.language) {
      const pointTranslation = await PointTranslation.findOne({ point: point._id, language: lang });
      
      if (pointTranslation) {
        pointObj.title = pointTranslation.title;
        pointObj.content = pointTranslation.content;
      }
    }

    if (point.quiz) {
      const quiz = await Quiz.findById(point.quiz);
      if (quiz) {
        const quizObj = quiz.toObject();
        if (lang !== quiz.language) {
          const quizTranslation = await QuizTranslation.findOne({ quiz: quiz._id, language: lang });;
          if (quizTranslation) {
            quizObj.question = quizTranslation.question;
            quizObj.answers = quizTranslation.answers;
            quizObj.feedback = quizTranslation.feedback;
            quizObj.feedbackContent = quizTranslation.feedbackContent;
          }
        }
        pointObj.quiz = quizObj;
      }
    }
    //console.log(pointObj);
    populatedPoints.push(pointObj);
  }
  base.points = populatedPoints;
  return base;
}

// Route to Save a new Trail
router.post('/', auth, upload.single('thumbnail'), async (request, response) => {
  try {
    const { name, description, difficulty, locality, season, length, estimatedTime, language, points, translation } = request.body;
    const parsedPoints = JSON.parse(points);
    const parsedTranslation = translation ? JSON.parse(translation) : [];

    const trail = new Trail({
      name, description, difficulty, locality, season, length, estimatedTime, language,
      thumbnail: request.file ? request.file.path : null, creator: request.user.userId
    });
    await trail.save();

    // save translation
    for (const trans of parsedTranslation) {
      await TrailTranslation.create({ trail: trail._id, ...trans });
    }

    // create points
    const createdPointIds = [];
    for (const p of parsedPoints) {
      const quiz = p.quiz ? await Quiz.create({ ...p.quiz, language }) : null;
      const point = await Point.create({ ...p, language, trail: trail._id, quiz: quiz?._id || null });
      createdPointIds.push(point._id);
      if (p.translations) {
        for (const trans of p.translations) {
          await PointTranslation.create({ point: point._id, ...trans });
        }
      }
      if (p.quiz && p.quiz.translations) {
        for (const qt of p.quiz.translations) {
          await QuizTranslation.create({ quiz: quiz._id, ...qt });
        }
      }
    }
    trail.points = createdPointIds;
    await trail.save();
    response.status(201).json(trail);

  } catch (error) {
    console.error(error);
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
    const populatedTrails = await Promise.all(trails.map(async (trail) => {
      const translations = await TrailTranslation.find({ trail: trail._id});
      return {
        ...trail.toObject(),
        translations
      };
    }));
    return response.status(201).send({
      count: populatedTrails.length,
      data: populatedTrails
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Statistic counts for title page
router.get('/public-stats', async (request, response) => {
  try {
    const [registeredUsers, publishedTrails, doneReviews, reviewStatistics] = await Promise.all([
      User.countDocuments({}),
      Trail.countDocuments({ published: true }),
      Review.countDocuments({}),
      Review.aggregate([{
        $match: {rating: {$gte: 1, $lte: 5,},},
      }, {
        $group: {_id: null, averageRatings: {$avg: '$rating'}}
      }])
    ]);

    const averageRatings = reviewStatistics.length > 0 ? Math.round(reviewStatistics[0].averageRatings * 100) / 100 : 0;

    return response.status(200).json({
      registeredUsers,
      publishedTrails,
      doneReviews,
      averageRatings,
    });
  } catch (error) {
    console.error('Failed to load counts:', error);

    return response.status(500).json({
      message: 'Failed to load counts',
    });
  }
});

// Route to get one trail from DB by ID
router.get('/:id', auth, async (request, response) => {
  try {
    const { id } = request.params;
    const trail = await Trail.findById(id).populate({
      path: 'points',
      populate: [{ path: 'quiz' }],
    });
    if (!trail) return response.status(404).send({ message: 'Trail not found' });
    const lang = request.query.lang || 'Slovak';
    const result = await populateTrail(trail, lang);
    return response.status(201).send(result);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to Update a trail
router.put('/:id', auth, upload.single('thumbnail'), async (request, response) => {
  try {
    const trail_id = request.params.id;
    const trail = await Trail.findById(trail_id);
    if (!trail) return response.status(404).send({ message: 'Trail not found' });
    const { name, description, difficulty, locality, season, length, estimatedTime, language, points } = request.body;
    const parsedPoints = JSON.parse(points);

    const existingPointIds = trail.points.map(p => p.toString());
    const incomingPointIds = parsedPoints.map(p => p._id).filter(id => id !== undefined);

    const pointsToDelete = existingPointIds.filter(id => !incomingPointIds.includes(id));
    const pointsToUpdate = incomingPointIds.filter(id => existingPointIds.includes(id));
    const pointsToCreate = parsedPoints.filter(p => !p._id);

    // delete removed points
    for (const pointId of pointsToDelete) {
      const point = await Point.findById(pointId);
      if(point) {
        if(point.quiz) {
          await QuizTranslation.deleteMany({ quiz: point.quiz });
          await Quiz.findByIdAndDelete(point.quiz);
        }
        await PointTranslation.deleteMany({ point: point._id });
        await Point.findByIdAndDelete(point._id);
      }
    }

    // update existing points
    for (const point of parsedPoints) {
      if(point._id && pointsToUpdate.includes(point._id)) {
        const existing = await Point.findById(point._id);
        if(existing) {
          existing.title = point.title;
          existing.content = point.content;
          existing.longitude = point.longitude;
          existing.latitude = point.latitude;
          if(point.quiz) {
            if(existing.quiz) {
              const quiz = await Quiz.findById(existing.quiz);
              if(quiz) {
                quiz.question = point.quiz.question;
                quiz.answers = point.quiz.answers;
                quiz.feedback = point.quiz.feedback;
                quiz.feedbackContent = point.quiz.feedbackContent;
                await quiz.save();
              }
            } else {
              const newQuiz = await Quiz.create({...point.quiz, language });
              existing.quiz = newQuiz._id;
            }
          }
          await existing.save();
        }
      }
    }

    // create new points
    for (const point of pointsToCreate) {
      const quiz = point.quiz ? await Quiz.create({...point.quiz, language }) : null;
      const newPoint = await Point.create({
        trail: trail_id,
        title: point.title,
        content: point.content,
        longitude: point.longitude,
        latitude: point.latitude,
        quiz: quiz?._id || null,
        language: trail.language,
      });
      trail.points.push(newPoint._id);
    }

    // update trail
    trail.name = name;
    trail.description = description;
    trail.difficulty = difficulty;
    trail.locality = locality;
    trail.season = season;
    trail.length = length;
    trail.estimatedTime = estimatedTime;
    trail.language = language;
    if (request.file) trail.thumbnail = request.file.path;

    await trail.save();
    response.status(200).send({ message: 'Trail updated', trail });
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a trail
router.delete('/:id', auth, async (request, response) => {
  try {
    const trail = await Trail.findById(request.params.id);
    if (!trail) return response.status(404).send({ message: 'Trail not found' });

    await TrailTranslation.deleteMany({ trail: trail._id });
    const points = await Point.find({ _id: { $in: trail.points } });
    for (const point of points) {
      await PointTranslation.deleteMany({ point: point._id });
      if (point.quiz) {
        await QuizTranslation.deleteMany({ quiz: point.quiz });
        await Quiz.findByIdAndDelete(point.quiz);
      }
      await Point.findByIdAndDelete(point._id);
    }

    await Trail.findByIdAndDelete(request.params.id);
    response.status(200).send({ message: 'Trail deleted' });
  } catch (error) {
    console.error(error);
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
    const original = await Trail.findById(request.params.id);
    if (!original) return response.status(404).send({ message: 'Trail not found' });

    const translations = await TrailTranslation.find({ trail: original._id });
    const points = await Point.find({ _id: { $in: original.points } });
    const newTrail = new Trail({
      name: `${original.name} (Copy)`,
      description: original.description,
      difficulty: original.difficulty,
      locality: original.locality,
      season: original.season,
      length: original.length,
      estimatedTime: original.estimatedTime,
      language: original.language,
      thumbnail: original.thumbnail,
      published: false,
      creator: request.user.userId,
      points: [],
    })
    await newTrail.save();

    for (const t of translations) {
      await TrailTranslation.create({ ...t.toObject(), trail: newTrail._id, _id: undefined });
    }
    for (const point of points) {
      const quiz = point.quiz ? await Quiz.findById(point.quiz) : null;
      const newQuiz = quiz ? await Quiz.create({ ...quiz.toObject(), _id: undefined }) : null;
      const newPoint = await Point.create({ ...point.toObject(), _id: undefined, quiz: newQuiz?._id || null });
      newTrail.points.push(newPoint._id);

      const pointTranslations = await PointTranslation.find({ point: point._id });
      for (const pt of pointTranslations) {
        await PointTranslation.create({ ...pt.toObject(), point: newPoint._id, _id: undefined });
      }

      if (quiz) {
        const quizTranslations = await QuizTranslation.find({ quiz: quiz._id });
        for (const qt of quizTranslations) {
          await QuizTranslation.create({ ...qt.toObject(), quiz: newQuiz._id, _id: undefined });
        }
      }
    }
    await newTrail.save();
    response.status(201).send({ message: 'Trail cloned', trail: newTrail });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// delete point of trail
router.delete('/point/:trailId/:pointId', auth, async (req, res) => {
  try {
    const { trailId, pointId } = req.params;

    const trail = await Trail.findById(trailId);
    if (!trail) return res.status(404).json({ message: 'Trail not found' });

    const point = await Point.findById(pointId);
    if (!point) return res.status(404).json({ message: 'Point not found' });

    // Remove audio file if exists
    if (point.audioPath) {
      const filePath = path.join(process.cwd(), point.audioPath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Delete associated quiz and translations
    if (point.quiz) {
      await QuizTranslation.deleteMany({ quiz: point.quiz });
      await Quiz.findByIdAndDelete(point.quiz);
    }

    await PointTranslation.deleteMany({ point: point._id });
    await Point.findByIdAndDelete(point._id);

    trail.points = trail.points.filter(id => id.toString() !== pointId);
    await trail.save();

    res.status(200).send({ message: 'Point deleted from trail successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

// create translation for trail
router.post('/:id/translate', auth, upload.none(), async (request, response) => {
  const trailId = request.params.id;
  const translation = JSON.parse(request.body.translation);
  const pointsTranslation = JSON.parse(request.body.pointsTranslation);

  await TrailTranslation.create({ trail: trailId, ...translation });

  for (const pt of pointsTranslation) {
    const point = pt.pointId;
    if (pt.translation) await PointTranslation.create({ point, ...pt.translation });
    if (pt.quizTranslation) {
      const pointDoc = await Point.findById(point);
      if (pointDoc && pointDoc.quiz) {
        await QuizTranslation.create({ quiz: pointDoc.quiz, ...pt.quizTranslation });
      }
    }
  }

  response.status(201).send({ message: 'Translation saved' });
});

// update translation of trail
router.put('/:id/translate', auth, upload.none(), async(request, response) => {
  try {
    const trailId = request.params.id;
    const translation = JSON.parse(request.body.translation);
    const pointsTranslation = JSON.parse(request.body.pointsTranslation);
    

    // Update trail translation
    if (translation) {
      const existingTranslation = await TrailTranslation.findOne({ trail: trailId, language: translation.language });
      if (existingTranslation) {
        existingTranslation.name = translation.name;
        existingTranslation.description = translation.description;
        await existingTranslation.save();
      } else {
        await TrailTranslation.create({ trail: trailId, ...translation });
      }
    }

    // Update points and quiz translations
    for (const pt of pointsTranslation) {
      const pointId = pt.pointId;

      if (pt.translation) {
        const existingPointTranslation = await PointTranslation.findOne({ point: pointId, language: pt.translation.language });
        if (existingPointTranslation) {
          existingPointTranslation.title = pt.translation.title;
          existingPointTranslation.content = pt.translation.content;
          await existingPointTranslation.save();
        } else {
          await PointTranslation.create({ point: pointId, ...pt.translation });
        }
      }

      if (pt.quizTranslation) {
        const point = await Point.findById(pointId);
        const quizId = point?.quiz;
        if (quizId) {
          const existingQuizTranslation = await QuizTranslation.findOne({ quiz: quizId, language: pt.quizTranslation.language });
          if (existingQuizTranslation) {
            existingQuizTranslation.question = pt.quizTranslation.question;
            existingQuizTranslation.answers = pt.quizTranslation.answers;
            existingQuizTranslation.feedback = pt.quizTranslation.feedback;
            existingQuizTranslation.feedbackContent = pt.quizTranslation.feedbackContent;
            await existingQuizTranslation.save();
          } else {
            await QuizTranslation.create({ quiz: quizId, ...pt.quizTranslation });
          }
        }
      }
    }

    response.status(200).send({ message: 'Translation updated' });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// get quizzes for practice
router.get('/quizzes/practice', auth, async (request, response) => {
  try {
    const userLang = request.query.lang || 'Slovak';

    const quizzes = await Quiz.find({});

    const preparedQuizzes = await Promise.all(quizzes.map(async (quiz) => {
      const quizObj = quiz.toObject();
      
      if (quiz.language === userLang) return quizObj;

      const translation = await QuizTranslation.findOne({ quiz: quiz._id, language: userLang });
      if (translation) {
        return {
          ...quizObj,
          question: translation.question,
          answers: translation.answers,
          feedback: translation.feedback,
          feedbackContent: translation.feedbackContent,
          language: userLang,
        };
      }

      return quizObj;
    }));

    response.status(200).send({
      count: preparedQuizzes.length,
      data: preparedQuizzes,
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;