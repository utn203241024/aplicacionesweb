const URL_API_MARVEL = "https://gateway.marvel.com:443/v1/public/";
const KEY_PUBLICA = 'fc2bcb9f675a945eef10524572a4581f';
const KEY_PRIVADA = '06e7d1f1f50e3530e8e5acc6ae398d2bd30e6d15';
let marcaTiempo = '';
let parametros = '';
let html = '';
let url = '';
let respuesta = null;
let datos = null;
let jsonPersonajes = null;
let objetoPersonaje = null;
let offset = 0;

$(document).ready( function()
    {
        // crearParametros() // Produce conflictos
    }
);

function marcarTiempo()
{
     marcaTiempo = new Date().getTime();
}

function crearHash()
{
    return CryptoJS.MD5(marcaTiempo + KEY_PRIVADA + KEY_PUBLICA);
}

function crearParametros()
{
    marcarTiempo();
    parametros = '';
    parametros += 'characters?limit=20&offset=' + offset + '&ts=';
    parametros += marcaTiempo;
    parametros += '&apiKey=';
    parametros += KEY_PUBLICA;
    parametros += '&hash=';
    parametros += crearHash();
    url = URL_API_MARVEL + parametros;
}

async function obtenerDatos()
{
    crearParametros();
    window.scrollTo( { top: 1, left: 1, behavior: 'smooth'} );
    let respuesta = await fetch(url);
    if (!respuesta.ok) {
        alertify.alert('¡Atencion!', 'Ocurrio algo, mira el log.');
        console.log('ESTATUS: ' + respuesta.status);
        limpiarDatos();
    }
    datos = await respuesta.json();
    pintarDatos();
}

function limpiarDatos()
{
    $("#tbodyDatos > tr").remove();
    $("#tbodyDatos").append( '<tr class="trDatos"><td>Esperando datos...</td></tr>' );
}

function pintarDatos()
{
    jsonPersonajes = datos.data.results;
    offset += jsonPersonajes.length;
    $("#tbodyDatos > tr").remove();
    if(jsonPersonajes.length > 0) {
        html = '';
        // Si hay personajes:
        for(indice=0; indice<jsonPersonajes.length; indice++) {
            objetoPersonaje = jsonPersonajes[indice];
            html += '<tr class="trDatos">';
                html += '<td>';
                    html += '<div class="card mb-3">';
                    html += '<div class="row g-0">';
                    html += '<div class="col-md-4">';
                        html += '<img src="' + (objetoPersonaje.thumbnail.path).replace("http", "http") + '.';
                        html += objetoPersonaje.thumbnail.extension + '" class="img-fluid rounded-start" alt="';
                        html += + objetoPersonaje.name + '">';
                    html += '</div>';
                    html += '<div class="col-md-8">';
                    html += '<div class"card-body">';
                    html += '<h5 id="h5_' + objetoPersonaje.id + '" class="card-title">' + objetoPersonaje.name + '</h5>';
                    objetoPersonaje.description = (objetoPersonaje.description=="")? 'No hay descripcion':objetoPersonaje.description;
                    html += '<p class="card-text">' + objetoPersonaje.description + '</p>';
                    html += '<p class="card-text"><small class="text-muted">';
                    html += objetoPersonaje.comics.available + ' Comic(s) disponible(s).<br />';
                    html += objetoPersonaje.series.available + ' Series(s) disponible(s).<br />';
                    html += objetoPersonaje.stories.available + ' Historias(s) disponible(s).<br />';
                    html += objetoPersonaje.events.available + ' Evento(s) disponible(s).';
                    html += '</small></p>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                html += '</td>';
            html += '</tr>';
        }
    } else {
        // No hay personajes: 
        html = '<tr class="trDatos"><td>NO hay datos... </td></tr>';
    }
    $("#tbodyDatos").append( html );
}

obtenerDatos().catch( error => {
    alertify.alert('¡Atencion!', 'Ocurrio un error, mira el log.');
    console.log('ERROR: ' + error.message);
    limpiarDatos();
});