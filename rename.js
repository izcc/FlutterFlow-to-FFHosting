const fs = require("fs");
const AdmZip = require('adm-zip');
const { Buffer } = require('buffer');
const { CLIENT_RENEG_LIMIT } = require("tls");

// Check if a file path was provided as an argument
if (process.argv.length < 3) {
  console.error('Usage: node readFile.js <file-path>');
  process.exit(1);
}

// Get the file path from the command-line argument
const filePath = process.argv[2];

const newFileName = filePath.split(".",1)+".zip";
console.log(newFileName);

fs.rename(filePath, newFileName, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`El archivo se renombró correctamente a ${newFileName}`);
    desc(newFileName);
  }
});




const desc = (newFileName) => {
  
  console.log("I'm in desc");
  const archivoZip = new AdmZip(newFileName); // Reemplaza 'archivo.zip' con tu archivo ZIP
  const directorioDestino = './h5p-viewer/unzipped'; // Reemplaza 'directorio_destino' con el directorio donde quieres descomprimir los archivos

  try {
      archivoZip.extractAllTo(directorioDestino, /*overwrite*/true);
      console.log('Archivo ZIP descomprimido exitosamente');
      newFileName = filePath.split(".",1);
      htmlgen(newFileName);
  } catch (error) {
      console.error(error);
  }
};

const htmlgen = (newFileName) =>{ 
  const fs = require('fs');
  
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
  
  fs.writeFile(newFileName+'.html', contenidoHTML, (err) => {
      if (err) throw err;
      console.log('¡El archivo fue creado exitosamente!');
  });
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
