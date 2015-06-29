/*
* Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
*/

(function () {
  angular
    .module('artCuratorApp')
    .controller('SettingsController', SettingsController);
  
  // Inject dependencies to protect app from minification.  
  SettingsController.$inject = ['localStorageService', 'adalAuthenticationService', '$location'];
    
  /**
   * The code for SettingsController. Handles the form logic for settings.html. 
   */
  function SettingsController(localStorageService, adalService, $location) {
    var vm = this;
  
    // If user logs out while on the settings page, this will make sure they get sent back to the root.
    if (!adalService.userInfo.isAuthenticated) {
      $location.path('/');
    }

    var settingsKeys = ['targetFolder', 'likeMarkAsRead', 'likeRespond', 'likeResponse', 'dislikeMarkAsRead', 'dislikeRespond', 'dislikeResponse'];
    vm.settingsValues = {};
  
    // Get values from localStorage for all settings.
    settingsKeys.forEach(function (key) {
      vm.settingsValues[key] = localStorageService.get(key + adalService.userInfo.userName);

      if (key != 'targetFolder' && key != 'likeResponse' && key != 'dislikeResponse') {
        vm.settingsValues[key] = localStorageService.get(key + adalService.userInfo.userName) == 'true' || localStorageService.get(key + adalService.userInfo.userName) == true;
      }
    });

    vm.signedInUser = adalService.userInfo.userName;
  
    /**
     * Save settings on click and redirect to the main page.
     */
    vm.saveSettings = function () {
      settingsKeys.forEach(function (key) {
        var result = localStorageService.set(key + adalService.userInfo.userName, vm.settingsValues[key]);

        if (!result) {
          console.log('Error saving :', key);
          vm.error = true;
        }
      });

      $location.path('/');
    };
  
    /**
     * Log out the user and redirect to the root page.
     */
    vm.logOut = function () {
      adalService.logOut();
      $location.path('/');
    };
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