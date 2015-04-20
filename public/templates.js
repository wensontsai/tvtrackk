angular.module("MyApp").run(["$templateCache", function($templateCache) {$templateCache.put(" views/add.html","<div clalss=\"container\">\n  <div class=\"panel panel-default\">\n    <div class=\"panel-heading\">Add TV Show</div>\n    <div class=\"panel-body\">\n      <form class=\"form\" method=\"post\" ng-submit=\"addShow()\" name=\"addForm\" >\n        <div class=\"form-group\" ng-class=\"{ \'has-success\' : addForm.showName.$valid && addForm.showName.$dirty, \'has-error\' : addForm.showName.$invalid && addForm.showName.$dirty }\">\n          <input class=\"form-control\" type=\"text\" name=\"showName\" ng=model=\"showName\" placeholder=\"Enter TV show name\" required autofocus>\n          <div class=\"help-block text-danger\" ng-if=\"addForm.showName.$dirty\" ng-messages=\"addForm.showName.$error\">\n            <div ng-message=\"required\">TV show name is required.</div>\n          </div>\n        </div>\n        <button class=\"btn btn-primary\" type=\"submit\" ng-disabled=\"addForm.$invalid\">Add</button>\n      </form>\n    </div>\n  </div>\n</div>\n");
$templateCache.put(" views/detail.html","<div class=\"container\">\n  <div class=\"panel panel-default\">\n    <div class=\"panel-body\">\n      <div class=\"media\">\n\n        <div class=\"pull-left\">\n          <img class=\"media-object img-rounded\" ng-src=\"{{show.poster}}\">\n          <!-- if logged in, show subscribe / unsubscribe buttons -->\n          <div class=\"text-center\" ng-if=\"currentUser\">\n            <div ng-show=\"!isSubscribed()\">\n              <button ng-click=\"subscribe()\" class=\"btn btn-block btn-success\">\n                <span class=\"glyphicon glyphicon-plus\"></span> Subscribe\n              </button>\n            </div>\n            <div ng-show=\"isSubscribed()\">\n              <button ng-click=\"unsubscribe()\" class=\"btn btn-block btn-danger\">\n                <span class=\"glyphicon glyphicon-minus\"></span> Unsubscribe\n              </button>\n            </div>\n          </div>\n          <!-- if NOT logged in, login to subscribe button -->\n          <div class=\"text-center\" ng-show=\"!currentUser\">\n            <a class=\"btn btn-block btn-primary\" href=\"#/login\">Login to Subscribe</a>\n          </div>\n        </div>\n\n\n        <div class=\"media-body\">\n          <h2 class=\"media-heading\">\n            {{show.name}}\n            <span class=\"pull-right text-danger\">{{show.rating}}</span>\n          </h2>\n          <h4 ng-show=\"show.status === \'Continuing\'\">\n            <span class=\"glyphicon glyphicon-calendar text-danger\"></span>\n            {{show.airsDayOfWeek}} <em>{{show.airsTime}}</em> on\n            {{show.network}}\n          </h4>\n          <h4 ng-show=\"show.status === \'Ended\'\">\n            Status: <span class=\"text-danger\">Ended</span>\n          </h4>\n          <p>{{show.overview}}</p>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- fromNow is a custom filter, using moment.js library -->\n  <div class=\"alert alert-info\" ng-show=\"nextEpisode\">\n    The next episode starts {{nextEpisode.firstAired | fromNow}}.\n  </div>\n\n  <div class=\"panel panel-default\">\n    <div class=\"panel-heading\">\n      <span class=\"glyphicon glyphicon-play\"></span> Episodes\n    </div>\n    <div class=\"panel-body\">\n      <div class=\"episode\" ng-repeat=\"episode in show.episodes\">\n        <h4>{{episode.episodeName}}\n        <small>Season {{episode.season}}, Episode {{episode.episodeNumber}}</small>\n        </h4>\n        <p>\n          <span class=\"glyphicon glyphicon-calendar\"></span>\n          {{episode.firstAired | date: \'short\'}}\n        </p>\n        <p>{{episode.overview}}</p>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put(" views/home.html","<div class=\"jumbotron\">\n  <div class=\"container\">\n    <ul class=\"alphabet\">\n      <li ng-repeat=\"char in alphabet\">\n        <span ng-click=\"filerByAlphabet(char)\">{{char}}</span>\n      </li>\n    </ul>\n    <ul class=\"genres\">\n      <li ng-repeat=\"genre in genres\">\n        <span ng-click=\"filterByGenre(genre)\">{{genre}}</span>\n      </li>\n    </ul>\n  </div>\n</div>\n\n<div class=\"container\">\n  <div class=\"panel panel-default\">\n    <div class=\"panel-heading\">\n      {{headingTitle}}\n      <div class=\"pull-right\">\n        <input class=\"search\" type=\"text\" ng-model=\"query.name\" placeholder=\"Search... \">\n      </div>\n    </div>\n    <div class=\"panel-body\">\n      <div class=\"row show-list\">\n        <div class=\"col-xs-4 col-md-3\" ng-repeat=\"show in shows | filter:query | orderBy:\'rating\': true\">\n          <a href=\"/shows/{{show._id}}\">\n            <img class=\"img-rounded\" ng-src=\"{{show.poster}}\" width=\"100%\" />\n          </a>\n          <div class=\"text-center\">\n            <a href=\"/shows/{{show._id}}\">{{show.name}}</a>\n            <p class=\"text-muted\">Episodes:  {{show.episodes.length}}</p>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put(" views/login.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"center-form panel\">\n      <div class=\"panel-body\">\n        <h2 class=\"text-center\">Login\n        </h2>\n\n        <form method=\"post\" ng-submit=\"login()\" name=\"loginForm\">\n          <div class=\"form-group\">\n            <input class=\"form-control input-lg\" type=\"text\" name=\"email\" ng-model=\"email\" placeholder=\"Email\" required autofocus>\n          </div>\n\n          <div class=\"form-group\">\n            <input class=\"form-control input-lg\" type=\"password\" name=\"password\" ng-model=\"password\" placeholder=\"Pasword\" required>\n          </div>\n\n          <button type=\"submit\" ng-disabled=\"loginForm.$invalid\" class=\"btn btn-lg btn-block btn-success\">Sign In</button>\n        </form>\n\n      </div>\n    </div>\n  </div>\n</div>\n\n");
$templateCache.put(" views/signup.html","<div class=\"container\">\n  <br/>\n\n  <div class=\"row\">\n    <div class=\"center-form panel\">\n      <form method=\"post\" ng-submit=\"signup()\" name=\"signupForm\">\n        <div class=\"panel-body\">\n          <h2 class=\"text-center\">Sign up</h2>\n\n          <div class=\"form-group\"\n               ng-class=\"{ \'has-success\' : signupForm.email.$valid && signupForm.email.$dirty, \'has-error\' : signupForm.email.$invalid && signupForm.email.$dirty }\">\n            <input class=\"form-control input-lg\" type=\"email\" id=\"email\"\n                   name=\"email\" ng-model=\"email\" placeholder=\"Email\" required\n                   autofocus>\n\n            <div class=\"help-block text-danger\" ng-if=\"signupForm.email.$dirty\"\n                 ng-messages=\"signupForm.email.$error\">\n              <div ng-message=\"required\">Your email address is required.</div>\n              <div ng-message=\"email\">Your email address is invalid.</div>\n            </div>\n          </div>\n\n          <div class=\"form-group\"\n               ng-class=\"{ \'has-success\' : signupForm.password.$valid && signupForm.password.$dirty, \'has-error\' : signupForm.password.$invalid && signupForm.password.$dirty }\">\n            <input class=\"form-control input-lg\" type=\"password\" name=\"password\"\n                   ng-model=\"password\" placeholder=\"Password\" required>\n\n            <div class=\"help-block text-danger\"\n                 ng-if=\"signupForm.password.$dirty\"\n                 ng-messages=\"signupForm.password.$error\">\n              <div ng-message=\"required\">Password is required.</div>\n            </div>\n          </div>\n\n          <div class=\"form-group\"\n               ng-class=\"{ \'has-success\' : signupForm.confirmPassword.$valid && signupForm.confirmPassword.$dirty, \'has-error\' : signupForm.confirmPassword.$invalid && signupForm.confirmPassword.$dirty }\">\n            <input class=\"form-control input-lg\" type=\"password\"\n                   name=\"confirmPassword\" ng-model=\"confirmPassword\"\n                   repeat-password=\"password\" placeholder=\"Confirm Password\"\n                   required>\n\n            <div class=\"help-block text-danger my-special-animation\"\n                 ng-if=\"signupForm.confirmPassword.$dirty\"\n                 ng-messages=\"signupForm.confirmPassword.$error\">\n              <div ng-message=\"required\">You must confirm password.</div>\n              <div ng-message=\"repeat\">Passwords do not match.</div>\n            </div>\n          </div>\n\n          <button type=\"submit\" ng-disabled=\"signupForm.$invalid\"\n                  class=\"btn btn-lg btn-block btn-primary\">Create Account\n          </button>\n        </div>\n      </form>\n    </div>\n  </div>\n</div>\n");}]);