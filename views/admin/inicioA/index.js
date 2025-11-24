const tiendaBtn = document.getElementById('tienda');
const carritoBtn = document.getElementById('carrito');
const tiendaBtn2 = document.getElementById('boton');
const botonesC = document.querySelectorAll('.enviarC');
const logoutBtn = document.querySelector('#logout');
const axios = window.axios;

botonesC.forEach(btn => {	
	btn.addEventListener('click', e => {
		window.location.href = '/tiendaA/';
	});
});

(async () => {
        const {data} = await axios.get('/api/inicio');
})();


tiendaBtn.addEventListener('click', () => {
	window.location.href = '/tiendaA/';
});
tiendaBtn2.addEventListener('click', () => {
	window.location.href = '/tiendaA/';
});
logoutBtn.addEventListener('click', async e => {
	window.location.href = '/login/';
    // console.log(logoutBtn);
    // try {
    //     await axios.get('/api/logout');
    //     window.location.pathname = '/login';
    // } catch (error) {
    //     console.log(error);
    // }
})
