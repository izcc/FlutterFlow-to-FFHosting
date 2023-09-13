// Contenido HTML que deseas incluir en el archivo
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
      h5pJsonPath: '/h5p-folder/h5p-test',
      frameJs: '/assets/frame.bundle.js',
      frameCss: '/assets/styles/h5p.css'
      
    });
  </script>
</body>

</html>
`;

// Crear un Blob con el contenido HTML
const blob = new Blob([contenidoHTML], { type: 'text/html' });

// Crear un enlace para la descarga del archivo
const enlaceDescarga = document.createElement('a');
enlaceDescarga.href = URL.createObjectURL(blob);
enlaceDescarga.download = 'archivo.html'; // Nombre del archivo
enlaceDescarga.textContent = 'Descargar archivo HTML';

// Agregar el enlace al cuerpo del documento
document.body.appendChild(enlaceDescarga);
