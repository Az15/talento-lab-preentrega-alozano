document.addEventListener('DOMContentLoaded', () => {
    // URL del archivo JSON de productos (ajusta la ruta si es necesario)
    const PRODUCTS_URL = 'datos/productos.json'; 
    const productsContainer = document.getElementById('products-list-container');
    const cartCounter = document.getElementById('cart-counter'); // Elemento para el contador del carrito

    // --- FUNCIONES DEL CARRITO (NUEVO) ---

    // 1. Cargar el carrito desde localStorage
    function getCart() {
        const cart = localStorage.getItem('shoppingCart');
        // Si no hay carrito, devuelve un array vacío
        return cart ? JSON.parse(cart) : []; 
    }

    // 2. Guardar el carrito en localStorage
    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartCounter();
    }

    // 3. Actualizar el contador visual en el menú
    function updateCartCounter() {
        const cart = getCart();
        // Sumamos la cantidad de todos los productos en el carrito
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCounter) {
            cartCounter.textContent = totalItems.toString();
        }
    }

    // 4. Agregar un producto al carrito
    function addToCart(product) {
        const cart = getCart();
        // Buscamos si el producto ya existe
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            // Si existe, aumentamos la cantidad
            existingItem.quantity += 1;
        } else {
            // Si no existe, lo añadimos con cantidad 1
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        alert(`"${product.name}" añadido al carrito!`);
        saveCart(cart);
    }
    
    // Función para renderizar un producto como tarjeta HTML
    function renderProductCard(product) {
        // Aseguramos que cada producto tenga un ID único para el carrito
        product.id = product.id || product.name.replace(/\s/g, '-').toLowerCase();

        const formattedPrice = product.price.toLocaleString('es-AR', { 
            style: 'currency', 
            currency: 'ARS',
            minimumFractionDigits: 2 
        });

        // Determinar si mostrar el descuento
        const offElement = product.off > 0 
            ? `<span class="off">${product.off}% OFF</span>`
            : ''; 

        // Agregamos un atributo 'data-product' con el JSON stringificado del producto
        return `
            <div class="prod-item">
                <div class="item-tit">
                    ${product.name}
                </div>
                <div class="item-img">
                    <img class="imagen-card" src="${product.image}" alt="Imagen de ${product.name}">
                </div>
                <div class="datos">
                    <span class="precio">${formattedPrice}</span>
                    ${offElement}
                    <div class="descripcion">
                        ${product.description}
                    </div>
                    <div class="botonera">
                        <button class="btn-agregar" data-product='${JSON.stringify(product)}'>Agregar</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Función principal para cargar y mostrar los productos
    async function loadProducts() {
        try {
            const response = await fetch(PRODUCTS_URL);
            
            if (!response.ok) {
                console.error(`Error al cargar los productos: ${response.statusText}`);
                productsContainer.innerHTML = '<p>Lo sentimos, no pudimos cargar los productos mágicos.</p>';
                return;
            }

            const products = await response.json();
            
            // Generamos el HTML para todos los productos
            const productsHtml = products.map(renderProductCard).join('');
            
            productsContainer.innerHTML = productsHtml;
            
            // 5. Asignar Event Listeners a los nuevos botones "Agregar"
            document.querySelectorAll('.btn-agregar').forEach(button => {
                button.addEventListener('click', (e) => {
                    // Obtenemos los datos del producto del atributo data-product
                    const productData = JSON.parse(e.currentTarget.getAttribute('data-product'));
                    addToCart(productData);
                });
            });

        } catch (error) {
            console.error("Hubo un error en la solicitud o al procesar el JSON:", error);
            productsContainer.innerHTML = '<p>Error de conexión al obtener los datos de los productos.</p>';
        }
    }

    // --- Lógica del Formulario de Contacto y Validación (Tu código anterior) ---

    const formulario = document.querySelector('.formulario');
    const nombreInput = document.getElementById('nombre');
    const mailInput = document.getElementById('mail');
    const mensajeTextarea = document.getElementById('mensaje');

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        return regex.test(email);
    }

    if (formulario) {
        formulario.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const nombre = nombreInput.value.trim();
            const mail = mailInput.value.trim();
            const mensaje = mensajeTextarea.value.trim();

            if (!nombre) {
                alert('❌ Por favor, ingresa tu nombre.');
                nombreInput.focus();
                return;
            }

            if (!mail || !isValidEmail(mail)) {
                alert('❌ Por favor, ingresa un email válido.');
                mailInput.focus();
                return;
            }
            
            if (!mensaje) {
                alert('❌ Por favor, ingresa tu mensaje.');
                mensajeTextarea.focus();
                return;
            }
            
            alert('✅ ¡Validación Exitosa! El formulario está listo para ser enviado.');
            formulario.reset(); 
        });
    }

    // --- Inicialización ---

    // 1. Cargar productos y asignar listeners
    loadProducts();
    
    // 2. Inicializar el contador al cargar la página
    updateCartCounter();
});