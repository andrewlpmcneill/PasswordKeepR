$(() => {
  const $registrationForm = $(`
  <form id="registration-form" class="registration-form">
    <div class="registration-title>
      <p>Register</p>
    </div>
    <div class="registration-fields">
      <input type="text" name="full_name" id="full_name" placeholder="Full Name">
      <input type="email" name="email" id="email" placeholder="Email">
      <input type="password" name="password" id="password" placeholder="Password">
    </div>
    <div class="organization-options grid">
      <button id="join-organization" role="button">Join Organization</button>
      <button id="create-organization" role="button">Create Organization</button>
    </div>
    <button>Register</button>
  </form>
  `);

  window.$registrationForm = $registrationForm;

  const $organizationSelect = $(`
      <select name="organization" id="organization-select"></select>
      `);

  window.$organizationSelect = $organizationSelect;

  const $createOrganizationForm = $(`
      <div class="create-organization-fields">
          <input type="text" name="organization_name" id="organization_name" placeholder="Organization Name">
          <input type="password" name="organization_password" id="organization_password" placeholder="Organization Password">
          <input type="text" name="organization_url" id="organization_url" value="https://">
          <input type="text" name="organization_description" id="organization_description" placeholder="Description">
          <input type="text" name="organization_logo_url" id="organization_logo_url" value="https://">
      </div>
      `);

  const createOrganizationsSelect = (organizations) => {
    const organizationsArray = organizations.organizations;
    for (const organization of organizationsArray) {
      let $organizationOption = $(`<option value='${organization.id}'>${organization.name}</option>`);
      $organizationSelect.append($organizationOption);
    }
    $organizationSelect.appendTo(".organization-options");
  };


  // Generate organizations dropdown on button click
  $(document).on('click', '#join-organization', (event) => {
    event.preventDefault();
    getOrganizations()
      .then((res) => {
        $organizationSelect.empty();
        createOrganizationsSelect(res);
        $('.organization-options button').hide();
      });
  });

  // Generate create organization form on button click
  $(document).on('click', '#create-organization', (event) => {
    event.preventDefault();

    $createOrganizationForm.appendTo(".organization-options");
    $('.organization-options button').hide();

  });

  $(document).on("submit", "#registration-form", event => {
    event.preventDefault();

    const data = {
      full_name: $('#full_name').val(),
      organization_id: $('#organization-select').val(),
      email: $('#email').val(),
      password: $('#password').val(),
    };

    // If no value in the organization select -> create organization before creating user
    if (!$('#organization-select').val()) {
      const organizationData = {
        name: $('#organization_name').val(),
        password: $('#organization_password').val(),
        organization_url: $('#organization_url').val(),
        description: $('#organization_description').val(),
        organization_logo_url: $('#organization_logo_url').val(),
      };

      createOrganization(organizationData)
        .then(res => {
          data.organization_id = res.id;
          createUser(data)
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
    } else {
      // NEED TO FIND A WAY SO THIS WHOLE BLOCK FROM LIKE 92 DOESN'T NEED TO REPEAT
      createUser(data)
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
    }



  });

});
