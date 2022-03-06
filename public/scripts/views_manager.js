/* eslint-disable no-undef */
$(() => {

  window.viewsManager = {};

  window.viewsManager.show = function(item) {
    $('main').empty();

    switch (item) {
    case 'passwords':
      $addPasswordButton.appendTo('main');
      $passwordsTable.appendTo('main');
      break;
    case 'newPassword':
      $newPasswordHTML.appendTo('main');
      $('#newPasswordForm').trigger("reset");
      generateCategoryOptions();
      break;
    case 'editPassword':
      $editPasswordForm.appendTo('main');
      $editPasswordForm.trigger('reset');
      generateCategoryOptions();
      break;
    case 'newCategory':
      $newCategoryHTML.appendTo('main');
      $newCategoryHTML.trigger("reset");
      break;
    case 'editCategory':
      $editCategoryForm.appendTo('main');
      $editCategoryForm.trigger('reset');
      break;
    case 'registration':
      $registrationForm.appendTo('main');
      $editCategoryForm.trigger('reset');
      break;
    case 'login':
      $logInForm.appendTo('main');
      $logInForm.trigger('reset');
      break;
    case 'error': {
      const $error = $(`<p>${arguments[1]}</p>`);
      $error.appendTo('body');
      setTimeout(() => {
        $error.remove();
        viewsManager.show('listings');
      }, 2000);

      break;
    }
    }
  };

});
