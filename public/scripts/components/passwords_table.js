$(document).ready(function() {

  // Create window.passwords object
  window.passwords = {};

  const $addPasswordButton = $(`
      <div id="newPasswordLink"><i class="fa-solid fa-plus"></i></div>`);

  window.$addPasswordButton = $addPasswordButton;

  const $passwordsTable = $(`
  <table>
  </table>
  `);

  // Make passwords table a jQuery object
  window.$passwordsTable = $passwordsTable;

  const $tableHeader = $(`
  <thead>
    <tr id="table-header">
      <th scope="col">Name</th>
      <th scope="col">Category</th>
      <th scope="col">Username</th>
      <th scope="col">Password</th>
      <th scope="col"></th>
      <th scope="col"></th>
    </tr>
  </thead>
  `);

  const $tableBody = $(`
      <tbody>
      </tbody>`);

  // Clear what was in passwords table before rendering
  const renderPasswords = passwords => {
    $passwordsTable.empty();
    $tableBody.empty();
    $tableHeader.appendTo($passwordsTable);
    const passwordsArray = passwords.passwords;
    for (let password of passwordsArray) {
      $tableBody.append(createPasswordElement(password));
    }
    $tableBody.appendTo($passwordsTable);
  };

  // Make function accessible by other files through window object
  window.passwords.renderPasswords = renderPasswords;

  const createPasswordElement = password => {
    const passwordHTML = `
    <tr class="table-row">
      <td scope="row">
        <a href="${password.service_url}">${password.service_name}</a>
      </td>
      <td><a class="category-${password.category_id}" href="#">${password.category_name || ""}</a></td>
      <td>${password.login_username}</td>
      <td id="password-entry-${password.id}">
      ${passTableStrongCheck(password.login_password, password.id)}
      </td>
      <td>
        <a id="edit-password-${password.id}" href="#">Edit</a>
      </td>
      <td id="copy-password-${password.id}" class="tooltip"><i class="fa-solid fa-clone"></i><span class="tooltiptext">Copy Password</span></td>
    </tr>
    `;
    return passwordHTML;
  };

  window.passwords.createPasswordElement = createPasswordElement;

  $('body').on('click', "[id^='copy-password-']", (event => {
    $('.tooltiptext').html('Copy Password');
    let elementID;
    if (!($(event.target).attr("id"))) {
      elementID = ($(event.target).parent().attr("id"));
      $(event.target).parent().html('<i class="fa-solid fa-clone"></i><span class="tooltiptext">Copied!</span>');
      console.log(elementID);
    } else {
      $(event.target).html('<i class="fa-solid fa-clone"></i><span class="tooltiptext">Copied!</span>');
      elementID = ($(event.target).attr("id"));
      console.log(elementID);
    }
    const passwordID = elementID.slice('copy-password-'.length);
    if (window.isSecureMode && $(`#password-entry-${passwordID}`).html().includes('●')) return;
    // eslint-disable-next-line no-undef
    copyToClipboard(`#password-entry-${passwordID}`);
  }));

  // SECURE MODE BELOW

  // On click of secure individual password
  $('body').on('click', "[id^='strong-password-']", (event => {
    $('.secure-mode-popup').remove();
    const elementID = $(event.target).attr("id");
    const passwordID = elementID.slice('strong-password-'.length);

    const authentication = `
    <div class="secure-mode-popup">
    <p class="close-window">x</p>
    <h4>Reveal Password</h4>
    <input id="secure-mode-auth-input" name="secure-mode-auth-input" type="password" placeholder="Enter your password">
    <button id="secure-mode-auth-button-${passwordID}" type=button>Verify</button>
    </div>
    `;
    $('body').append(authentication);
  }));

  // On submitting user password when prompted to reveal a single password
  $('body').on('click', "[id^='secure-mode-auth-button']", (event => {
    // retrieve the user-entered password
    const password = $('#secure-mode-auth-input').val();
    // retrieve the logged in user's email
    getCurrentUser()
      .then((json) => {
        const data = {
          email: json.user.email,
          password: password
        };
        // verify the user (via users.js and network.js), including the email and password to be tested as a param object
        verifyUser(data)
          .then(res => {
            // if it's not a match according to the DB, hide the window and do not show the password
            if (!res) {
              $('.secure-mode-popup').remove();
              return;
            }
            $('.secure-mode-popup').remove();
            // should probably move this to a function, it's a mess
            // if it is a match, reveal the password
            const elementID = $(event.target).attr("id");
            const passwordID = elementID.slice('secure-mode-auth-button-'.length);
            getPassword(passwordID)
              .then((response) => {
                let password = response.passwords[0];
                $(`#password-entry-${passwordID}`).html(`${password.login_password}`);
              });
          });
      });
  }));

  // On submitting user password when prompted to turn secure mode off
  $('body').on('click', '#secure-mode-off-auth-button', (event => {
    // retrieve the user-entered password
    const password = $('#secure-mode-auth-input').val();
    // retrieve the logged in user's email
    getCurrentUser()
      .then((json) => {
        const data = {
          email: json.user.email,
          password: password
        };
        // verify the user (via users.js and network.js), including the email and password to be tested as a param object
        verifyUser(data)
          .then(res => {
            // if it's not a match according to the DB, hide the window and do not show the password
            if (!res) {
              $('.secure-mode-popup').remove();
              return;
            }
            $('.secure-mode-popup').remove();
            window.isSecureMode = false;
            $('#secureMode').html(`<i class="fa-solid fa-lock-open"></i>`);
            getCurrentUser()
              .then((json) => {
                const data = {
                  organizationID: json.user.organizationID,
                };
                getPasswords(data)
                  .then((response) => {
                    renderPasswords(response);
                    viewsManager.show('passwords');
                    displayCategories();
                  });
              });
          });
      });
  }));
  // On closing the verify window with 'x'
  $('body').on('click', '.close-window', (event => {
    $('.secure-mode-popup').remove();
  }));

});
