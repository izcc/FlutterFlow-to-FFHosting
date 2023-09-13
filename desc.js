const AdmZip = require('adm-zip');
const fs = require('fs');

const archivoZip = new AdmZip('h5p-test.zip'); // Reemplaza 'archivo.zip' con tu archivo ZIP
const directorioDestino = '/h5p-viewer/unzipped'; // Reemplaza 'directorio_destino' con el directorio donde quieres descomprimir los archivos

try {
    archivoZip.extractAllTo(directorioDestino, /*overwrite*/true);
    console.log('Archivo ZIP descomprimido exitosamente');
} catch (error) {
    console.error(error);
}