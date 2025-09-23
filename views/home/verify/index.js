const textInfo = document.getElementById('textInfo');

(async() => {
   try {
    const token = window.location.pathname.split('/')[3];
    const id = window.location.pathname.split('/')[2];
    const { data } = await axios.patch(`/api/users/${id}/${token}`);
    //  console.log(token);
     window.location.pathname = '/login/';
   } catch (error) {
      textInfo.innerHTML = error.response.data.error;
    console.log(error.response.data.error);
   }
})();


//usar parametros de ruta vistos en el modulo 5
// parametros de ruta de una URL