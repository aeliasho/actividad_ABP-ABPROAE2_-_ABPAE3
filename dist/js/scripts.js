
let catalogo;
let carrito;

document.addEventListener("DOMContentLoaded", async function () {
  
  function verificarYMostrarUsuario() {
    const sesion = localStorage.getItem('sesionActiva') || sessionStorage.getItem('sesionActiva');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (sesion) {
      const usuario = JSON.parse(sesion);
      const navbar = document.querySelector('.navbar .container');
      const navbarBrand = navbar.querySelector('.navbar-brand');
      
      let welcomeElement = document.getElementById('welcomeUser');
      if (!welcomeElement) {
        welcomeElement = document.createElement('span');
        welcomeElement.id = 'welcomeUser';
        welcomeElement.className = 'navbar-text ms-3';
        welcomeElement.style.color = '#0D3B66';
        welcomeElement.style.fontWeight = '600';
        welcomeElement.innerHTML = `¡Bienvenido, ${usuario.nombre}!`;
        navbarBrand.parentNode.insertBefore(welcomeElement, navbarBrand.nextSibling);
      }
      
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else if (logoutBtn) {
      logoutBtn.style.display = 'none';
    }
  }
  
  
  function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    sessionStorage.removeItem('sesionActiva');
    window.location.href = '../index.html';
  }
  
  verificarYMostrarUsuario();
  
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', cerrarSesion);
  
 
  const subscriptionForm = document.getElementById("subscriptionForm");
  const alertContainer = document.getElementById("alertContainer");
  if (subscriptionForm) {
    subscriptionForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
          <strong>¡Gracias por suscribirte!</strong> Te mantendremos informado sobre nuestras promociones y ofertas.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>`;
      subscriptionForm.reset();
      setTimeout(() => {
        bootstrap.Alert.getOrCreateInstance(document.querySelector(".alert")).close();
      }, 3000);
    });
  }

  
  const contactForm = document.getElementById("contactForm");
  const contactAlertContainer = document.getElementById("contactAlertContainer");
  if (contactForm && contactAlertContainer) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactAlertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
          <strong>¡Gracias por escribirnos!</strong> Nos pondremos en contacto contigo a la brevedad posible.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>`;
      contactForm.reset();
      setTimeout(() => {
        bootstrap.Alert.getOrCreateInstance(contactAlertContainer.querySelector(".alert")).close();
      }, 3000);
    });
  }

 
  const abrirCarritoBtn = document.getElementById("abrirCarrito");
  const cerrarCarritoBtn = document.getElementById("cerrarCarrito");
  const carritoSidebar = document.getElementById("carritoSidebar");
  const carritoItemsContainer = document.getElementById("carritoItems");
  const realizarPedidoBtn = document.getElementById("realizarPedidoBtn");
  const formularioPedidoContainer = document.getElementById("formularioPedidoContainer");
  const formularioPedido = document.getElementById("formularioPedido");
  const overlayCarrito = document.getElementById("overlayCarrito");
  const carritoNotificacion = document.getElementById("carritoNotificacion");

  
  try {
    const datos = await AdminProductos.obtenerProductos();
    catalogo = new Catalogo(datos);
    carrito = new Carrito();
    
   
    initFiltros();
    renderizarProductos();
    actualizarCarritoUI();
  } catch (error) {
    console.error("Error al cargar productos:", error);
    document.getElementById("productosGrid").innerHTML = `
      <div class="col-12 text-center">
        <p class="text-danger">Error al cargar los productos. Inténtalo nuevamente más tarde.</p>
      </div>`;
  }

  
  function actualizarCarritoUI() {
    carritoItemsContainer.innerHTML = "";
    const vaciarBtn = document.getElementById('vaciarCarritoBtn');

    if (carrito.items.length === 0) {
      carritoItemsContainer.innerHTML = '<p class="text-muted">Tu carrito está vacío.</p>';
      if (vaciarBtn) vaciarBtn.style.display = 'none';
    } else {
      if (vaciarBtn) vaciarBtn.style.display = 'block';
      
      let total = 0;
      carrito.items.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        const div = document.createElement("div");
        div.classList.add("d-flex", "align-items-center", "mb-2", "gap-2", "justify-content-between");
        div.innerHTML = `
          <img src="${item.img}" alt="${item.nombre}" width="50" height="50" style="object-fit: cover;">
          <div class="flex-grow-1 ms-2">
            <p class="mb-0">${item.nombre}</p>
            <small>Cantidad: ${item.cantidad}</small><br>
            <small>Subtotal: $${subtotal.toLocaleString("es-CL")}</small>
          </div>
          <button class="btn btn-sm btn-danger" data-index="${index}">&times;</button>
        `;
        carritoItemsContainer.appendChild(div);
      });

      const totalDiv = document.createElement("div");
      totalDiv.classList.add("mt-3", "fw-bold", "text-end");
      totalDiv.textContent = `Total: $${total.toLocaleString("es-CL")}`;
      carritoItemsContainer.appendChild(totalDiv);
    }

   
    const totalItems = carrito.items.reduce((total, item) => total + item.cantidad, 0);
    carritoNotificacion.textContent = totalItems;
    carritoNotificacion.style.display = totalItems > 0 ? "flex" : "none";
  }

  function vaciarCarrito() {
    if (confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
      carrito.vaciar();
      actualizarCarritoUI();
    }
  }

  function cerrarCarrito() {
    carritoSidebar.classList.remove("abierto");
    overlayCarrito.classList.remove("activo");
    formularioPedidoContainer.style.display = "none";
  }

  
  abrirCarritoBtn?.addEventListener("click", () => {
    carritoSidebar.classList.add("abierto");
    overlayCarrito.classList.add("activo");
    actualizarCarritoUI();
  });

  cerrarCarritoBtn?.addEventListener("click", cerrarCarrito);
  overlayCarrito?.addEventListener("click", cerrarCarrito);

  carritoItemsContainer?.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const index = e.target.getAttribute("data-index");
      carrito.eliminarItem(index);
      actualizarCarritoUI();
    }
  });

  realizarPedidoBtn?.addEventListener("click", () => {
    if (carrito.items.length === 0) {
      alert("Tu carrito está vacío. Agrega productos antes de realizar un pedido.");
      return;
    }
    formularioPedidoContainer.style.display = formularioPedidoContainer.style.display === "none" ? "block" : "none";
  });

  document.getElementById('vaciarCarritoBtn')?.addEventListener('click', vaciarCarrito);

  formularioPedido?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    try {
     
      for (const item of carrito.items) {
        const producto = catalogo.productos.find(p => p.id === item.id);
        if (producto) {
          await AdminProductos.actualizarStock(producto.id, item.cantidad);
          producto.reducirStock(item.cantidad);
          
         
          if (producto.stock < 3) {
            await AdminProductos.notificarResponsable(producto, item.cantidad);
          }
        }
      }
      
      alert("¡Pedido realizado!, te daremos seguimiento a través de tu correo.");
      formularioPedido.reset();
      formularioPedidoContainer.style.display = "none";
      carrito.vaciar();
      actualizarCarritoUI();
      renderizarProductos();
      cerrarCarrito();
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Ocurrió un error al procesar tu pedido. Por favor, intenta nuevamente.");
    }
  });

  
  function initFiltros() {
    
    const select = document.getElementById('filtroCategoria');
    catalogo.getCategorias().forEach(categoria => {
      const option = document.createElement('option');
      option.value = categoria;
      option.textContent = categoria;
      select.appendChild(option);
    });

   
    document.getElementById('filtroProductos').addEventListener('input', aplicarFiltros);
    document.getElementById('filtroCategoria').addEventListener('change', aplicarFiltros);
    document.getElementById('rangoPrecio').addEventListener('input', function() {
      document.getElementById('valorPrecio').textContent = this.value.toLocaleString('es-CL');
      aplicarFiltros();
    });
  }

  function aplicarFiltros() {
    const termino = document.getElementById('filtroProductos').value;
    const categoria = document.getElementById('filtroCategoria').value;
    const precioMax = document.getElementById('rangoPrecio').value;

    const productosFiltrados = catalogo.filtrar({
      termino,
      categoria,
      precioMax: parseInt(precioMax)
    });

    renderizarProductos(productosFiltrados);
  }

  function renderizarProductos(productos = catalogo.productos) {
    const grid = document.getElementById('productosGrid');
    grid.innerHTML = '';

    if (productos.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center">
          <p class="h4 text-muted">No se encontraron productos con los filtros aplicados.</p>
        </div>`;
      return;
    }

    productos.forEach(producto => {
      let stockMessage = '';
      let isDisabled = false;
      
      if (producto.stock === 0) {
        stockMessage = '<p class="text-danger small mb-2"><strong>AGOTADO</strong></p>';
        isDisabled = true;
      } else if (producto.stock === 1) {
        stockMessage = '<p class="text-warning small mb-2"><strong>ÚLTIMO PRODUCTO!</strong></p>';
      } else if (producto.stock < 4) {
        stockMessage = `<p class="text-warning small mb-2"><strong>Quedan solo ${producto.stock} unidades!</strong></p>`;
      }

      const card = document.createElement('div');
      card.className = 'col-md-4 mb-3';
      card.innerHTML = `
        <div class="card h-100">
          <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${producto.nombre}</h5>
            <div class="mb-2">
              ${producto.etiquetas.map(etiqueta => `<span class="badge bg-secondary me-1">${etiqueta}</span>`).join('')}
            </div>
            ${stockMessage}
            <p class="card-text">${producto.desc}</p>
            <p class="card-text fw-bold text-primary">$${producto.precio.toLocaleString("es-CL")}</p>
            <button class="btn btn-primary mt-auto comprar-btn" data-id="${producto.id}" ${isDisabled ? 'disabled' : ''}>
              ${isDisabled ? 'Agotado' : 'Comprar'}
            </button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  
  const darkModeToggle = document.getElementById("darkModeToggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  if (localStorage.getItem("dark-mode") === "enabled" || (!localStorage.getItem("dark-mode") && prefersDarkScheme.matches)) {
    document.body.classList.add("dark-mode");
  }

  darkModeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
  });

  
  requestAnimationFrame(() => {
    document.body.classList.add("fade-in");
    setTimeout(() => document.body.classList.add("animation-complete"), 500);
  });

  const main = document.querySelector("main");
  if (main) main.classList.add("fade-in");
});


