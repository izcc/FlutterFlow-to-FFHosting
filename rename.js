const fs = require("fs");

const oldFileName = "h5p-test.h5p";
const newFileName = "h5p-test.zip";

fs.rename(oldFileName, newFileName, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`El archivo se renombró correctamente a ${newFileName}`);
  }
});