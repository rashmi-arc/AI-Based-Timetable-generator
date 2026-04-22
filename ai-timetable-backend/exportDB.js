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
  fs.mkdirSync(backupDir);
}

// Clear the backup directory first to remove old/wrongly named files
fs.readdirSync(backupDir).forEach(file => {
  fs.unlinkSync(path.join(backupDir, file));
});

console.log("Starting Database Export...");

collections.forEach(col => {
  try {
    console.log(`Exporting ${col}...`);
    execSync(`mongoexport --db ai_timetable --collection ${col} --out "${path.join(backupDir, col + ".json")}" --jsonArray`);
  } catch (err) {
    console.error(`Failed to export ${col}:`, err.message);
  }
});

console.log("Export complete! Data is saved in the 'database_backup' folder.");
