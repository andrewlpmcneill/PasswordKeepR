$(() => {


  const $logInForm = $(`
  <form id="login-form" class="login-form">
    <div class="login-title>
      <p>Login</p>
    </div>
    <div class="login-fields">
      <input type="email" name="email" placeholder="Email">
      <input type="password" name="password" placeholder="Password">
      <button>Log In</button>
    </div>
  </form>
  `);

  window.$logInForm = $logInForm;

  // $('section').empty();
  // $('section').append($logInForm);

  $logInForm.on('submit', function(event) {
    event.preventDefault();

    const data = $(this).serialize();

    logIn(data)
      .then(res => {
        header.update(res.user);
        getCurrentUser()
          .then((json) => {
            const data = {
              organizationID: json.user.organizationID,
            };
            getPasswords(data)
              .then((response) => {
                passwords.renderPasswords(response);
                viewsManager.show('passwords');
                displayCategories();
              });
          });
      });

  });


});
