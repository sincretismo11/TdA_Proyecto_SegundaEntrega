const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers/funciones');
const app = express();
const directorioPublico = path.join(__dirname,'../public');
const directorioPartials = path.join(__dirname,'../template/partials');
const directorioCursos=path.join(__dirname,'./cursos.json');
var listaCursos = require(directorioCursos);




app.use(express.static(directorioPublico));
hbs.registerPartials(directorioPartials);
app.listen(3000,()=>{
	console.log('\nServidor corriendo exitosamente en el puerto 3000.\n');
	console.log('- Para visualizar su contenido, diríjase a localhost:3000 en su navegador.');
	console.log('- Para detener el servidor, oprima ctr+c en su consola de comandos.');
	console.log('\n Más información a jopenara@unal.edu.co\n');
	console.log('--------------------------------------------------------------------');

});
app.use(bodyParser.urlencoded({extended: false}));

app.set('views',path.join(__dirname,'../template/views'));
app.set('view engine', 'hbs');

app.get('/',(req,res)=>{
	res.render('index',{
		rol:'  '
	});
});

//RUTAS DEL ADMINISTRADOR
app.get('/administrador',(req,res)=>{
	res.render('administrador',{
		rol: 'administrador'
	});
});
app.get('/inscripcionCursos',(req,res)=>{
	res.render('inscripcionCursos',{
		rol: 'administrador'
	});
});
app.post('/confirmacionCurso',(req,res)=>{
	res.render('confirmacionCurso',{
		rol: 'administrador',
		nombre:req.body.nombre,
		id: parseInt(req.body.id),
		descripcion: req.body.descripcion,
		precio: parseInt(req.body.precio),
		modalidad: req.body.modalidad,
		intensidad:parseInt(req.body.intensidad)
	});
});

app.get('/cursos',(req,res)=>{
	res.render('cursos',{
		rol: 'administrador',
		cursos: listaCursos
	});
});

//RUTAS DEL ASPIRANTE
app.get('/aspirante',(req,res)=>{
	res.render('aspirante',{
		rol:'aspirante'
	});
});
app.get('/cursosDisponibles',(req,res)=>{
	res.render('cursosDisponibles',{
		rol:'aspirante'
	});
});
app.get('/matriculaCursos',(req,res)=>{
	res.render('matriculaCursos',{
		rol:'aspirante'
	});
});

app.post('/editarCurso',(req,res)=>{
	res.render('editarCurso',{
		rol: 'administrador',
		id: parseInt(req.body.id),
	})
});

app.post('/cambiarEstadoCurso',(req,res)=>{
	res.render('cambiarEstadoCurso',{
		rol: 'administrador'
	});
});

app.post('/confirmacionMatricula',(req,res)=>{
	res.render('confirmacionMatricula',{
		rol:'aspirante',
		nombre: req.body.nombre,
		cedula: parseInt(req.body.cedula),
		correo: req.body.correo,
		telefono: parseInt(req.body.telefono),
		codigoCurso: parseInt(req.body.codigoCurso)
	});
});

app.post('/estudiantes',(req,res)=>{
	res.render('estudiantes',{
		rol:'administrador',
		id: parseInt(req.body.id),
	});
});

app.post('/eliminarEstudiante',(req,res)=>{
	res.render('eliminarEstudiante',{
		rol:'administrador',
		idEstudiante: parseInt(req.body.idEstudiante),
		idCurso: parseInt(req.body.idCurso)
	});
});