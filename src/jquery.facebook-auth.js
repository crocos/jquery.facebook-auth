(function($, undefined) {

  // Function that checks needed user permissions
  var checkPermissions = function(permsNeeded, cb) {
    FB.api('/me/permissions', function(response) {
      if (response['error']) {
        promptForPerms(permsNeeded, cb);

        return false;
      }

      var permsArray = response.data[0];

      var permsToPrompt = [];
      for (var i in permsNeeded) {
        if (permsArray[permsNeeded[i]] == null) {
          permsToPrompt.push(permsNeeded[i]);
        }
      }

      if (permsToPrompt.length > 0) {
        promptForPerms(permsToPrompt, cb);
      } else {
        cb();
      }
    });
  };

  // Re-prompt user for missing permissions
  var promptForPerms = function(perms, cb) {
      FB.login(function(response) {
        if (response['authResponse']) {
          cb();
        }
      }, {scope: perms.join(',')});
  };

  $.fn.facebook_auth = function (options) {
    options = $.extend({}, defaults, options);

    var self = $(this);
    self.click(function() {
      var neededPerms = self.data('facebook-auth-scope').split(',');

      checkPermissions(neededPerms, function() {
        window.location = self.attr('href');
      });

      return false;
    });
  };

  var defaults = $.extend({}, {
    scope: '',
    live: true
  }, $.fn.facebook_auth.defaults || {});

  if (defaults.live) {
    $(function() {
      $('a[data-facebook-auth-scope]').each(function() {
        var self = $(this);
        self.facebook_auth({scope: self.data('facebook-auth-scope')});
      });
    });
  }

})(jQuery || ender);
