// Javascript for the homepage index.html


window.addEventListener('load', () => {

    let joinForm = document.getElementById('join-form');

    joinForm.addEventListener('submit', (e) => {

    e.preventDefault();

    // getting username and password enetered in the form
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // save the name and the password in session storage
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('password', password);

    // redirect the user to main.html
    window.location='/main.html';

})

})