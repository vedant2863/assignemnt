import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { User } from "../models/userModel.js";
import { Item } from "../models/itemModel.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    seedData(); // Call function to seed data
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

// Seed data function
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});

    // Create sample users using faker
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(), // In real use, hash passwords!
      };
      users.push(user);
    }

    const createdUsers = await User.insertMany(users);
    console.log(`Inserted ${createdUsers.length} users`);

    // Create sample items for each user using faker
    const items = [];
    createdUsers.forEach((user) => {
      for (let i = 0; i < 2; i++) {
        // Each user will have 2 items
        const item = {
          user: user._id,
          name: faker.commerce.productName(),
          dob: faker.date.past(30), // Random date of birth within the past 30 years
        };
        items.push(item);
      }
    });

    const createdItems = await Item.insertMany(items);
    console.log(`Inserted ${createdItems.length} items`);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    mongoose.connection.close();
  }
};
