const inicioBtn = document.getElementById('inicio');
const carritoBtn = document.getElementById('carrito');
const botonC = document.querySelectorAll('.enviarC');
const cart = document.querySelector('.cart');
const table = document.getElementById('tableBody');
const limpiarBtn = document.getElementById('clearTable');
const comprarBtn = document.getElementById('comprar');
const logoutBtn = document.querySelector('#logout');

carritoBtn.addEventListener('click', e => {
    cart.classList.toggle('show-cart');
    
});



botonC.forEach(btn => {
    btn.addEventListener('click', e => {
        const img = e.currentTarget.parentElement.parentElement.children[0].innerHTML;
        const nombre = e.currentTarget.parentElement.children[0].innerHTML;
        const precio = e.currentTarget.parentElement.children[2].innerHTML;
        const cantidad = e.currentTarget.parentElement.children[3].value;
        
        const exist = [...table.children].find(row => row.children[1].innerText === nombre);
        if(exist){
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



inicioBtn.addEventListener('click', async e => {
    window.location.href = '/admin/';
});

logoutBtn.addEventListener('click', async e => {
    window.location.href = '/login/';
});

// --- Product Management (CRUD) for the tienda catalog ---
const manageBtn = document.getElementById('manageProducts');
const productListEl = document.getElementById('listaProductos');

let products = [];

function saveProducts() {
    localStorage.setItem('productos', JSON.stringify(products));
}

function loadProducts() {
    const stored = localStorage.getItem('productos');
    if (stored) {
        try {
            products = JSON.parse(stored);
        } catch (err) {
            products = [];
        }
    } else {
        // Build initial products array from current DOM (first load)
        products = Array.from(productListEl.querySelectorAll('.productosLi')).map((li, idx) => {
            const imgEl = li.querySelector('.productos img');
            const imgHtml = imgEl ? imgEl.outerHTML : '';
            const nombre = li.querySelector('.infoProductos p')?.innerText || '';
            const precioStr = li.querySelector('.precio')?.innerText || '';
            const precio = parseFloat(precioStr.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
            return { id: Date.now() + idx, imgHtml, nombre, precio };
        });
        saveProducts();
    }
    renderProductList();
}

function renderProductList() {
    // Renders the visible store catalog from `products` array
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

    // Restore event listeners for add-to-cart on newly rendered items
    const newBtns = productListEl.querySelectorAll('.enviarC');
    newBtns.forEach(btn => {
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

function openProductManager() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header"><h2>Gestión de Productos</h2></div>
            <div class="modal-body">
                <div class="manager-list">
                    ${products.map(p => `
                        <div class="manager-item" data-id="${p.id}">
                            <div class="manager-thumb">${p.imgHtml}</div>
                            <div class="manager-info">
                                <div class="manager-name">${p.nombre}</div>
                                <div class="manager-price">${p.precio}$</div>
                            </div>
                            <div class="manager-actions">
                                <button class="modal-btn modal-edit" data-id="${p.id}">Editar</button>
                                <button class="modal-btn modal-delete" data-id="${p.id}">Eliminar</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <hr />
                <h3>Agregar / Editar producto</h3>
                <form id="productForm">
                    <input type="hidden" id="prodId" />
                    <div><label>Nombre: </label><input id="prodName" required /></div>
                    <div><label>Precio: </label><input id="prodPrice" type="number" step="0.01" required /></div>
                    <div><label>Imagen URL: </label><input id="prodImg" placeholder="/img/peluches/archivo.jpg" required /></div>
                    <div style="margin-top:8px"><button class="modal-btn modal-confirm" type="submit">Guardar</button>
                    <button type="button" class="modal-btn modal-close">Cancelar</button></div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();

    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    // Delete handler
    overlay.querySelectorAll('.modal-delete').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = parseInt(e.currentTarget.dataset.id);
            products = products.filter(p => p.id !== id);
            saveProducts();
            // re-open or re-render modal content (simpler: close and reopen)
            close();
            openProductManager();
            renderProductList();
        });
    });

    // Edit handler
    overlay.querySelectorAll('.modal-edit').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = parseInt(e.currentTarget.dataset.id);
            const p = products.find(x => x.id === id);
            if (!p) return;
            overlay.querySelector('#prodId').value = p.id;
            overlay.querySelector('#prodName').value = p.nombre;
            overlay.querySelector('#prodPrice').value = p.precio;
            // extract src from imgHtml if possible
            const imgMatch = p.imgHtml.match(/src=\"([^\"]+)\"/);
            overlay.querySelector('#prodImg').value = imgMatch ? imgMatch[1] : '';
        });
    });

    // Form submit for add/edit
    overlay.querySelector('#productForm').addEventListener('submit', e => {
        e.preventDefault();
        const idVal = overlay.querySelector('#prodId').value;
        const name = overlay.querySelector('#prodName').value.trim();
        const price = parseFloat(overlay.querySelector('#prodPrice').value) || 0;
        const imgUrl = overlay.querySelector('#prodImg').value.trim();
        const imgHtml = `<img src="${imgUrl}" alt="${name}" class="imgPokemon" width="300px" />`;

        if (idVal) {
            const id = parseInt(idVal);
            const idx = products.findIndex(p => p.id === id);
            if (idx !== -1) {
                products[idx].nombre = name;
                products[idx].precio = price;
                products[idx].imgHtml = imgHtml;
            }
        } else {
            products.push({ id: Date.now(), nombre: name, precio: price, imgHtml });
        }

        saveProducts();
        renderProductList();
        close();
    });

    overlay.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', () => overlay.remove()));
}

if (manageBtn) {
    manageBtn.addEventListener('click', () => {
        openProductManager();
    });
}

// Initialize products and render
loadProducts();