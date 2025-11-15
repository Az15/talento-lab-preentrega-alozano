document.addEventListener('DOMContentLoaded', () => {
    // URL del archivo JSON de productos (ajusta la ruta si es necesario)
    const PRODUCTS_URL = 'datos/productos.json'; 
    const productsContainer = document.getElementById('products-list-container');
    
    // Función para renderizar un producto como tarjeta HTML
    function renderProductCard(product) {
        
        const formattedPrice = product.price.toLocaleString('es-AR', { 
            style: 'currency', 
            currency: 'ARS',
            minimumFractionDigits: 2 
        });

        // Determinar si mostrar el descuento
        const offElement = product.off > 0 
            ? `<span class="off">${product.off}% OFF</span>`
            : ''; 

        // ESTA ESTRUCTURA DEBE COINCIDIR CON TU CSS
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
                        <button class="btn-agregar">Agregar</button>
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
                // Si el archivo no se encuentra o hay un error, lo registramos
                console.error(`Error al cargar los productos: ${response.statusText}`);
                productsContainer.innerHTML = '<p>Lo sentimos, no pudimos cargar los productos mágicos.</p>';
                return;
            }

            const products = await response.json();
            
            // Generamos el HTML para todos los productos
            const productsHtml = products.map(renderProductCard).join('');
            
            // Insertamos todo el HTML de golpe
            productsContainer.innerHTML = productsHtml;

        } catch (error) {
            console.error("Hubo un error en la solicitud o al procesar el JSON:", error);
            productsContainer.innerHTML = '<p>Error de conexión al obtener los datos de los productos.</p>';
        }
    }

    loadProducts();
});