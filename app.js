const normalizar = (texto) => texto
  .toLocaleLowerCase('es')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]/g, '');

document.querySelector('#palindrome-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const original = document.querySelector('#palindrome-input').value;
  const texto = normalizar(original);
  const invertido = [...texto].reverse().join('');
  document.querySelector('#palindrome-result').textContent = texto === invertido
    ? `“${original}” sí es un palíndromo.`
    : `“${original}” no es un palíndromo.`;
});

document.querySelector('#compare-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const a = Number(document.querySelector('#number-a').value);
  const b = Number(document.querySelector('#number-b').value);
  let mensaje = a > b ? `${a} es el mayor.` : b > a ? `${b} es el mayor.` : 'Los dos números son iguales.';
  document.querySelector('#compare-result').textContent = mensaje;
});

document.querySelector('#vowels-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const frase = document.querySelector('#vowels-input').value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const vocales = ['a', 'e', 'i', 'o', 'u'];
  const conteo = Object.fromEntries(vocales.map((vocal) => [vocal, [...frase].filter((letra) => letra === vocal).length]));
  const aparecen = vocales.filter((vocal) => conteo[vocal] > 0);
  document.querySelector('#vowels-result').textContent = aparecen.length
    ? `Vocales que aparecen: ${aparecen.join(', ')}.`
    : 'No hay vocales en esta frase.';
  document.querySelector('#vowels-count-result').textContent = `Recuento: ${vocales.map((vocal) => `${vocal}: ${conteo[vocal]}`).join(' · ')}.`;
});

const urlInput = document.querySelector('#url-input');
const estados = document.querySelector('#request-states');
const estadoHTTP = document.querySelector('#http-status');
const cabeceras = document.querySelector('#response-headers');
const contenido = document.querySelector('#response-content');
const boton = document.querySelector('#fetch-button');

urlInput.value = window.location.href;

function actualizarEstado(texto) {
  const elemento = document.createElement('li');
  elemento.textContent = texto;
  estados.querySelectorAll('.current').forEach((item) => item.classList.remove('current'));
  elemento.classList.add('current');
  estados.append(elemento);
}

document.querySelector('#ajax-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const url = urlInput.value.trim();
  estados.replaceChildren();
  estadoHTTP.textContent = 'Esperando respuesta…';
  estadoHTTP.classList.remove('placeholder');
  cabeceras.textContent = 'Esperando respuesta…';
  contenido.textContent = 'Esperando respuesta…';
  cabeceras.classList.remove('placeholder');
  contenido.classList.remove('placeholder');
  boton.disabled = true;
  actualizarEstado('Petición iniciada');

  const peticion = new XMLHttpRequest();
  peticion.open('GET', url, true);
  peticion.onreadystatechange = () => {
    const nombres = { 1: 'Conexión establecida', 2: 'Cabeceras recibidas', 3: 'Cargando contenido', 4: 'Petición completada' };
    if (nombres[peticion.readyState]) actualizarEstado(nombres[peticion.readyState]);
  };
  peticion.onload = () => {
    estadoHTTP.textContent = `${peticion.status} ${peticion.statusText || '(sin texto de estado)'}`;
    cabeceras.textContent = peticion.getAllResponseHeaders() || 'El servidor no envió cabeceras legibles.';
    contenido.textContent = peticion.responseText || '(La respuesta no contiene texto.)';
    boton.disabled = false;
  };
  peticion.onerror = () => {
    estadoHTTP.textContent = 'No se pudo leer la respuesta.';
    cabeceras.textContent = 'El navegador no pudo acceder a las cabeceras.';
    contenido.textContent = 'La petición falló. Comprueba la URL, tu conexión o si el servidor permite solicitudes CORS desde esta página.';
    actualizarEstado('Error de red o bloqueo CORS');
    boton.disabled = false;
  };
  peticion.onabort = () => { actualizarEstado('Petición cancelada'); boton.disabled = false; };
  peticion.ontimeout = () => { actualizarEstado('Tiempo de espera agotado'); boton.disabled = false; };
  peticion.timeout = 15000;
  peticion.send();
});

