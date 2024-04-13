const csvtojson = require('csvtojson');
const multer = require('multer');
const express = require('express');
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs')
const app = express();

let Objcsv = []
// Configurar multer
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });
app.use(express.static(__dirname+'/public'))
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', async (req, res) => {
	res.render('index.html')
});
// Ruta para subir archivo y modificar CSV
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
	 const inputtext = req.body.ingresardatos
	 const inputmail = req.body.ingresarmail
	 
	 let mails = String(inputmail.split(','))
    const csvData = await csvtojson().fromFile(req.file.path);
    
	
	// Modificar campos específicos
    for (const row of csvData) {
		if(mails.includes(row["Email Address [Required]"])){
			row["Org Unit Path [Required]"] = inputtext
			Objcsv.push(row)
		}
	  //Org Unit Path [Required] cambiar a ruta
		
	}

	// Guardar cambios en el archivo CSV
    (async () => {
		const csv = new ObjectsToCsv(Objcsv);
		await csv.toDisk(`./uploads/${Date.now()} - upload.csv`);
	})();
	

    res.send('Archivo CSV modificado y subido con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar el archivo CSV');
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

// ... (código anterior)

// Ruta para obtener lista de archivos cargados
app.get('/archivos-cargados', async (req, res) => {
  try {
    const archivos = fs.readdirSync('./uploads');
    const archivosProcesados = [];

    for (const archivo of archivos) {
      const nombre = archivo;
      const fecha = new Date(fs.statSync(`./uploads/${archivo}`).mtime).toLocaleDateString();

      archivosProcesados.push({ nombre, fecha });
    }

    res.json(archivosProcesados);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la lista de archivos');
  }
});

// ... (código anterior)

// Ruta para descargar archivo modificado
app.get('/descargar/:nombre', async (req, res) => {
  const nombreArchivo = req.params.nombre;
  const pathArchivo = `./uploads/${nombreArchivo}`;

  try {
    if (fs.existsSync(pathArchivo)) {
      res.sendFile(pathArchivo, {
        headers: {
          'Content-Disposition': `attachment; filename="${nombreArchivo}"`
        }
      });
    } else {
      res.status(404).send('Archivo no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al descargar el archivo');
  }
});

