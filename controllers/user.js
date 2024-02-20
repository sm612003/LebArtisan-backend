import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userController = {
 // Register a new user
 register: async (req, res) => {
    const { name, email, password, role, location, whatsapp, instagram, facebook } = req.body;
    const image = req.file?.path;
    try {
        // Check if password is provided
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        console.log("Received password:", password); // Log the received password

        // Check if the provided password meets complexity requirements
        // For example, minimum length and at least one uppercase, one lowercase, one number, and one special character
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Password hashed successfully");

        // Create a new user
        const newUser = new User({
            name,
            email,
            whatsapp,
            location,
            facebook,
            instagram,
           image: image ,
            password: hashedPassword,
            role: role || "artist", // Assuming default role is "artist"
        });
        await newUser.save();

        // Create JWT token
        const token = jwt.sign(
            { _id: newUser._id, role: newUser.role, email, name },
            process.env.SECRET_TOKEN,
            { expiresIn: "24h" }
        );

        // Set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        });

        return res.status(201).json(newUser);
    } catch (error) {
        console.error("Error occurred during user registration:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

,

    // Get a specific user by ID
    getOneUser: async (req, res) => {
        const userId = req.user._id;
        try {
            const user = await User.findById(userId);
            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ error: " artist not found" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const allUsers = await User.find();
            return res.status(200).json(allUsers);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // Get a specific user by ID
    getUserById: async (req, res) => {
        const id =req.user._id
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: " artist not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // Update a user by ID
    updateUserById: async (req, res) => {
        try {
            const { name,  password, oldPasswordInput, role , location,
                whatsapp,
                instagram,
                facebook,
                } = req.body;

            if (password && (typeof password !== "string" || password.length === 0)) {
                return res.status(400).json({ error: "Invalid password in the request body" });
            }

            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ error: " artist not found" });
            }

            let isOldPasswordValid = true;

            if (password) {
                // If a new password is provided, check the old password
                isOldPasswordValid = await bcrypt.compare(oldPasswordInput, user.password);

                if (!isOldPasswordValid) {
                    return res.status(401).json({ error: "Invalid old password" });
                }
            }

            const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    name,
                    ...(hashedPassword && { password: hashedPassword }),
                    role,
                    location,
                    whatsapp,
                    instagram,
                    facebook,
                },
                {
                    new: true,
                }
            );

            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // Delete a user by ID
    deleteUserById: async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

export default userController;
