var myHeaders = new Headers();

var token = localStorage.getItem('token');
console.log(token);

const tiempoInactividad = 120000; //2 minutos de inactividad en milisegundos

if (token) {
  let timer = setTimeout(() => {
    localStorage.removeItem('token');
    window.location.href = 'Login.html';
  }, tiempoInactividad);

  window.addEventListener('mousemove', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      localStorage.removeItem('token');
      window.location.href = 'Login.html';
    }, tiempoInactividad);

  });

} else {
  window.location.href = 'Login.html';
}

myHeaders.append("Authorization", "Bearer " + token);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://restlabingsoft-production-0999.up.railway.app/api/videos", requestOptions)
  .then(response => response.json())
  .then(result => {
    var productos = result.productos; // Todos los productos que se obtienen
    var categorias = new Set(); //Un contenedor con los nombres de las categorías
    var productosPorCategoria = {};
    

    
    for (var i = 0; i < productos.length; i++) { //Aquí guardaremos todo en variables
      var producto = productos[i];

      var id_producto = producto._id;

      var id_usuario = producto.usuario._id;
      var nombre_usuario = producto.usuario.nombre;

      var id_categoria = producto.categoria._id;
      var nombre_categoria = producto.categoria.nombre;

      if (!productosPorCategoria[nombre_categoria]) { // Si no existe el array para la categoría, se creará
        productosPorCategoria[nombre_categoria] = [];
      }
      
      productosPorCategoria[nombre_categoria].push(producto); // Añadimos el producto al array correspondiente

      categorias.add(nombre_categoria);

      var url = producto.url;
      //console.log(nombre_categoria); //Esto se usará para visualizar las variables y ver que funcionen bien
    }

    mostrarVideos(productos);
    
    //Aquí creamos un mini menú con las categorías
    var links = document.getElementById("menu"); 

    categorias.forEach(function(categoria) { 
      var enlace = document.createElement("option"); 
      enlace.textContent = categoria; 
      enlace.href = "#" + categoria; 
      enlace.value = categoria;
      links.appendChild(enlace); 
    });

    //Aquí haremos que según la categoría marcada, nos saque unos vídeos u otros

    menu.addEventListener("change", function() {
      var titulo = document.querySelector("#Videos h2");

      if (menu.value == "CATEGORÍA..."){
        var categoriaSeleccionada = "TODOS LOS VÍDEOS:";
        titulo.textContent = categoriaSeleccionada;
        var productosMostrados = productos; //Con esta opción saldrán todos los vídeos
      }else{
        var categoriaSeleccionada = "CATEGORÍA: " + menu.value;
        var productosMostrados = productosPorCategoria[menu.value];
      }

      titulo.textContent = categoriaSeleccionada; //Así cambiamos el título de la sección según la categoría seleccionada

      var videosGRID = document.querySelector("#Videos .video-grid");
      videosGRID.innerHTML = "";

      productosMostrados.forEach(function(producto){
        var videodiv = document.createElement("div"); // Creamos un contenedor individual para el video
        videodiv.classList.add("video-thumbnail");

        var linkvid = document.createElement("a");
        linkvid.href = producto.url;

        var vid = document.createElement("video");
        vid.src = producto.url;
        vid.controls = true;
        linkvid.appendChild(vid);

        var titulo = document.createElement("h3");
        titulo.textContent = producto.nombre;
        linkvid.appendChild(titulo);

        var descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion;
        linkvid.appendChild(descripcion);

        videodiv.appendChild(linkvid); // Agregamos el enlace al contenedor de video
        videosGRID.appendChild(videodiv);
      });
    });

    //Aquí para que nos muestre los vídeos por defecto

    function mostrarVideos(productosMostrados) {
      var titulo = document.querySelector("#Videos h2");
      titulo.textContent = "TODOS LOS VÍDEOS:";
    
      var videosGRID = document.querySelector("#Videos .video-grid");
      videosGRID.innerHTML = "";
    
      productosMostrados.forEach(function(producto){
        var videodiv = document.createElement("div"); // Creamos un contenedor individual para el video
        videodiv.classList.add("video-thumbnail");
    
        var linkvid = document.createElement("a");
        linkvid.href = producto.url;
    
        var vid = document.createElement("video");
        vid.src = producto.url;
        vid.controls = true;
        linkvid.appendChild(vid);
    
        var titulo = document.createElement("h3");
        titulo.textContent = producto.nombre;
        linkvid.appendChild(titulo);
    
        var descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion;
        linkvid.appendChild(descripcion);
    
        videodiv.appendChild(linkvid); // Agregamos el enlace al contenedor de video
        videosGRID.appendChild(videodiv);
      });
    }
    

  })
  .catch(error => console.log('error', error));

  document.addEventListener("DOMContentLoaded", function(){ //Para que esto se ejecute cuando la página termine de cargarse
    const logoutLink = document.querySelector('#LogOut-button');

    logoutLink.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'Login.html';
    });
  });
  