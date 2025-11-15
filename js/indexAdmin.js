// --- VARIABLES GLOBALES ---
const DATA_FILE_PATH = 'datos/productos.json'; // Ruta CORRECTA al archivo JSON
const LOCAL_STORAGE_KEY = 'datos'; 
let products = [];
let nextId = 1;


// --- FUNCIONES DE PERSISTENCIA (Simulación de JSON) ---

/**
 * Carga los productos desde el localStorage (ABM) o desde el JSON (inicial).
 */
async function loadProducts() {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (storedData) {
        // 1. Si hay datos en localStorage, se usan (persistencia del ABM)
        products = JSON.parse(storedData);
        if (products.length > 0) {
            nextId = Math.max(...products.map(p => p.id)) + 1;
        }
        console.log("Productos cargados desde LocalStorage.");
        
    } else {
        // 2. Si NO hay datos en localStorage, se intenta cargar el JSON inicial
        console.log("LocalStorage vacío. Intentando cargar datos iniciales desde productos.json...");
        try {
            // Utilizamos 'fetch' para leer el archivo JSON
            const response = await fetch(DATA_FILE_PATH);
            
            if (!response.ok) {
                // Si el archivo no se encuentra o hay un error (ej: CORS), lanza un error
                throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
            }

            products = await response.json();
            
            // Recalcular nextId y guardar inmediatamente en localStorage
            if (products.length > 0) {
                nextId = Math.max(...products.map(p => p.id)) + 1;
            } else {
                nextId = 1;
            }
            saveProducts(); // Guarda los datos iniciales en localStorage para futuras cargas
            console.log("Productos iniciales cargados desde JSON y guardados en LocalStorage.");

        } catch (error) {
            console.error("Fallo la carga inicial del JSON o está ejecutando el proyecto localmente (sin un servidor). Usando datos de ejemplo:", error);
            
            // Usamos los datos de ejemplo (fallback)
            products = [
                { id: 1, name: "Vasos Personalizados", price: 15000.00, off: 20, description: "Vasos personalizados con lo que vos mas ames.", imageUrl: "VasosPersonalizados.jpg" },
                { id: 2, name: "Cono de Helado Mágico", price: 800.00, off: 0, description: "Un cono de helado con chispas de colores.", imageUrl: "HeladoMagico.jpg" }
            ];
            nextId = 3;
            saveProducts();
        }
    }
}

/**
 * Guarda el array 'products' en el localStorage.
 */
function saveProducts() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
}


// --- FUNCIONES DE NAVEGACIÓN Y ABM (Sin cambios) ---
// ... (Toda la lógica de showSection, renderProductTable, handleFormSubmit, editProduct, deleteProduct queda igual) ...
function showSection(sectionId, linkId) {
    // 1. Manejo de la vista
    document.querySelectorAll('.product-form, .product-list-container').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    // 2. Manejo de enlaces activos
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
    });
    if (linkId) {
        document.getElementById(linkId).classList.add('active');
    }
}

function renderProductTable() {
    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = ''; 

    products.forEach(product => {
        const row = tableBody.insertRow();
        
        const idCell = row.insertCell();
        idCell.textContent = product.id;
        idCell.setAttribute('data-label', 'ID');

        const nameCell = row.insertCell();
        nameCell.textContent = product.name;
        nameCell.setAttribute('data-label', 'Nombre');

        const priceCell = row.insertCell();
        priceCell.textContent = `$${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
        priceCell.setAttribute('data-label', 'Precio');

        const offCell = row.insertCell();
        offCell.textContent = `${product.off}%`;
        offCell.setAttribute('data-label', 'Descuento');
        
        const actionsCell = row.insertCell();
        actionsCell.setAttribute('data-label', 'Acciones'); 
        
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn btn-edit';
        editBtn.textContent = '✏️ Editar';
        editBtn.onclick = () => editProduct(product.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn btn-delete';
        deleteBtn.textContent = '🗑️ Eliminar';
        deleteBtn.onclick = () => deleteProduct(product.id, product.name);

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
    });
}
// ... (El resto de las funciones ABM están bien y no necesitan cambios) ...
function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('product-form');
    const idInput = document.getElementById('product-id');
    const isEditing = idInput.value !== '';

    const imageFile = form['image-file'].files[0];
    let imageUrl = '';
    
    if (imageFile) {
        imageUrl = imageFile.name; 
    } else if (isEditing) {
        const currentProduct = products.find(p => p.id == idInput.value);
        if (currentProduct) {
            imageUrl = currentProduct.imageUrl || '';
        }
    } else {
        imageUrl = 'default.jpg'; 
    }

    const productData = {
        name: form.name.value,
        price: parseFloat(form.price.value),
        off: parseInt(form.off.value),
        description: form.description.value,
        imageUrl: imageUrl
    };

    if (isEditing) {
        const productId = parseInt(idInput.value);
        const index = products.findIndex(p => p.id === productId);
        
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            alert(`✅ Producto "${productData.name}" (ID: ${productId}) actualizado con éxito!`);
        }
    } else {
        productData.id = nextId++;
        products.push(productData);
        alert(`🎉 Producto "${productData.name}" cargado con éxito! ID: ${productData.id}`);
    }

    saveProducts();
    form.reset(); 
    idInput.value = ''; 
    document.getElementById('submit-button').textContent = '✨ Guardar Producto ✨'; 
    
    renderProductTable();
    showSection('ver-lista', 'link-lista'); 
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('product-id').value = product.id;
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('off').value = product.off;
    document.getElementById('description').value = product.description;
    
    document.getElementById('submit-button').textContent = `✍️ Actualizar Producto ID ${product.id}`;
    
    showSection('cargar-productos', 'link-cargar');
}

function deleteProduct(productId, productName) {
    if (confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}" (ID: ${productId})? Esta acción es irreversible.`)) {
        const initialLength = products.length;
        products = products.filter(p => p.id !== productId);

        if (products.length < initialLength) {
            saveProducts();
            renderProductTable();
            alert(`🗑️ Producto "${productName}" eliminado correctamente.`);
        }
    }
}


// --- INICIALIZACIÓN (Modificada para esperar loadProducts) ---

document.addEventListener('DOMContentLoaded', async () => {
    // Es CRUCIAL usar 'await' aquí para esperar que los productos se carguen
    await loadProducts();

    // 1. Configurar la navegación:
    document.getElementById('link-cargar').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        document.getElementById('submit-button').textContent = '✨ Guardar Producto ✨';
        showSection('cargar-productos', 'link-cargar');
    });
    
    document.getElementById('link-lista').addEventListener('click', (e) => {
        e.preventDefault();
        renderProductTable(); 
        showSection('ver-lista', 'link-lista');
    });

    // 2. Configurar el manejo del formulario:
    document.getElementById('product-form').addEventListener('submit', handleFormSubmit);

    // 3. Mostrar la sección inicial
    showSection('cargar-productos', 'link-cargar');
    
    // 4. Renderiza la tabla inicial después de cargar los datos
    renderProductTable();
});