import express from 'express';
import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import auth from '../auth.js';

const router = express.Router();

// Route to get all users from DB
router.get('/', auth, async(request, response) => {
  try {
      const users = await User.find({});
      return response.status(201).send({
          count: users.length,
          data: users
      });
  } catch(error) {
      console.log(error.message);
      response.status(500).send({message: error.message});
  }
});

router.post("/register", (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        name: request.body.name,
        email: request.body.email,
        password: hashedPassword,
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

router.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if(!passwordCheck) {
            return response.status(400).send({
              message: "Invalid Password",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
              userName: user.name,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Invalid Password",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

router.put('/profile', auth, async(request, response) => {
  try {
    const userId = request.user.userId;
    const { name, password } = request.body;

    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).send({ message: 'User not found.'});
    }

    if (name) {
      user.name = name;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    await user.save();

    return response.status(200).send({
      message: 'Profile updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error(error);
    return response.status(500).send({
      message: 'Error updating profile',
      error: error.message,
    });
  }
});

router.get('/me', auth, (request, response) => {
  User.findById(request.user.userId)
  .then(user => {
    if (!user) return response.status(404).send({ message: 'User not found.'});
    response.status(200).send({
      user: {
        name: user.name,
        email: user.email,
      }
    });
  });
});

export default router;