const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myappdb';

async function seed() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to MongoDB ✅");

        // Clean old data
        await User.deleteMany({});
        console.log("Old data cleared 🧹");

        const users = [];

        // Generate data for years 2021 → 2025
        const years = [2021, 2022, 2023, 2024, 2025];
        for (const year of years) {
            for (let month = 0; month < 12; month++) {
                // Generate random user count per month
                const userCount = faker.number.int({ min: 5, max: 40 });

                for (let i = 0; i < userCount; i++) {
                    const day = faker.number.int({ min: 1, max: 28 }); // safe days
                    const registrationDate = new Date(year, month, day);

                    users.push({
                        name: faker.person.fullName(),
                        city: faker.location.city(),
                        registrationDate,
                    });
                }
            }
        }

        await User.insertMany(users);
        console.log(`${users.length} users inserted 🎉`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
