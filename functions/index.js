const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const downloadFile = require("./downloadFile"); 
const { CollectionGroup } = require("firebase-admin/firestore");

app.use(bodyParser.json());


// Define a sample route
app.get('/', (req, res) => { // Change this to '/' to match your Firebase Hosting rewrite
  res.json({ message: 'Hello, API!' });
});

app.post('/getLink', (req, res) => {
  try {
    const firebaseDownloadUrl = req.body.link;
    const nameFile = req.body.name;
    console.log(firebaseDownloadUrl,nameFile);
    const result = downloadFile.download(firebaseDownloadUrl,nameFile);
    
    res.json({resultado: result });
  } catch (error) {
    // Handle errors appropriately
    res.status(500).json({ error: error.message });
  }
    //res.json({ firebaseDownloadUrl, destinationPath });
  });

// Create "main" function to host all other top-level functions
const main = express();
main.use('/', app);

exports.api = functions.https.onRequest(main);
