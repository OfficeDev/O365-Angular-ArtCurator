/*
* Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
*/

(function () {
  angular
    .module('artCuratorApp')
    .controller('NavbarController', NavbarController);
    
  // Inject dependencies to protect app from minification.
  NavbarController.$inject = ['adalAuthenticationService', 'localStorageService']; 
    
  /**
   * The code for NavbarController. Basically handles nav bar tasks + default settings.
   */
  function NavbarController(adalService, localStorageService) {
    var vm = this;
    
    // Properties
    vm.isCollapsed;
    
    // Does initialization work for the navbar.
    var activate = function () {
      vm.isCollapsed = true;
      isSettingsSet();
    };
  
    // Click handler for the "Connect" option on the navigation bar.
    vm.login = function () {
      adalService.login();
    };
  
    // Click handler for the "Disconnect" option on the navigation bar.
    vm.logout = function () {
      adalService.logOut();
    };
  
    // Checks if app needs default settings.
    var isSettingsSet = function () {
      var value = localStorageService.get('targetFolder' + adalService.userInfo.userName); 
  
      // If setting wasn't available, set all default settings. 
      if (value == null) {
        setDefaultSettings();
      }
    };
  
    // Sets default settings for app.
    var setDefaultSettings = function () {
      var defaults = [
        ['targetFolder', 'Inbox'],
        ['likeMarkAsRead', true],
        ['likeRespond', true],
        ['likeResponse', "Excellent submission. Please email me at your convenience to discuss a sale."],
        ['dislikeMarkAsRead', true],
        ['dislikeRespond', true],
        ['dislikeResponse', "This submission isn't what I'm looking for. Thank you anyway."]
      ];
  
      // Iterate over settings options, append the signed in username, and set a default setting.
      defaults.forEach(function (setting) {
        var result = localStorageService.set(setting[0] + adalService.userInfo.userName, setting[1]);
        if (!result) {
          console.log('Error setting: ', setting[0]);
        }
      })
    };
  
    // Initialize controller.
    activate();
  };
})();

// *********************************************************
//
// O365-Angular-ArtCurator, https://github.com/OfficeDev/O365-Angular-ArtCurator
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// *********************************************************