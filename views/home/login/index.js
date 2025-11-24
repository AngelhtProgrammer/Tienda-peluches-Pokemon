const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const loginForm = document.getElementById('form');
const errorText = document.getElementById('error-text');


loginForm.addEventListener('submit',async (e) => {
    e.preventDefault();
    
    try {
          const user = {
        email: emailInput.value,
        password: passwordInput.value
    };
    const response = await axios.post('/api/login', user);
    // Si el usuario es admin redirige a la vista de admin, si no a inicio (cliente)
    if (response.data && response.data.admin) {
        window.location.pathname = '/admin/';
    } else {
        window.location.pathname = '/inicio/';
    }

    } catch (error) {
        console.log(error);
        errorText.innerHTML = error.response && error.response.data && error.response.data.error ? error.response.data.error : 'Error en el login';
    }
    
    
});
