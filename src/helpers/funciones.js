const hbs = require('hbs');
const path = require('path');
const fs = require('fs');
listaCursos = [];
listaEstudiantes = [];	

directorioCursos=path.join(__dirname,'../cursos.json');
directorioEstudiantes=path.join(__dirname,'../estudiantes.json');

const validarArchivoCursos = () =>{
	try{
		listaCursos = require(directorioCursos);
	}catch(err){
		listaCursos=[];
	}
};

const validarArchivoEstudiantes = () =>{
	try{
		listaEstudiantes = require(directorioEstudiantes);
	}catch(err){
		listaEstudiantes=[];
	}
};

const guardarCurso = () =>{
	let datos = JSON.stringify(listaCursos);
	fs.writeFile(directorioCursos, datos, (err)=>{
		if (err) throw (err);
	})
};

const guardarMatricula = () =>{
	let datos = JSON.stringify(listaEstudiantes);
	fs.writeFile(directorioEstudiantes, datos, (err)=>{
		if (err) throw (err);
	})
};

const validarCurso=(code)=>{
	validarArchivoCursos();
	var indiceCurso = listaCursos.findIndex(j => j.id == code);
	return indiceCurso;
};

const validarCursoConCupo=(code)=>{
	validarArchivoCursos();	
	var conCupo=listaCursos.filter(function(element){return(element.estado==='disponible')});
	var indiceCurso = conCupo.findIndex(j => j.id == code);
	return indiceCurso;
};

const validarCursoPorEstudiante=(idNumber,code)=>{
	validarArchivoCursos();
	validarArchivoEstudiantes();
	var matriculados = listaEstudiantes.filter(function(element){return(element.curso == code)});
	var indiceAlumno = matriculados.findIndex(j => j.cedula == idNumber);
	return indiceAlumno;
};

hbs.registerHelper('cambiarEstado',(idNumber)=>{
	validarArchivoCursos();
	var indiceCurso = validarCurso(idNumber);
	var texto;
	if(indiceCurso!=-1){
		var estadoActual = listaCursos[indiceCurso].estado;
		if(estadoActual == "disponible"){
			listaCursos[indiceCurso].estado = "no disponible";
			guardarCurso();
			texto= "<br>El curso "+listaCursos[indiceCurso].nombre+" ha pasado de estar \'disponible\' a <b>\'no disponible\'</b>"
		}else{
			listaCursos[indiceCurso].estado = "disponible";
			texto= "<br>El curso "+listaCursos[indiceCurso].nombre+" ha pasado de estar no \'disponible\' a <b>\'disponible\'</b>"
			guardarCurso();
		}
	}else{
		texto="<b>ERROR!</b> No existe un curso adjudicado al código "+idNumber+". Por favor verifique su código";
	}
	return texto;
});

hbs.registerHelper('listarEstudiantes', id =>{
	validarCurso();
	validarArchivoEstudiantes();
	var estudiantesPorCurso = listaEstudiantes.filter(function(element){return(element.curso == id)});
	if(validarCurso(id) != -1){
		if (estudiantesPorCurso.length > 0){
			var texto = "<br>Código del curso: <b>"+listaCursos[validarCurso(id)].id+"</b>"+
						"<br>Nombre del curso: <b>"+listaCursos[validarCurso(id)].nombre+"</b><br>";
			texto = texto+"<br><table class='table'><thead class='thead-light'><tr><th>Nombre</th><th>Identificación</th><th>eMail</th></tr></thead>";
			estudiantesPorCurso.forEach(estudiante=>{
					texto = texto+
					"<tr><td>"+estudiante.nombre+
					"</td><td>"+estudiante.cedula+
					"</td><td>"+estudiante.correo+"</td></tr>";
			});
			texto=texto+`</table><br>El total de alumnos matriculados es de: <b>`
				+estudiantesPorCurso.length+`</b></br>El estado actual del curso es: <b>`
				+listaCursos.find(function(element){return(element.id==id)}).estado+`</b><br><br>`;
			return texto;
		}else{
			return false;
		}
	}else{
		return false;
	}
}); 	

hbs.registerHelper('eliminarEstudiante',(idEst, idCur)=>{
	validarArchivoEstudiantes();
	var indiceAlumno = listaEstudiantes.findIndex(j => (j.cedula == idEst && j.curso == idCur));
	if(indiceAlumno != -1){
		var nombre = listaEstudiantes[indiceAlumno].nombre;
		listaEstudiantes.splice(indiceAlumno,1);
		guardarMatricula();
		return "Se ha eliminado correctamente al alumno <b>"+nombre+" </b>";
	}else{
		return "<b>ERROR!</b> No existe ningún estudiante matriculado en este curso e identificado con ese número de ID."
	}
});

hbs.registerHelper('inscribirCurso',(name,code,description,value,mod,time)=>{
	validarArchivoCursos();
	var curso = {
		nombre: name,
		id: code,
		descripcion: description,
		precio: value,
		modalidad: mod,
		estado: "disponible",
		intensidad: time
	};
	if(validarCurso(code)== -1){
		listaCursos.push(curso);
		guardarCurso();
		return("Usted ha inscrito exitosamente al curso de "+ name);
	}else{
		return("<b>ERROR!</b>  Ya existe un curso registrado bajo ese código. Verifique su informacion, por favor.");
	}
});

hbs.registerHelper('matricularCurso',(name,code,email,tel,idClass)=>{
	validarArchivoEstudiantes();
	var matricula={
		nombre: name,
		cedula: code,
		correo: email,
		telefono: tel,
		curso: idClass
	};
	if(validarCursoConCupo(idClass)!=-1){
		if(validarCursoPorEstudiante(code,idClass)==-1){
			listaEstudiantes.push(matricula);
			guardarMatricula();
			return "Usted ha matriculado correctamente el curso identificado con código "+idClass;
		}else{
			return "<b>ERROR!</b>  No puede matricular el mismo curso más de una vez";
		}
	}else{
		return "<b>ERROR!</b>  El código que usted desea inscribir no está adjudicado a ningún curso disponible. Por favor verifique sus datos";
	}
});

hbs.registerHelper('listarCursosDisponibles', ()=>{
	validarArchivoCursos();
	var cursosDiponibles = listaCursos.filter(function(element){return(element.estado === "disponible")});
	if(cursosDiponibles.length > 0){
		var texto="";
		var indice=0;
		cursosDiponibles.forEach(element=>{
			if(element.intensidad==undefined){
				var inten = "Sin definir aún por el docente";
			}else{
				inten=element.intensidad;
			}
			texto = texto + `<tr><td> <button class="btn btn-success" type="button" data-toggle="collapse" data-target="#multiCollapse${indice}" aria-expanded="false" aria-controls="multiCollapse${indice}">
				+${element.nombre}</button>
				<div class="collapse multi-collapse" id="multiCollapse${indice}"><div class="card card-body"><b>ID:</b>
    			${element.id}<br><b>Modalidad: </b>${element.modalidad}<br><b>Intensidad :</b>${inten}    			
    			</div></div></td><td>`;

			texto = texto +element.descripcion+`</td><td> $`
				+element.precio+`</td></tr>`;
			indice++;
		});
		return texto;
	}else{
		return false;
	}
});

