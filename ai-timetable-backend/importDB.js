const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const collections = [
  "users",
  "departments",
  "programs",
  "semesters",
  "courses",
  "rooms",
  "depttimeslots",
  "courseteachermaps",
  "pdms",
  "constraintmasters",
  "constraints",
  "class_timetable",
  "examtimetables"
];

const backupDir = path.join(__dirname, "database_backup");

if (!fs.existsSync(backupDir)) {
  console.error("Backup folder not found!");
  process.exit(1);
}

console.log("Starting Database Import...");

collections.forEach(col => {
  const filePath = path.join(backupDir, col + ".json");
  if (fs.existsSync(filePath)) {
    // Check if the file is empty (size 0)
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      console.warn(`File for ${col} is empty, skipping import.`);
      return;
    }

    try {
      console.log(`Importing ${col}...`);
      execSync(`mongoimport --db ai_timetable --collection ${col} --file "${filePath}" --jsonArray --drop`);
    } catch (err) {
      console.error(`Failed to import ${col}:`, err.message);
    }
  } else {
    console.warn(`File for ${col} not found, skipping.`);
  }
});

console.log("Import complete! Your database is now synced with the backup folder.");
