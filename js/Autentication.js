const form = document.querySelector('#log-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ "correo": email, "password": password });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://restlabingsoft-production-0999.up.railway.app/api/auth/login", requestOptions)
        .then(response => response.text())
        .then(result => {
            const response = JSON.parse(result);
            if (response.token) {
              localStorage.setItem('token', response.token);
              window.location.href = 'index2.html';
            } else {
              alert('Autenticación fallida');
            }
          })
        .catch(error => console.log('error', error));
});