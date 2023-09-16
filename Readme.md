### Code to download firebase storage

~~~
const https = require('https');
const fs = require('fs');

const firebaseDownloadUrl = 'https://firebasestorage.googleapis.com/your-download-url-here';
const destinationPath = '/path/to/your/hosting/server/destination/folder/file.extension';

const fileStream = fs.createWriteStream(destinationPath);

https.get(firebaseDownloadUrl, (response) => {
  response.pipe(fileStream);
  fileStream.on('finish', () => {
    fileStream.close();
    console.log('File downloaded successfully.');
  });
});
~~~
