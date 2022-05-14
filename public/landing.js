window.addEventListener('load', () => {
    let joinForm = document.getElementById('join-form');
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let username = document.getElementById('username').value;
      let password = document.getElementById('password').value;
      //save the name and the password in session storage
      sessionStorage.setItem('username',username);
      sessionStorage.setItem('password',password);
      //redirect the user to main.html (a different page)
      window.location='/main.html';
    })
  })

