const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    try {
        auth.verify(req, res, async function () {
            const loggedInUser = await User.findOne({ _id: req.userId });
            return res.status(200).json({
                loggedIn: true,
                user: {
                    firstName: loggedInUser.firstName,
                    lastName: loggedInUser.lastName,
                    userName: loggedInUser.userName,
                    email: loggedInUser.email
                }
            }).send();
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    try {
        return res.clearCookie("token").status(200).json({success: true}).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password, passwordVerify } = req.body;
        if (firstName.trim() === "" || lastName.trim() === "" || userName.trim() === "" || email.trim() === "" || password.length === 0 || passwordVerify.length === 0) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingEmail = await User.findOne({ email: email });
        const existingUser = await User.findOne({ userName: userName });
        if (!existingUser && existingEmail) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }
        else if (existingUser && !existingEmail) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        }
        else if (existingUser && existingEmail) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Both the provided username and email address have already been taken."
                })
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName: firstName, lastName: lastName, userName: userName, email: email, passwordHash: passwordHash
        });
        const savedUser = await newUser.save();
        
        return res.status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                userName: savedUser.userName,
                email: savedUser.email,
            }
        }).send();

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginUser = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if(userName.trim() === "" && password.length === 0)
            return res.status(400).json({errorMessage: "Please enter a username and password."});
        else if(userName.trim() === "")
            return res.status(400).json({errorMessage: "Please enter a username."});
        else if(password.length === 0)
            return res.status(400).json({errorMessage: "Please enter a password."});
        else {
            const existingUser = await User.findOne({ userName: userName });
            if (existingUser) {
                const validPass = await bcrypt.compare(password, existingUser.passwordHash);
                if(validPass) {
                    // LOGIN THE USER
                    const token = auth.signToken(existingUser);
                    await res.cookie("token", token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none"
                    }).status(200).json({
                        success: true,
                        user: {
                            firstName: existingUser.firstName,
                            lastName: existingUser.lastName,
                            userName: existingUser.userName,
                            email: existingUser.email,
                        }
                    }).send();
                }
                else {
                    return res.status(400).json({ errorMessage: "Incorrect username and/or password." });
                }
            }
            else {
                return res.status(400).json({ errorMessage: "Incorrect username and/or password." });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}