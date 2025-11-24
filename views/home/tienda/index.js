const inicioBtn = document.getElementById('inicio');
const carritoBtn = document.getElementById('carrito');
// Los botones "Agregar al carrito" se enlazan dinámicamente tras renderizar el catálogo
const cart = document.querySelector('.cart');
const table = document.getElementById('tableBody');
const limpiarBtn = document.getElementById('clearTable');
const comprarBtn = document.getElementById('comprar');
const logoutBtn = document.querySelector('#logout');

carritoBtn.addEventListener('click', e => {
    cart.classList.toggle('show-cart');
    
});



function bindAddToCartButtons() {
    const botones = document.querySelectorAll('#listaProductos .enviarC');
    botones.forEach(btn => {
        btn.addEventListener('click', e => {
            const img = e.currentTarget.parentElement.parentElement.children[0].innerHTML;
            const nombre = e.currentTarget.parentElement.children[0].innerHTML;
            const precio = e.currentTarget.parentElement.children[2].innerHTML;
            const cantidad = e.currentTarget.parentElement.children[3].value;

            const exist = [...table.children].find(row => row.children[1].innerText === nombre);
            if (exist) {
                const cantActual = exist.children[2].innerText;
                exist.children[2].innerText = parseInt(cantActual) + parseInt(cantidad);
                return;
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${img}</td>
                    <td>${nombre}</td>
                    <td>${cantidad}</td>
                    <td>${precio}</td>
                    <td><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="borrar">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
</td>
                `;

                row.children[4].addEventListener('click', e => {
                    e.currentTarget.parentElement.remove();
                });

                cart.querySelector('tbody').appendChild(row);
            }
        });
    });
}

// --- Load products from localStorage and render catalog ---
let products = [];

function loadProducts() {
    const stored = localStorage.getItem('productos');
    if (stored) {
        try {
            products = JSON.parse(stored);
        } catch (err) {
            products = [];
        }
    }
    renderProductList();
}

function renderProductList() {
    const productListEl = document.getElementById('listaProductos');
    if (!productListEl) return;

    // If there are no saved products, keep existing static HTML as fallback
    if (!products || products.length === 0) {
        bindAddToCartButtons();
        return;
    }

    productListEl.innerHTML = products.map(p => `
        <li class="productosLi" data-id="${p.id}">
            <div class="productos">${p.imgHtml}</div>
            <div class="infoProductos">
                <p>${p.nombre}</p>
                <p>Precio:</p>
                <p class="precio">${p.precio}$</p>
                <input type="number" class="cantidad" min="1" value="1"/>
                <button class="enviarC">Agregar al carrito</button>
            </div>
        </li>
    `).join('');

    bindAddToCartButtons();
}

// Inicializar catálogo desde localStorage
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

limpiarBtn.addEventListener('click', e => {
    table.innerHTML = '';
});

comprarBtn.addEventListener('click', () => {
    // Mostrar modal con lista de productos del carrito y total
    const rows = Array.from(table.querySelectorAll('tr')).filter(r => r.children[1] && r.children[1].innerText.trim() !== '');
    if (rows.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    const items = rows.map(r => {
        const img = r.children[0].innerHTML;
        const nombre = r.children[1].innerText.trim();
        const cantidad = parseInt(r.children[2].innerText) || 1;
        const precioStr = r.children[3].innerText || '';
        const precio = parseFloat(precioStr.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
        return { img, nombre, cantidad, precio };
    });

    const total = items.reduce((s, it) => s + it.precio * it.cantidad, 0);

    // Crear overlay/modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>Gracias por su compra</h2>
            </div>
            <div class="modal-body">
                <ul class="modal-list">
                    ${items.map(it => `
                        <li class="modal-item">
                            <div class="modal-item-img">${it.img}</div>
                            <div class="modal-item-info">
                                <div class="modal-item-name">${it.nombre}</div>
                                <div class="modal-item-qty">Cantidad: ${it.cantidad}</div>
                                <div class="modal-item-price">Precio unitario: ${it.precio}$</div>
                            </div>
                        </li>`).join('')}
                </ul>
            </div>
            <div class="modal-footer">
                <div class="modal-total">Total: ${total.toFixed(2)}$</div>
                <div class="modal-actions">
                    <button class="modal-btn modal-close">Cancelar</button>
                    <button class="modal-btn modal-confirm">Confirmar compra</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeModal = () => {
        overlay.remove();
    };

    overlay.querySelector('.modal-close').addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    overlay.querySelector('.modal-confirm').addEventListener('click', () => {
        // Vaciar carrito y cerrar modal
        table.innerHTML = '';
        // Opcional: mostrar un mensaje breve dentro del modal antes de cerrarlo
        const body = overlay.querySelector('.modal-body');
        body.innerHTML = `<p class="modal-thanks">Pedido realizado con éxito. ¡Gracias por su compra!</p>`;
        overlay.querySelector('.modal-footer').innerHTML = '<button class="modal-btn modal-close">Cerrar</button>';
        overlay.querySelector('.modal-close').addEventListener('click', closeModal);
        setTimeout(closeModal, 2500);
    });
});



inicioBtn.addEventListener('click', () => {
    window.location.href = '/inicio/';
});

logoutBtn.addEventListener('click', async e => {
    window.location.href = '/login/';
});
