const fs = require("fs");
const path = require("path");
const BloodBank = require("../models/BloodBank");

async function seedBloodBanksIfNotExists() {
  try {
    const count = await BloodBank.countDocuments();

    if (count > 0) {
      console.log("BloodBank collection already seeded. Skipping...");
      return;
    }

    //  Read JSON file
    const filePath = path.join(__dirname, "../utils/bloodbanks.json");
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    //  Insert into DB
    await BloodBank.insertMany(jsonData);

    console.log("BloodBank data inserted successfully!");

  } catch (error) {
    console.error("Seeding Error:", error);
  }
}

module.exports = seedBloodBanksIfNotExists;
