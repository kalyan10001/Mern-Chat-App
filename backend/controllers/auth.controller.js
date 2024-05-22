import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetcookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmpassword, gender } = req.body;

        if (password !== confirmpassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedpassword = await bcryptjs.hash(password, salt);

        const boyprofilepic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlprofilepic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname: fullname,
            username: username,
            password: hashedpassword,
            gender: gender,
            profilepic: gender === "male" ? boyprofilepic : girlprofilepic
        });

        if (newUser) {
            await newUser.save();

            generateTokenAndSetcookie(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                profilepic: newUser.profilepic
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log("Request Body:", req.body);

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        console.log("Querying user with username:", username);

        const user = await User.findOne({ username });

        console.log("User found:", user);

        if (!user || !user.password) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        console.log("Comparing passwords:", password, user.password);

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        console.log("Password comparison result:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetcookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic
        });
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
