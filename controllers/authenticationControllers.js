const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../schema/userSchema");

const nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.E_MAIL,
    pass: process.env.PASSWORD,
  },
});

const getUserById = async (req, res) => {
  try {
    const userById = await User.findOne({ _id: req.params.id });
    if (userById) {
      res.status(200).send(userById);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

const registerHandler = async (req, res) => {
  try {
    const emailTaken = await User.findOne({ email: req.body.email });
    if (emailTaken) return res.status(400).send("Email is already in use");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      gender: req.body.gender,
      password: hashPassword,
      onlineStatus: false,
    });

    try {
      const savedUser = await newUser.save();
      res.send(savedUser);
    } catch (e) {
      res.status(404).send(e);
    }
  } catch (e) {
    res.status(404).send(e);
  }
};

const defaultLoginHandler = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid password");

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        onlineStatus: true,
      }
    );

    const token = jwt.sign({ user }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    res.send({
      user: updatedUser,
      token,
    });
    // res.header("auth-token", token).send(token);
  } catch (e) {
    res.status(400).send(e);
  }
};

const socialLoginHandler = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const newUser = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
      });

      try {
        const savedUser = await newUser.save();
        const token = jwt.sign({ savedUser }, process.env.SECRET_KEY, {
          expiresIn: "24h",
        });

        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          {
            onlineStatus: true,
          }
        );

        res.send({ user: updatedUser, token });
      } catch (e) {
        res.status(404).send(e);
      }
    }

    if (user) {
      const token = jwt.sign({ user }, process.env.SECRET_KEY, {
        expiresIn: "24h",
      });

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          onlineStatus: true,
        }
      );
      res.header("auth-token", token).send(token);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

const forgotPasswordVerificationHandler = async (req, res) => {
  try {
    const emailExists = await User.findOne({ email: req.body.email });
    if (!emailExists) return res.status(400).send("Email is not found");

    const verificationCode = Math.floor(Math.random() * 900000);

    const mailOptions = {
      from: process.env.E_MAIL,
      to: `${req.body.email}`,
      subject: "Verification code",
      text: `${verificationCode}`,
    };

    res.send(`${verificationCode}`);

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return error;
      } else {
        return "Email sent: " + info.response;
      }
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

const updatePasswordHandler = async (req, res) => {
  try {
    const findByEmail = await User.findOne({ email: req.body.email });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    User.findByIdAndUpdate(findByEmail._id, { password: hashPassword })
      .then((_) => res.send("Success"))
      .catch((_) => res.status(400).send("Unexpected error"));
  } catch (e) {
    res.status(400).send(e);
  }
};

const defaultLogOutHandler = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.body._id },
      {
        onlineStatus: false,
        lastOnline: new Date().getHours() - 12,
      }
    );
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = {
  getUserById,
  registerHandler,
  defaultLoginHandler,
  socialLoginHandler,
  forgotPasswordVerificationHandler,
  updatePasswordHandler,
  defaultLogOutHandler,
};
