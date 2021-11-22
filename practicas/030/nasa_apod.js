const URL_API_NASA_APOD = "https://api.nasa.gov/planetary/apod?";
const MI_API_KEY = "bEBSoZOmDswdBci7CgA9cUWdUSUto3VsPDe83VIs";
let queDia = 16;
let queMes = 6;
let queAno = 1995;
let html = '';
var arrayMeses = ["0" , "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

$(document).ready(function()

    {
        llenarDias();
        llenarMeses();
        llenarAnos();

    } 
);


function llenarDias() 
{
    html = '';
    $('#selectDia > option').remove();
    html += '<option value="0">Dia</option>';
    for (dia = 1; dia <= 31; dia++) {
        html += '<option value="' + dia + '">' + dia + '</option>';
    }
    $('#selectDia').append(html);

}


function llenarMeses() 
{
    html = '';
    $('#selectMes > option').remove();
    html += '<option value="0">Mes</option>';
    for (mes = 1; mes <= 12; mes++) {
        html += '<option value="' + mes + '">' + arrayMeses[mes] + '</option>';
    }
    $('#selectMes').append(html);

}

function llenarAnos() 
{
    html = '';
    $('#selectAno > option').remove();
    html += '<option value="0">Año</option>';
    for (ano = 1995; ano <= 2021; ano++) {
        html += '<option value="' + ano + '">' + ano + '</option>';
    }
    $('#selectAno').append(html);

}

function construirURL() 
{
   
    return URL_API_NASA_APOD + 'api_key=' + MI_API_KEY + '&date=' + queAno + '-' + queMes + '-' + queDia;

}

function buscar() 
{
   
    queDia = $("#selectDia").val();
    queMes = $("#selectMes").val();
    queAno = $("#selectAno").val();
    if (queDia <= 0 || queMes <= 0 || queAno <= 0) {
        alertify.alert('!Atencion!' , 'La fecha tiene un valor cero en uno de su(s) dato(s)')
    } else {

        queDia = (queDia<10)? ('0'+queDia):queDia;
        queMes = (queMes<10)? ('0'+queMes):queMes;
        obtenerDatos();
        
    }
}

    
async function obtenerDatos()
{
    let url = construirURL();
    let respuesta = await fetch(url);
    if (!respuesta.ok) {
        alertify.alert('!Atencion!','Ocurrio algo, mira el log.');
        console.log('ESTATUS: ' + respuesta.status);
        limpiarDatos();
    }
    datos = await respuesta.json();
    pintarDatos();
}


function limpiarDatos() 
{
    $('#imagenChica').attr("src","https://www.utn.red/imagenes/nasa_logo.png");
    $('#h5Nombre').html("SIN_NOMBRE");
    $('#pTexto').html("SIN_DATOS");
    $('#h1Titulo').html("SIN_TITULO");
    $('#botonVerHD').attr("href", "#");

}



function pintarDatos() 
{
    $('#imagenChica').attr("src", datos.url);
    $('#h5Nombre').html(datos.copyright);
    $('#pTexto').html( datos.explanation );
    $('#h1Titulo').html( datos.title );
    $('#botonVerHD').attr("href", datos.hdurl);
    console.log(datos);
}


obtenerDatos().catch(error => {
    alertify.alert('!Atencion!','Ocurrio un error, mira el log.');
    console.log('ERROR: ' + error.message);
    limpiarDatos();
});