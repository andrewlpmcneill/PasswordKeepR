$(document).ready(function() {

  // Template for the edit password form
  const generateEditPasswordForm = (password) => {
    return $(`
      <form id="edit-form-password-${password.id}">
      <p>Edit Password for ${password.service_name}</p>
          <label for="password-${password.id}-login_username">Username:</label>
          <input id="password-${password.id}-login_username" name="login_username" value="${password.login_username}">
          <label for="password-${password.id}-login_password">Password:</label>
          <input id="password-${password.id}-login_password" type="password" name="login_password" value="${password.login_password}">
          <label for="password-${password.id}-description">Description:</label>
          <input id="password-${password.id}-description" name="description" value="${password.description}">
          <label for="category">Category:</label>
          <select id="category_id"></select>
          <button type="submit">Edit</button>
      </form>
    `);
  };

  // Generate edit password form when edit button in passwords table is clicked
  $(document).on("click",  "[id^='edit-password-']", (event) => {
    event.preventDefault();
    if (window.isSecureMode) {
      $('.secure-mode-popup').remove();
      const authentication = `
      <div class="secure-mode-popup">
      <p class="close-window">x</p>
      <h4>You must turn secure mode off to edit passwords</h4>
      </div>
      `;
      $('body').append(authentication);
      return;
    }
    let elementID = ($(event.target).attr("id"));
    let passwordID = elementID.slice('edit-password-'.length);
    // Make a get request to retrieve password information then render password form
    getPassword(passwordID)
      .then((response) => {
        let password = response.passwords[0];
        window.$editPasswordForm = generateEditPasswordForm(password);
        viewsManager.show('editPassword');
      });
  });

  // On form submit send form data in an AJAX post request then render updated passwords table
  $(document).on('submit', "[id^='edit-form-password-']", (event) => {
    event.preventDefault();

    let elementID = ($(event.target).attr("id"));
    let passwordID = elementID.slice('edit-form-password-'.length);
    let password = {
      id: passwordID,
      login_username: $(`#password-${passwordID}-login_username`).val(),
      login_password: $(`#password-${passwordID}-login_password`).val(),
      description: $(`#password-${passwordID}-description`).val(),
      category_id: $(`#category_id`).val(),
    };

    editPassword(password)
      .then((res) => {
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
