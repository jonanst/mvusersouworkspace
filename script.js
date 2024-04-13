const table = document.getElementById('archivos-cargados');
const tbody = table.querySelector('tbody');

// Cargar archivos previamente cargados al iniciar la página
fetch('/archivos-cargados')
  .then(response => response.json())
  .then(data => {
    mostrarArchivos(data);
  });

// Función para mostrar archivos en la tabla
function mostrarArchivos(archivos) {
  tbody.innerHTML = '';
  archivos.forEach(archivo => {
    const fila = document.createElement('tr');
    const nombre = document.createElement('td');
    const fecha = document.createElement('td');
    const acciones = document.createElement('td');
	
    nombre.textContent = archivo.nombre;
    fecha.textContent = archivo.fecha;

    const botonDescargar = document.createElement('button');
    botonDescargar.textContent = 'Descargar';
    botonDescargar.addEventListener('click', () => {
      window.location.href = `/descargar/${archivo.nombre}`;
    });

    acciones.appendChild(botonDescargar);

    fila.appendChild(nombre);
    fila.appendChild(fecha);
    fila.appendChild(acciones);

    tbody.appendChild(fila);
  });
}

// Implementar la funcionalidad para descargar archivos (opcional)
