document.addEventListener('DOMContentLoaded', () => {

    // Aseguramos que los elementos existan antes de intentar usarlos
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCounter = document.getElementById('cart-counter');
    const btnCheckout = document.getElementById('btn-checkout'); // Nuevo
    const checkoutModal = document.getElementById('checkout-modal'); // Nuevo
    const contactForm = document.getElementById('contact-form'); // Nuevo
    const submissionMessage = document.getElementById('submission-message'); // Nuevo

    // Función para formatear precios con la moneda ARS
    function formatCurrency(amount) {
        return amount.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        });
    }

    // --- FUNCIONES DE UTILIDAD Y ALMACENAMIENTO ---

    function getCart() {
        try {
            const cart = localStorage.getItem('shoppingCart');
            // Si el JSON es corrupto o null, devuelve array vacío
            return cart ? JSON.parse(cart) : [];
        } catch (e) {
            console.error("Error al parsear el carrito de localStorage:", e);
            return []; // Devuelve array vacío en caso de error
        }
    }

    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        renderCart(); // Vuelve a renderizar el carrito cada vez que se guarda
        updateCartCounter();
    }
    
    // Función NUEVA para vaciar el carrito
    function clearCart() {
        localStorage.removeItem('shoppingCart');
        saveCart([]); // Llama a saveCart para renderizar el carrito vacío y actualizar el contador
    }

    function updateCartCounter() {
        const cart = getCart();
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCounter) {
            cartCounter.textContent = totalItems.toString();
        }
    }

    // --- GESTIÓN DE ACCIONES DEL CARRITO ---

    // Maneja los botones de cantidad y eliminar
    function handleCartAction(productId, action) {
        let cart = getCart();
        
        // Uso de 'toString()' para asegurar la comparación si los IDs son de diferente tipo
        const itemIndex = cart.findIndex(item => item.id.toString() === productId); 
        
        if (itemIndex > -1) {
            const item = cart[itemIndex];

            if (action === 'increment') {
                item.quantity += 1;
            } else if (action === 'decrement') {
                item.quantity -= 1;
                // Si la cantidad llega a 0, lo eliminamos
                if (item.quantity < 1) {
                    cart.splice(itemIndex, 1);
                }
            } else if (action === 'remove') {
                // Eliminar completamente el producto
                cart.splice(itemIndex, 1);
            }
            
            // Guardamos el nuevo estado del carrito y volvemos a renderizar
            saveCart(cart);
        }
    }
    
    // --- GESTIÓN DEL MODAL/CHECKOUT ---
    
    function openModal() {
        if (checkoutModal) {
            checkoutModal.classList.add('active');
            checkoutModal.style.display = 'flex'; // Muestra el modal
        }
    }

    function closeModal() {
        if (checkoutModal) {
            checkoutModal.classList.remove('active');
            // Retrasar la ocultación para permitir la animación de cierre
            setTimeout(() => {
                checkoutModal.style.display = 'none';
                // Resetear el mensaje de confirmación
                submissionMessage.style.display = 'none';
                contactForm.reset();
            }, 300);
        }
    }

    function handleCheckout() {
        const cart = getCart();
        if (cart.length === 0) {
            alert('¡No puedes finalizar la compra con el carrito vacío!');
            return;
        }

        // 1. Mostrar el modal de confirmación
        openModal();

        // 2. Limpiar el carrito (se hace después de enviar el formulario en este flujo)
        // **OPCIONAL:** Si quieres que se vacíe al hacer click en "Finalizar Compra"
        // y antes de pedir el teléfono, descomenta la siguiente línea:
        // clearCart(); 
    }
    
    // Manejar el envío del formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phoneNumber = document.getElementById('user-phone').value;
            
            // Aquí iría la lógica para enviar los datos del pedido y el teléfono
            console.log(`Pedido finalizado. Teléfono de contacto: ${phoneNumber}`);
            
            // Simular el éxito del envío:
            
            // VACIAR EL CARRITO al CONFIRMAR el contacto
            clearCart(); 
            
            // Mostrar mensaje de éxito
            if (submissionMessage) {
                submissionMessage.textContent = `¡Datos enviados con éxito! Te contactaremos al ${phoneNumber}.`;
                submissionMessage.style.display = 'block';
            }
            
            // Deshabilitar el formulario después del envío (opcional)
            contactForm.querySelector('#user-phone').disabled = true;
            contactForm.querySelector('#btn-send-contact').disabled = true;

            // Opcional: Cerrar el modal automáticamente después de un tiempo
            setTimeout(closeModal, 4000);
        });
    }

    // Cerrar el modal al hacer click fuera de la caja de contenido
    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                closeModal();
            }
        });
    }


    // --- FUNCIÓN DE RENDERIZADO PRINCIPAL (SIN CAMBIOS ESTRUCTURALES) ---

    function renderCart() {
        const cart = getCart();
        let total = 0;

        // Caso Carrito Vacío
        if (cart.length === 0) {
            if (cartContainer) {
                cartContainer.innerHTML = '<p class="empty-cart-message">Tu carrito mágico está vacío. ¡Añade algunos productos!</p>';
            }
            if (cartTotalAmount) {
                cartTotalAmount.textContent = formatCurrency(0);
            }
            // Deshabilitar botón de checkout si está vacío
            if(btnCheckout) btnCheckout.disabled = true; 
            return;
        }

        // Habilitar botón de checkout si hay ítems
        if(btnCheckout) btnCheckout.disabled = false;

        // 1. Generamos el cuerpo de la tabla (tbody)
        const tableBodyHtml = cart.map(item => {
            // Aseguramos que el precio sea un número
            const price = parseFloat(item.price);
            const itemTotal = price * item.quantity;
            total += itemTotal;

            const formattedPrice = formatCurrency(price);
            const formattedItemTotal = formatCurrency(itemTotal);

            // Se añaden los atributos data-label para el responsive CSS
            return `
                <tr>
                    <td data-label="Imagen">
                        <img src="${item.image || 'https://placehold.co/80x80/f7f7f7/999?text=Producto'}" alt="${item.name}">
                    </td>
                    <td data-label="Producto">${item.name}</td>
                    <td data-label="Precio Unitario">${formattedPrice}</td>
                    <td data-label="Cantidad">
                        <div class="quantity-controls">
                            <button class="btn-qty-action" data-id="${item.id}" data-action="decrement">-</button>
                            <span>${item.quantity}</span>
                            <button class="btn-qty-action" data-id="${item.id}" data-action="increment">+</button>
                        </div>
                    </td>
                    <td data-label="Subtotal">${formattedItemTotal}</td>
                    <td data-label="Acción">
                        <button class="btn-remove" data-id="${item.id}" data-action="remove">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');

        // 2. Estructura completa de la tabla
        if (cartContainer) {
            cartContainer.innerHTML = `
                <table class="cart-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Producto</th>
                            <th>Precio Unitario</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableBodyHtml}
                    </tbody>
                </table>
            `;
        }

        // 3. Actualizar el Total
        if (cartTotalAmount) {
            cartTotalAmount.textContent = formatCurrency(total);
        }

        // 4. Asignar Event Listeners a los botones de +/-/Eliminar (DEBE hacerse después de inyectar el HTML)
        document.querySelectorAll('.btn-qty-action, .btn-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.currentTarget.getAttribute('data-id');
                const action = e.currentTarget.getAttribute('data-action');
                
                handleCartAction(productId, action);
            });
        });
    }

    // --- Inicialización ---

    // Listener para el botón de Finalizar Compra
    if (btnCheckout) {
        btnCheckout.addEventListener('click', handleCheckout);
    }
    
    // 1. Renderizar el carrito al cargar la página
    renderCart();
    // 2. Inicializar el contador del menú
    updateCartCounter();
});