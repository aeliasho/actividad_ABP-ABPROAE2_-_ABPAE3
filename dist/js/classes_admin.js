class AdminProductos {
    static obtenerProductos() {
        const productosGuardados = JSON.parse(localStorage.getItem('productos'));
        
        // Si hay productos guardados, devolver esos
        if (productosGuardados && productosGuardados.length > 0) {
            return productosGuardados;
        }
        
        // Si no hay productos guardados, cargar los iniciales
        const productosIniciales = [
            {
                "id": "95843",
                "img": "../src/img/productos/audifonos-inalambricos-1.jpg",
                "nombre": "Audífonos Bluetooth",
                "desc": "Audífonos de alta calidad, ideales para actividades al aire libre con conexión inalámbrica.",
                "precio": 19990,
                "stock": 10,
                "categoria": "audio",
                "etiquetas": ["inalámbrico", "portátil", "música", "bluetooth"]
            },
            {
                "id": "42518",
                "img": "../src/img/productos/audifonos-compactos.jpg",
                "nombre": "Audífonos Bluetooth Compactos",
                "desc": "Libertad de movimiento con sonido envolvente.",
                "precio": 24990,
                "stock": 5,
                "categoria": "audio",
                "etiquetas": ["compacto", "bluetooth", "música", "liviano"]
            },
            {
                "id": "95482",
                "img": "../src/img/productos/mouse-rgb.jpg",
                "nombre": "Mouse RGB",
                "desc": "Mouse con iluminación RGB, perfecto para gaming y trabajo.",
                "precio": 22990,
                "stock": 3,
                "categoria": "computación",
                "etiquetas": ["gaming", "rgb", "ergonómico", "precisión"]
            },
            {
                "id": "13248",
                "img": "../src/img/productos/teclado-rgb-1.jpg",
                "nombre": "Teclado Mecánico RGB",
                "desc": "Teclado mecánico ideal para oficina y gaming con retroiluminación.",
                "precio": 25990,
                "stock": 1,
                "categoria": "computación",
                "etiquetas": ["mecánico", "rgb", "gaming", "retroiluminado"]
            },
            {
                "id": "68421",
                "img": "../src/img/productos/cargador-inalambrico.jpg",
                "nombre": "Cargador Inalámbrico",
                "desc": "Carga rápida y cómoda para tus dispositivos.",
                "precio": 14990,
                "stock": 0,
                "categoria": "accesorios",
                "etiquetas": ["inalámbrico", "carga rápida", "universal", "compacto"]
            },
            {
                "id": "94871",
                "img": "../src/img/productos/drone-compacto.jpg",
                "nombre": "Drone Compacto",
                "desc": "Drone de fotografía aérea fácil de manejar y con buena autonomía.",
                "precio": 119990,
                "stock": 2,
                "categoria": "drones",
                "etiquetas": ["fotografía", "aéreo", "compacto", "4K"]
            },
            {
                "id": "32457",
                "img": "../src/img/productos/audifonos-inalambricos-2.jpg",
                "nombre": "Audífonos Inalámbricos Pro",
                "desc": "Sonido de alta fidelidad para disfrutar música en cualquier lugar.",
                "precio": 79990,
                "stock": 4,
                "categoria": "audio",
                "etiquetas": ["premium", "cancelación de ruido", "bluetooth", "alta fidelidad"]
            },
            {
                "id": "64847",
                "img": "../src/img/productos/monitor-full-led-hd.jpg",
                "nombre": "Monitor LED Full HD",
                "desc": "Pantalla con imágenes nítidas y claras para trabajo o entretenimiento.",
                "precio": 149990,
                "stock": 7,
                "categoria": "computación",
                "etiquetas": ["monitor", "full HD", "27 pulgadas", "panel IPS"]
            },
            {
                "id": "14935",
                "img": "../src/img/productos/mouse-rgb-inalambrico.jpg",
                "nombre": "Mouse Inalámbrico",
                "desc": "Precisión y comodidad para tus tareas diarias.",
                "precio": 19990,
                "stock": 0,
                "categoria": "computación",
                "etiquetas": ["inalámbrico", "ergonómico", "batería larga duración", "precisión"]
            },
            {
                "id": "14847",
                "img": "../src/img/productos/tablet.jpg",
                "nombre": "Tablet 10 pulgadas",
                "desc": "Ideal para estudiar, trabajar o entretenerse en cualquier lugar.",
                "precio": 87990,
                "stock": 3,
                "categoria": "tablets",
                "etiquetas": ["android", "10 pulgadas", "multitarea", "portátil"]
            },
            {
                "id": "96148",
                "img": "../src/img/productos/auriculares-gaming.jpg",
                "nombre": "Auriculares Gaming",
                "desc": "Sumérgete en tus juegos con sonido envolvente y micrófono integrado.",
                "precio": 59990,
                "stock": 1,
                "categoria": "gaming",
                "etiquetas": ["7.1 surround", "micrófono", "iluminación RGB", "almohadillas ergonómicas"]
            },
            {
                "id": "36485",
                "img": "../src/img/productos/camara-web-hd.jpg",
                "nombre": "Cámara Web HD",
                "desc": "Videollamadas con calidad de imagen clara y nítida.",
                "precio": 29990,
                "stock": 5,
                "categoria": "accesorios",
                "etiquetas": ["1080p", "micrófono integrado", "tripode incluido", "enfoque automático"]
            }
        ];
        
        localStorage.setItem('productos', JSON.stringify(productosIniciales));
        return productosIniciales;
    }

    static guardarProductos(productos) {
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    static agregarProducto(producto) {
        const productos = this.obtenerProductos();
        productos.push(producto);
        this.guardarProductos(productos);
        return producto;
    }

    static actualizarProducto(id, datosActualizados) {
        const productos = this.obtenerProductos();
        const index = productos.findIndex(p => p.id === id);
        
        if (index !== -1) {
            productos[index] = { ...productos[index], ...datosActualizados };
            this.guardarProductos(productos);
            return true;
        }
        return false;
    }

    static eliminarProducto(id) {
        const productos = this.obtenerProductos();
        const nuevosProductos = productos.filter(p => p.id !== id);
        this.guardarProductos(nuevosProductos);
        return productos.length !== nuevosProductos.length;
    }

    static obtenerProductoPorId(id) {
        const productos = this.obtenerProductos();
        return productos.find(p => p.id === id);
    }
}

// Las otras clases se mantienen igual
class Producto {
    constructor({ id, nombre, desc, precio, stock, categoria, etiquetas = [], img }) {
        this.id = id;
        this.nombre = nombre;
        this.desc = desc;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
        this.etiquetas = etiquetas;
        this.img = img;
    }

    estaDisponible(cantidad = 1) {
        return this.stock >= cantidad;
    }

    reducirStock(cantidad) {
        if (this.estaDisponible(cantidad)) {
            this.stock -= cantidad;
            return true;
        }
        return false;
    }
}

class Catalogo {
    constructor(productos = []) {
        this.productos = productos.map(p => new Producto(p));
    }

    filtrar({ termino = '', categoria = '', precioMax = Infinity }) {
        return this.productos.filter(producto => {
            const cumpleCategoria = !categoria || producto.categoria === categoria;
            const cumplePrecio = producto.precio <= precioMax;
            const cumpleTermino = !termino || this._coincideConTermino(producto, termino);
            return cumpleCategoria && cumplePrecio && cumpleTermino;
        });
    }

    _coincideConTermino(producto, termino) {
        const textoBusqueda = termino.toLowerCase();
        return (
            producto.nombre.toLowerCase().includes(textoBusqueda) ||
            producto.desc.toLowerCase().includes(textoBusqueda) ||
            producto.categoria.toLowerCase().includes(textoBusqueda) ||
            producto.etiquetas.some(etiqueta => etiqueta.toLowerCase().includes(textoBusqueda))
        );
    }

    getCategorias() {
        return [...new Set(this.productos.map(p => p.categoria))];
    }
}

class Carrito {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('carrito')) || [];
    }

    agregarItem(producto, cantidad) {
        const itemExistente = this.items.find(item => item.id === producto.id);
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            this.items.push({ ...producto, cantidad });
        }
        this._guardar();
    }

    eliminarItem(index) {
        this.items.splice(index, 1);
        this._guardar();
    }

    vaciar() {
        this.items = [];
        this._guardar();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    _guardar() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }
}