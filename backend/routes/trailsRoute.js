import express from 'express';
import { Trail } from '../models/trailModel.js';
import auth from '../auth.js';

const router = express.Router();

// Route to Save a new Trail
router.post('/', auth, async (request, response) => {
    try {
        const { name, description, thumbnail, difficulty, locality, season, length, points } = request.body;
        const newTrail = new Trail({name, description, thumbnail, difficulty, locality, season,  length, points});
        await newTrail.save();
        return response.status(201).send(newTrail);
    } catch(error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route to get all trails from DB
router.get('/', auth, async(request, response) => {
    try {
        const trails = await Trail.find({});
        return response.status(201).send({
            count: trails.length,
            data: trails
        });
    } catch(error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route to get one trail from DB by ID
router.get('/:id', auth, async(request, response) => {
    try {
        const {id} = request.params;
        const trail = await Trail.findById(id);
        return response.status(201).send(trail);
    } catch(error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route to Update a trail
router.put('/:id', auth, async (request, response) => {
    try {
        const { name, points } = request.body;

        if (!name || !Array.isArray(points) || points.length === 0) {
            return response.status(400).send({
                message: 'Send all required fields: name and points array (with title, longitude, latitude)',
            });
        }

        for (let point of points) {
            if (!point.title || !point.longitude || !point.latitude) {
                return response.status(400).send({
                    message: 'Each point must have a title, longitude, and latitude',
                });
            }
        }

        const { id } = request.params;
        const updatedTrail = await Trail.findByIdAndUpdate(
            id,
            { name, points },
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
        const updatedTrail = await Trail.findByIdAndUpdate(
            id,
            { published: true },
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
            difficulty: trail.difficulty,
            published: false // Set published to false for the cloned trail
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
router.delete('/:id', auth, async(request, response) => {
    try {
        const {id} = request.params;
        const result = await Trail.findByIdAndDelete(id);
        if(!result) {
            return response.status(400).send({
                message: 'Trail not found',
            });
        }
        response.status(200).send({message: 'Trail deleted successfully.'});
    } catch(error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
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