document.addEventListener("click", async (e) => {
  if (e.target.classList.contains('comprar-btn') && !e.target.disabled) {
    e.preventDefault();
    const id = e.target.dataset.id;
    const producto = catalogo.productos.find(p => p.id === id);
    
    if (!producto) return;

    const cantidad = parseInt(prompt(`¿Cuántas unidades deseas agregar? (Stock disponible: ${producto.stock})`, "1"));
    
    if (isNaN(cantidad) || cantidad <= 0) {
      alert("Cantidad inválida. Debe ser un número mayor que cero.");
      return;
    }
    
    
    const disponible = await producto.verificarDisponibilidad(cantidad);
    
    if (!disponible) {
      alert(`No hay suficiente stock. Solo quedan ${producto.stock} unidades disponibles.`);
      return;
    }

    try {
     
      await AdminProductos.actualizarStock(producto.id, cantidad);
      
      
      carrito.agregarItem(producto, cantidad);
      producto.reducirStock(cantidad);
    
      if (producto.stock < 3) {
        await AdminProductos.notificarResponsable(producto, cantidad);
      }
      
     
      const btn = e.target;
      btn.textContent = "✓ Agregado";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = producto.stock > 0 ? 'Comprar' : 'Agotado';
        if (producto.stock <= 0) btn.disabled = true;
      }, 1500);

      
      if (document.getElementById("carritoSidebar").classList.contains("abierto")) {
        actualizarCarritoUI();
      }
      
     
      const carritoNotificacion = document.getElementById("carritoNotificacion");
      const totalItems = carrito.items.reduce((total, item) => total + item.cantidad, 0);
      carritoNotificacion.textContent = totalItems;
      carritoNotificacion.style.display = totalItems > 0 ? "flex" : "none";
      
    } catch (error) {
      console.error("Error en el proceso de compra:", error);
      alert("Ocurrió un error al procesar tu compra. Por favor, intenta nuevamente.");
    }
  }
});