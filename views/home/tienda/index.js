const inicioBtn = document.getElementById('inicio');
const carritoBtn = document.getElementById('carrito');
const botonC = document.querySelectorAll('.enviarC');
const cart = document.querySelector('.cart');
const table = document.getElementById('tableBody');
const limpiarBtn = document.getElementById('clearTable');
const comprarBtn = document.getElementById('comprar');


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
    alert('Pedido realizado con exito. ¡Gracias por su compra!');
    table.innerHTML = '';
});




inicioBtn.addEventListener('click', () => {
    window.location.href = '/inicio/';
});



