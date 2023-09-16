const https = require('https');
const fs = require('fs');
const AdmZip = require('adm-zip');
const util = require('util');
const { Buffer } = require('buffer');
const { CLIENT_RENEG_LIMIT } = require("tls");
const rename = util.promisify(fs.rename);

const download = (firebaseDownloadUrl, nameFile) => {
  return new Promise((resolve, reject) => {
    const destinationPath = './' + nameFile + '.h5p';
    console.log('Destination Path:', destinationPath);
    const fileStream = fs.createWriteStream(destinationPath);

    const request = https.get(firebaseDownloadUrl, (response) => {
      console.log("Inside the get function");
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log('File downloaded successfully.');

        const newFileName = destinationPath.replace(/\.h5p$/, ".zip");
        console.log(newFileName);

        rename(destinationPath, newFileName) // Rename the file to add the .zip extension
          .then(() => {
            // Perform any additional operations here, such as unzipping the files and creating the HTML file
            const link = desc(newFileName);
            resolve(link); // Resolve the Promise with the link
          })
          .catch(reject);
      });
    });

    request.on('error', (error) => {
      reject(error); // Reject the Promise if there's an error with the download
    });
  });
};

const desc = (newFileName) => {
  
  console.log("I'm in desc");
  const archivoZip = new AdmZip(newFileName); // Reemplaza 'archivo.zip' con tu archivo ZIP
  const directorioDestino = './h5p-viewer/unzipped'; // Reemplaza 'directorio_destino' con el directorio donde quieres descomprimir los archivos

  try {
      archivoZip.extractAllTo(directorioDestino, /*overwrite*/true);
      console.log('Archivo ZIP descomprimido exitosamente');
      newFileName = filePath.split(".",1);
      const result = htmlgen(newFileName);
      return result;
  } catch (error) {
      console.error(error);
      return error;
  }
};

const htmlgen = (newFileName) =>{ 
  
  const folderPath= './h5p-folder/'+newFileName;

  fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      console.error(`Error creating folder: ${err}`);
    } else {
      console.log(`Folder created successfully at ${folderPath}`);
    }
  });

  const ruta_h5p = './h5p-folder/'+newFileName;

  move(ruta_h5p);
  
  const contenidoHTML = `
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>H5P Test</title>
    <script type="text/javascript" src="/assets/main.bundle.js"></script>
  </head>
  
  <body>
      <h3><a href="https://enarmad-318df.web.app/">Ir atrás</a></h3>
      <br>
  
    <div id="h5p-container"></div>
  
    <script type="text/javascript">
      const {
        H5P
      } = H5PStandalone;
      new H5P(document.getElementById('h5p-container'),  {
        h5pJsonPath: '${ruta_h5p}',
        frameJs: '/assets/frame.bundle.js',
        frameCss: '/assets/styles/h5p.css'
        
      });
    </script>
  </body>
  
  </html>
  `;
  
  const file = fs.writeFile(newFileName+'.html', contenidoHTML, (err) => {
      if (err) throw err;
      console.log('¡El archivo fue creado exitosamente!');
      const link = 'https://enarmad-318df.web.app/'+newFileName+'.html';
      return link;
  });
  return file;
};


const move = (ruta_h5p) => {
  const path = require('path');

  // Specify the source directory where the files are located
  const sourceDirectory = './h5p-viewer/unzipped';// Replace with the actual source directory

  // Specify the destination directory where you want to move the files
  const destinationDirectory = ruta_h5p; // Replace with the actual destination directory

  // Use fs.readdir to get a list of files in the source directory
  fs.readdir(sourceDirectory, (err, files) => {
    if (err) {
      console.error(`Error reading source directory: ${err}`);
      return;
    }

    // Iterate through the list of files
    files.forEach((fileName) => {
      // Construct the source and destination file paths
      const sourceFilePath = path.join(sourceDirectory, fileName);
      const destinationFilePath = path.join(destinationDirectory, fileName);

      // Use fs.rename to move the file
      fs.rename(sourceFilePath, destinationFilePath, (moveErr) => {
        if (moveErr) {
          console.error(`Error moving ${fileName}: ${moveErr}`);
        } else {
          console.log(`${fileName} moved successfully to ${destinationFilePath}`);
        }
      });
    });
  });
};


// Export the downloadFile function to make it accessible from other modules
module.exports = {
  download,
};

