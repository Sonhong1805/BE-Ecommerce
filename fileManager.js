const fs = require("fs");

module.exports = {
  createFile: (filename) => {
    try {
      const fd = fs.openSync(filename, "w");
      fs.closeSync(fd);
    } catch (err) {
      console.error("Error creating file:", err);
    }
  },

  saveFile: (obj, filename) => {
    try {
      const convertToString = JSON.stringify(obj);
      fs.writeFile(filename, convertToString, "utf-8", (err) => {
        if (err) {
          console.error("Error saving file:", err);
        } else {
          console.log("File saved successfully.");
        }
      });
    } catch (err) {
      console.error("Error in saveFile:", err);
    }
  },

  readFile: (filename) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, "utf-8", (err, data) => {
        if (err) {
          reject(new Error("Error reading file: " + err));
        } else {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (parseErr) {
            reject(new Error("Error parsing JSON data: " + parseErr));
          }
        }
      });
    });
  },

  fileExists: (filename) => {
    try {
      return fs.existsSync(filename);
    } catch (err) {
      console.error("Error checking file existence:", err);
      return false;
    }
  },
};
