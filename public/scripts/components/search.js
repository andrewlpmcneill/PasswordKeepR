$(document).ready(function() {

  const $searchContainer = $(`
  <div id="search-container">
    <input type="search" id="passwords-table-search">
  </div>
  `);

  window.$searchContainer = $searchContainer;

  $(document).on('input', '#passwords-table-search', function() {
    const value = $(this).val();
    if (value === "") return $('.table-row').show();
    $('.table-row').hide();
    $('.table-row').has("td:contains(" + value + ")").show();
  });


});
