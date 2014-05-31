(function () {
  window.firebase = new Firebase('https://leap-beerpong-dev.firebaseio.com/');

  var auth = new FirebaseSimpleLogin(firebase, function (error, user) {

    var $navbar = $('#navbar');
    if (error) {
      // an error occurred while attempting login
      console.log(error);
    } else if (user) {
      console.log(user);
      $navbar.find('[data-login]').html('Sign out ' + user.displayName + '</a>').attr('data-logout', true).removeData('login')
      $('[data-logout]').click(function () {
        auth.logout();
        window.location.reload();
      });
    } else {
      $navbar.find('[data-login]').click(function () {
        auth.login('facebook', {rememberMe: true, preferRedirect: true});
      });
    }
  });
}).call(this);