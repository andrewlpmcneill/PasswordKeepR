$(() => {
  window.categories = {};

  const $categoriesDisplay = $(`
        <div class="grid" id="categories-display">

        </div>
  `);

  window.$categoriesDisplay = $categoriesDisplay;

  // Clear what was in passwords table before rendering
  const renderCategories = categories => {
    $categoriesDisplay.empty();
    $categoriesDisplay.append(`<div id="newCategoryLink">+ Category</div>`);
    const categoriesArray = categories.categories;
    for (let category of categoriesArray) {
      // console.log(category);
      $categoriesDisplay.append(`<div class="category-${category.id}" id="filter-category-${category.id}">${category.name}</div>`);
    }
  };

  window.categories.renderCategories = renderCategories;

  const displayCategories = () => {
    getCategories()
      .then(res => {
        categories.renderCategories(res);

        $searchContainer.prependTo('main');
        $categoriesDisplay.prependTo('main');
      });
  };

  window.displayCategories = displayCategories;

  $(document).on('click', "[id^='filter-category-']", (event) => {
    const target = $(event.target);
    const id = target.attr('id');
    if (window.categoryOn) {
      if (window.categoryCurrent[0] !== id) {
        $(`#${window.categoryCurrent[0]}`).css('background-color', '');
        window.categoryCurrent = [id];
        target.css('background-color', '#e53935');
        const value = $(event.target).html();
        $('.table-row').hide();
        $('.table-row').has("td:contains(" + value + ")").show();
        return;
      }
      target.css('background-color', '');
      window.categoryOn = false;
      window.categoryCurrent = [];
      $('.table-row').show();
      return;
    }
    window.categoryOn = true;
    window.categoryCurrent = [id];
    target.css('background-color', '#e53935');
    const value = $(event.target).html();
    $('.table-row').hide();
    $('.table-row').has("td:contains(" + value + ")").show();
  });

});
