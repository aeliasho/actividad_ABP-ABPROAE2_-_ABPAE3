document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const btnNuevo = document.getElementById('btn-nuevo');
    const tablaProductos = document.getElementById('tabla-productos').getElementsByTagName('tbody')[0];
    const modalForm = new bootstrap.Modal(document.getElementById('modal-form'));
    const modalConfirm = new bootstrap.Modal(document.getElementById('modal-confirm'));
    const modalTitulo = document.getElementById('modal-titulo');
    const formProducto = document.getElementById('form-producto');
    const btnAgregarEtiqueta = document.getElementById('btn-agregar-etiqueta');
    const etiquetasContainer = document.getElementById('etiquetas-container');
    const btnConfirmOk = document.getElementById('btn-confirm-ok');
    
    // Variables de estado
    let productos = [];
    let etiquetas = [];
    let productoActual = null;
    let confirmCallback = null;
    
    // Inicialización
    cargarProductos();
    inicializarEventos();
    
    function cargarProductos() {
        productos = AdminProductos.obtenerProductos();
        renderizarProductos();
    }
    
    function renderizarProductos() {
        tablaProductos.innerHTML = '';
        
        if (productos.length === 0) {
            const fila = document.createElement('tr');
            fila.innerHTML = `<td colspan="6" class="text-center py-4">No hay productos registrados</td>`;
            tablaProductos.appendChild(fila);
            return;
        }
        
        productos.forEach(producto => {
            const fila = document.createElement('tr');
            
            // Determinar badge de stock
            let badgeClass = '';
            let stockText = producto.stock;
            
            if (producto.stock <= 0) {
                badgeClass = 'bg-danger';
                stockText = 'Agotado';
            } else if (producto.stock <= 3) {
                badgeClass = 'bg-warning text-dark';
            } else {
                badgeClass = 'bg-success';
            }
            
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.desc}</td>
                <td>$${producto.precio.toLocaleString()}</td>
                <td>${producto.categoria}</td>
                <td><span class="badge ${badgeClass}">${stockText}</span></td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${producto.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${producto.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tablaProductos.appendChild(fila);
        });
    }
    
    function inicializarEventos() {
        // Botón nuevo producto
        btnNuevo.addEventListener('click', mostrarFormularioNuevo);
        
        // Eventos de la tabla (delegación)
        tablaProductos.addEventListener('click', function(e) {
            if (e.target.closest('.btn-editar')) {
                const id = e.target.closest('.btn-editar').getAttribute('data-id');
                editarProducto(id);
            }
            
            if (e.target.closest('.btn-eliminar')) {
                const id = e.target.closest('.btn-eliminar').getAttribute('data-id');
                confirmarEliminacion(id);
            }
        });
        
        // Formulario producto
        formProducto.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarProducto();
        });
        
        // Agregar etiqueta
        btnAgregarEtiqueta.addEventListener('click', agregarEtiqueta);
        
        // Confirmación de eliminación
        btnConfirmOk.addEventListener('click', function() {
            if (confirmCallback) confirmCallback();
            modalConfirm.hide();
        });
    }
    
    function mostrarFormularioNuevo() {
        productoActual = null;
        modalTitulo.textContent = 'Nuevo Producto';
        formProducto.reset();
        etiquetas = [];
        renderizarEtiquetas();
        modalForm.show();
    }
    
    function editarProducto(id) {
        productoActual = AdminProductos.obtenerProductoPorId(id);
        
        if (productoActual) {
            modalTitulo.textContent = 'Editar Producto';
            document.getElementById('producto-id').value = productoActual.id;
            document.getElementById('producto-nombre').value = productoActual.nombre;
            document.getElementById('producto-descripcion').value = productoActual.desc;
            document.getElementById('producto-precio').value = productoActual.precio;
            document.getElementById('producto-stock').value = productoActual.stock;
            document.getElementById('producto-categoria').value = productoActual.categoria;
            document.getElementById('producto-imagen').value = productoActual.img;
            
            etiquetas = productoActual.etiquetas || [];
            renderizarEtiquetas();
            
            modalForm.show();
        } else {
            alert('Producto no encontrado');
        }
    }
    
    function confirmarEliminacion(id) {
        productoActual = AdminProductos.obtenerProductoPorId(id);
        
        if (productoActual) {
            document.getElementById('confirm-message').textContent = 
                `¿Estás seguro de que deseas eliminar el producto "${productoActual.nombre}"?`;
            
            confirmCallback = function() {
                AdminProductos.eliminarProducto(productoActual.id);
                cargarProductos();
                productoActual = null;
            };
            
            modalConfirm.show();
        }
    }
    
    function guardarProducto() {
        const productoData = {
            nombre: document.getElementById('producto-nombre').value,
            desc: document.getElementById('producto-descripcion').value,
            precio: parseFloat(document.getElementById('producto-precio').value),
            stock: parseInt(document.getElementById('producto-stock').value),
            categoria: document.getElementById('producto-categoria').value,
            img: document.getElementById('producto-imagen').value,
            etiquetas: etiquetas
        };
        
        if (productoActual) {
            // Editar producto existente
            AdminProductos.actualizarProducto(productoActual.id, productoData);
        } else {
            // Crear nuevo producto
            productoData.id = generarId();
            AdminProductos.agregarProducto(productoData);
        }
        
        cargarProductos();
        modalForm.hide();
    }
    
    function agregarEtiqueta() {
        const input = document.getElementById('producto-etiqueta');
        const etiqueta = input.value.trim();
        
        if (etiqueta && !etiquetas.includes(etiqueta)) {
            etiquetas.push(etiqueta);
            renderizarEtiquetas();
            input.value = '';
            input.focus();
        }
    }
    
    function renderizarEtiquetas() {
        etiquetasContainer.innerHTML = '';
        
        etiquetas.forEach((etiqueta, index) => {
            const tag = document.createElement('div');
            tag.className = 'd-flex align-items-center gap-1 badge bg-light text-dark';
            tag.innerHTML = `
                ${etiqueta}
                <button type="button" class="btn btn-sm p-0" data-index="${index}">
                    <i class="fas fa-times text-danger"></i>
                </button>
            `;
            
            tag.querySelector('button').addEventListener('click', function() {
                etiquetas.splice(index, 1);
                renderizarEtiquetas();
            });
            
            etiquetasContainer.appendChild(tag);
        });
    }
    
    function generarId() {
        return Math.floor(Math.random() * 1000000).toString();
    }
});