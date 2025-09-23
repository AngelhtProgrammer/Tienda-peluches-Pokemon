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
    await axios.post('/api/login', user);
     window.location.pathname = '/todos/';
    
    
    } catch (error) {
        console.log(error);
        errorText.innerHTML = error.response.data.error;
    }
    
    
});
