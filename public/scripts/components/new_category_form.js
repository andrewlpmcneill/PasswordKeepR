/* eslint-disable camelcase */
$(document).ready(function() {

  const $newCategoryHTML = $(`

  <div class="createCategoryNew" >
  <h1>Create category</h1>
  <form id="newCategoryForm">
  <label for="category_name">Name:</label>
  <input id="category_name" name="category_name" placeholder="Enter name of category">
  <label for="category_description">Description:</label>
  <input id="category_description" name="category_description" placeholder="What is the category for?">
  <button type="submit">Create</button>
  </form>
  </div>
  `);

  window.$newCategoryHTML = $newCategoryHTML;

  $(document).on('submit', '#newCategoryForm', (event => {
    event.preventDefault();

    const data = {
      category_name: $('#category_name').val(),
      category_description: $('#category_description').val(),
    };
    console.log(data);

    const postCategory = (data) => {
      return $.ajax({
        method: 'POST',
        url: '/api/categories',
        data
      });
    };

    postCategory(data)
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


  }));


});
