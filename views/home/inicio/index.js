const tiendaBtn = document.getElementById('tienda');
const carritoBtn = document.getElementById('carrito');
const tiendaBtn2 = document.getElementById('boton');
const botonesC = document.querySelectorAll('.enviarC');

botonesC.forEach(btn => {	
	btn.addEventListener('click', e => {
		window.location.href = '/tienda/';
	});
});


tiendaBtn.addEventListener('click', () => {
	window.location.href = '/tienda/';
});
tiendaBtn2.addEventListener('click', () => {
	window.location.href = '/tienda/';
});
carritoBtn.addEventListener('click', () => {
	window.location.href = '/carrito/';
});