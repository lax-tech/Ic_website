 document.addEventListener('DOMContentLoaded', function() {
    var togglePassword = document.getElementById("toggle-password");
    var passwordInput = document.getElementById('password');
    var eyeOpen = document.getElementById('eye-close');
    var eyeClose = document.getElementById('eye-open');

    togglePassword.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeOpen.style.display = 'none';
            eyeClose.style.display = 'block';
        } else {
            passwordInput.type = 'password';
            eyeOpen.style.display = 'block';
            eyeClose.style.display = 'none';
        }
    });
});


















/* $(document).ready(function() {
    $('.toggle-password').click(function() {
        $(this).toggleClass('show-password');
        var passwordField = $(this).parent().find('#password');
        var passwordFieldType = passwordField.attr('type');
        if (passwordFieldType == 'password') {
            passwordField.attr('type', 'text');
            $(this).text('Hide password');
        } else {
            passwordField.attr('type', 'password');
            $(this).text('Show password');
        }
    });
});

 */









/* function showPassword() {
    var passwordField = document.getElementById('password-field');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}
 */

/* const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('togglePassword');

togglePasswordButton.addEventListener('click', function() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePasswordButton.textContent = 'Hide password';
  } else {
    passwordInput.type = 'password';
    togglePasswordButton.textContent = 'Show password';
  }
});

// Ajoutez ce code pour empêcher la soumission du formulaire lors de l'affichage du mot de passe
togglePasswordButton.addEventListener('mousedown', function(event) {
  // Annule l'action par défaut du clic de souris
  event.preventDefault();
}); */