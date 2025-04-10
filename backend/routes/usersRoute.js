import express from 'express';
import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import auth from '../auth.js';

const router = express.Router();

// Route to get all users from DB
router.get('/', auth, async (request, response) => {
  try {
    const users = await User.find({});
    return response.status(201).send({
      count: users.length,
      data: users
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.post('/register', async (request, response) => {
  try {
    // hash the password
    const hashedPassword = await bcrypt.hash(request.body.password, 10);

    // create a new user instance
    const user = new User({
      name: request.body.name,
      email: request.body.email,
      country: request.body.country,
      primaryLanguage: request.body.primaryLanguage,
      password: hashedPassword,
      role: 'explorer', 
      verified: false,
      verificationToken: null,
    });


    // generate the verification token
    const emailToken = jwt.sign(
      { email: request.body.email },
      process.env.EMAIL_SECRET,
      { expiresIn: '1d' }
    );

    // attach token to user
    user.verificationToken = emailToken;

    // save user
    await user.save();

    // configure nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVER,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSCODE,
      },
    });

    // send the verification email
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: request.body.email,
      subject: 'AVAtar - Account verification',
      text: `Verify your email\n\n Hello ${request.body.name}, thanks for registering on AVAtar! \n Please click the link below to verify your email: \n http://localhost:5555/users/verify/${emailToken} \n This link will expire in 24 hours.`,
      html: `
        <h2>Verify your email</h2>
        <p>Hello ${request.body.name}, thanks for registering on AVAtar!</p>
        <p>Please click the link below to verify your email:</p>
        <a href="${process.env.BACKEND_URL}/users/verify/${emailToken}">Verify your account</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // respond the client
    return response.status(201).json({
      message: 'User created successfully. Please check your email to activate the account.',
    })

  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: 'Error creating user.',
      error: error.message,
    });
  }
});

router.get('/verify/:token', async (request, response) => {
  try {
    // decode token
    const { token } = request.params;
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    // find the user matching mail and token
    const user = await User.findOne({
      email: decoded.email,
      verificationToken: token,
    });
    if (!user) {
      return response.status(400).send('Invalid token or user not found.');
    }

    // set user as verified
    user.verified = true;
    user.verificationToken = null;
    await user.save();

    // redirect to login
    return response.redirect(`${process.env.FRONTEND_URL}/users/login`);
  } catch (error) {
    console.log(error);
    return response.status(400).send('Invalid or expired token.');
  }
});

// old register without mail confirmation
/*router.post("/register", (request, response) => {
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
});*/

router.post("/forgot-password", async (request, response) => {
  try {
    const { email } = request.body;

    // find user by mail
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ message: 'No user found with that email.' });
    }

    // generate a reset token
    const resetToken = jwt.sign(
      { email: request.body.email },
      process.env.FORGOTTEN_SECRET,
      { expiresIn: '1d' }
    );

    // set resettoken
    user.resetPasswordToken = resetToken;
    await user.save();

    // configure nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVER,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSCODE,
      },
    });

    // send email
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: request.body.email,
      subject: 'AVAtar - Password Reset',
      text: `Password reset\n\n Hello ${request.body.name}, you requested a password reset for your account on AVAtar. \n Please click the link below to set a new password (valid for 60 minutes): \n http://localhost:5555/reset-password/${resetToken} `,
      html: `
        <h2>Password reset</h2>
        <p>Hello ${request.body.name}, you requested a password reset for your account on AVAtar.</p>
        <p>Please click the link below to set a new password (valid for 60 minutes):</p>
        <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset your password</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    return response.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Error processing password reset', error });
  }
});

router.post("/reset-password", async (request, response) => {
  try {
    const { token, newPassword } = request.body;
    const decoded = jwt.verify(token, process.env.FORGOTTEN_SECRET);

    console.log("Token expires at:", new Date(decoded.exp * 1000));
    console.log("Server time now:", new Date());

    // find user by token
    const user = await User.findOne({
      email: decoded.email,
      resetPasswordToken: token,
    });
    if (!user) {
      return response.status(400).send('Invalid token or user not found.');
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update user
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    await user.save();

    return response.status(200).json({ message: 'Password has been reset successfully.'});
    //return response.redirect(`${process.env.FRONTEND_URL}/users/login`);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Error resetting password', error });
  }
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
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Invalid Password",
              error,
            });
          }

          // last login
          user.lastLogin = new Date();
          user.save().catch(error => console.log('Error updating last login:', error));

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
              userName: user.name,
              userCountry: user.country,
              userRole: user.role,
              primaryLanguage: user.primaryLanguage || 'English',
              userVerified: user.verified,
            },
            process.env.LOGIN_SECRET,
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

router.put('/profile', auth, async (request, response) => {
  try {
    const userId = request.user.userId;
    const { name, password, country, primaryLanguage } = request.body;

    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).send({ message: 'User not found.' });
    }

    if (name) {
      user.name = name;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (country) {
      user.country = country;
    }
    if (primaryLanguage) {
      user.primaryLanguage = primaryLanguage;
    }
    await user.save();

    return response.status(200).send({
      message: 'Profile updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        primaryLanguage: user.primaryLanguage,
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
      if (!user) return response.status(404).send({ message: 'User not found.' });
      response.status(200).send({
        user: {
          name: user.name,
          email: user.email,
          country: user.country,
          primaryLanguage: user.primaryLanguage,
        }
      });
    });
});

// Route for Verify a user manually
router.put('/verify/:id', auth, async (request, response) => {
  try {
    const { id } = request.params;
    const { verified } = request.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { verified: verified },
      { new: true }
    );

    if (!updatedUser) {
      return response.status(404).send({
        message: 'User not found',
      });
    }

    response.status(200).send({
      message: 'User verified.',
      user: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for role updating by manager
router.put('/updateRole/:id', auth, async (request, response) => {
  try {
    const { id } = request.params;
    const { role } = request.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: role },
      { new: true }
    );

    if (!updatedUser) {
      return response.status(404).send({
        message: 'User not found',
      });
    }

    response.status(200).send({
      message: 'User role updated.',
      user: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;