const generatePassword = (length, hasCapitals, hasSpecialCharacters) => {

  const specialChars = ['!', '@', '#', '$', '%', '&', '*'];
  let password = '';
  // Start with a guaranteed number - very small chance the rest of the script produces a password that is empty of numbers
  password += Math.floor(Math.random() * 10);
  // If special characters have been requested, start with a guaranteed special char - very small chance the rest of the script produces a password that is empty of special chars
  if (hasSpecialCharacters) password += specialChars[Math.floor(Math.random() * 7)];
  // Create a random string at least 255 characters long
  for (let i = 0; i < 25; i++) {
    password += Math.random().toString(36).slice(2);
  }
  // Extract only the length the user wants
  password = password.slice(0, length);
  // If user wants capitals, toggle some non-number chars to uppercase
  if (hasCapitals) {
    let output = '';
    for (let char of password) {
      const toggle = Math.floor(Math.random() * 3);
      if (isNaN(char) && toggle === 1) {
        output += char.toUpperCase();
        continue;
      }
      output += char;
    }
    password = output;
  }
  // If user wants special characters, toggle some non-number and non-capitalized chars to special characters
  if (hasSpecialCharacters) {
    let output = '';
    for (let char of password) {
      const toggle = Math.floor(Math.random() * 2);
      if (isNaN(char) && toggle === 1 && char.toUpperCase() !== char) {
        output += specialChars[Math.floor(Math.random() * 7)];
        continue;
      }
      output += char;
    }
    password = output;
  }

  return password;

};

const copyToClipboard = (elementID) => {
  navigator.clipboard.writeText($(elementID).text());
  return $(elementID).text();
};

const passTableStrongCheck = (password, id) => {
  if (window.isSecureMode) {
    let output = `<a id="strong-password-${id}" href="#">`;
    password.split('').forEach(char => {
      output += '●';
    });
    output += `</a>`;
    return output;
  }
  return password;

};
