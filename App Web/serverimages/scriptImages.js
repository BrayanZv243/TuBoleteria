const URI = 'http://localhost:3000/api/images/';
const rutaImagenesServer = './images/'

function subirImagen(){
    const uploadForm = document.getElementById('uploadForm');
    const messageDiv = document.getElementById('message');

    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(uploadForm);

        fetch(URI, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageDiv.textContent = 'Imagen subida con éxito';
                    uploadForm.reset();
                } else {
                    alert("No puedes subir una imagen con el mismo nombre")
                }
            })
            .catch(error => {
                messageDiv.textContent = 'Error de red: ' + error.message;
            });
    });
}

function obtenerImgsPorNombre(){
    const imagenMostrada = document.getElementById('imagenMostrada');
    const URI = 'http://localhost:3000'
    // Nombre del archivo de la imagen que deseas mostrar
    const nombreArchivo = 'Captura.PNG'; // Reemplaza con el nombre correcto

    // Ruta de la API para obtener la imagen por nombre
    const apiUrl = `/api/images/${nombreArchivo}`;

    fetch(URI + apiUrl)
        .then(response => {
            if (response.ok) {
                // La solicitud fue exitosa, establece la imagen como fuente

                imagenMostrada.src = rutaImagenesServer + nombreArchivo;
            } else {
                // En caso de error, muestra un mensaje o realiza otra acción
                console.log(response)
                console.error('Error al obtener la imagen.');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
}

function obtenerImgs() {
    fetch(URI)
        .then(response => response.json())
        .then(data => {
            const imageGallery = document.getElementById('imageGallery');
            data.images.forEach(image => {
                const form = document.createElement('form');
                form.enctype = 'multipart/form-data';

                const img = document.createElement('img');
                img.src = rutaImagenesServer + image;
                img.alt = image;
                img.style.height = '200px';
                img.style.width = '200px';

                const newImageInput = document.createElement('input');
                newImageInput.type = 'file';
                newImageInput.name = 'file';
                newImageInput.accept = 'image/*';

                const updateButton = document.createElement('button');
                updateButton.innerText = 'Actualizar';

                // Agregar un manejador de eventos al botón "Actualizar"
                updateButton.addEventListener('click', () => {
                    event.preventDefault();
                    actualizarImagen(form, image);
                });

                form.appendChild(img);
                form.appendChild(newImageInput);
                form.appendChild(updateButton);
                imageGallery.appendChild(form);
                
            });
        })
        .catch(error => console.error('Error al obtener la lista de imágenes:', error));
}

function actualizarImagen(form, nombreArchivo) {
    // Obtén el archivo seleccionado por el usuario desde el formulario
    const newImageFile = form.querySelector('input[type="file"]').files[0];
    if (newImageFile) {
        const formData = new FormData();
        formData.append('image', newImageFile);
        fetch(URI + nombreArchivo, {
            method: 'PUT',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                // Puedes mostrar un mensaje de éxito o realizar otras acciones necesarias
            })
            .catch(error => console.error('Error al actualizar la imagen:', error));
    } else {
        alert('Por favor, seleccione una nueva imagen antes de actualizar.');
    }
}

obtenerImgs();

// Agregar un manejador de eventos al botón "Subir"
const subirBoton = uploadForm.querySelector('button[type="submit"]');
subirBoton.addEventListener('click', (e) => {
    subirImagen(); // Llama a la función subirImagen
});