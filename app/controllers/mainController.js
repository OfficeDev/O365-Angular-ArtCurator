/*
* Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
*/

(function () {
  angular
    .module('artCuratorApp')
    .controller('MainController', MainController)
    .controller('ModalInstanceController', ModalInstanceController)
    .filter('MyShortFilter', MyShortFilter);
  
  // Inject dependencies to protect app from minification.
  MainController.$inject = ['$http', 'localStorageService', '$q', '$modal', 'adalAuthenticationService'];
  ModalInstanceController.$inject = ['$scope', '$modalInstance', 'selectedEmail', 'emailAction', '$q'];
  MyShortFilter.$inject = ['$filter'];
  
  /**
   * The code for MainController. Does heavy lifting for the application and makes the calls to the Office 365 API.
   */
  function MainController($http, localStorageService, $q, $modal, adalService) {
    var vm = this;
    vm.emails = null;
    vm.hasEmailsWithAttachments = false;
  
    /**
     * Checks for ContentType of attachment is supported.
     */
    var isSupportedContentType = function (contentType) {
      // List of support content types. Basic images right now.
      var supportedContentTypes = ['image/jpg', 'image/jpeg', 'image/png'];

      for (var i = 0; i < supportedContentTypes.length; i++) {
        if (supportedContentTypes[i] == contentType) {
          vm.hasEmailsWithAttachments = true;
          return true;
        }
      }
  
      // If code gets here, means that contentType is not supported.
      return false;
    }
  
    /**
     * 1. Gets folders from Exchange.
     * 2. If target folder is found, get emails in it. If not, show error.
     * 3. Get attachments from emails. If valid content type, construct data URi. If not, ignore.
     */
    if (adalService.userInfo.isAuthenticated) {
      $http.get('https://outlook.office365.com/api/v1.0/me/folders')
        .then(function (response) {
        console.log('Got folders from Exchange...');
        var folders = response.data.value;

        var targetFolderName = localStorageService.get('targetFolder' + adalService.userInfo.userName);
        var targetFolder = null;
  
        // Iterate over returned olders until target folder is found.
        folders.some(function (folder) {
          if (folder.DisplayName == targetFolderName) {
            targetFolder = folder;
            return true;
          }
        });
  
        // Get messages from targetFolder, if found.
        if (targetFolder == null) {
          vm.folderError = true;
        } else {
          // Get the 50 most recent, unread emails that have attachments from target folder.
          $http.get('https://outlook.office365.com/api/v1.0/me/folders/' + targetFolder.Id + '/messages?$filter=HasAttachments eq true AND IsRead eq false&$top=50&$orderby=HasAttachments,DateTimeReceived desc')
            .then(function (response) {
            console.log('Got messages from ' + targetFolder.DisplayName + ' folder.');
            vm.emails = response.data.value;
  
            // Show error message if no emails were returned from query.
            if (vm.emails.length == 0) {
              vm.messagesError = true;
            } else {
              // Add HTTP requests to a promises array so further execution is halted until all complete. 
              var promises = [];
  
              //$http.defaults.headers.common.Accept = 'text/plain';
              // Get attachments of each returned message.
              vm.emails.some(function (email) {
                promises.push(
                  $http.get('https://outlook.office365.com/api/v1.0/me/messages/' + email.Id + '/attachments?$select=ContentType')
                    .then(function (response) {
                    // Check content type of attachment to see if it's supported (list in isSupportedContentType).
                    if (!isSupportedContentType(response.data.value[0].ContentType)) {
                      console.log('An email with an unsupported content type was ignored.');
                      removeById(email.Id);
                    } else {
                      console.log("Getting attachment for email with subject: " + email.Subject);

                      promises.push(
                        // An email with and attachment with a valid ContentType has been found, get it.  
                        $http.get('https://outlook.office365.com/api/v1.0/me/messages/' + email.Id + '/attachments/' + response.data.value[0].Id)
                          .then(function (response) {
                          var imageUrl = "data:" + response.data.ContentType + ";base64," + response.data.ContentBytes;
                          email.AttachmentSrc = imageUrl;
                          email.AttachmentName = response.data.Name;
                          email.DateTimeReceived = new Date(email.DateTimeReceived);
                        }, function (error) {
                            console.log('Failed to download attachment.', error);
                          })
                        );
                    }
                  }, function (error) {
                      console.log('Failed to get attachment for ' + email.Subject + ' email.', error);
                    })
                  );
              });
  
              // Wait for all HTTP requests to complete until taking further action. 
              $q.all(promises)
                .then(function (response) {
                console.log('Processed all emails.');

                if (!vm.hasEmailsWithAttachments) {
                  console.log('No new submissions in this folder.');
                  vm.messagesError = true;
                }
              });
            }
          }, function (error) {
              console.log('Failed to get messages from ' + targetFolder.DisplayName + ' folder.', error);
            });
        };
      }, function (error) {
          console.log('Failed to get folders from Exchange.', error);
        });
    };
  
    /**
     * Function to take action on the email that a user selects.
     */
    var emailAction = function (type, email) {
      var info;
      var markAsRead;
      var respond;
      var response;
  
      // Determine which action was requested and fetch settings based on that.
      if (type == 'like') {
        info = 'Performing like actions...';
        markAsRead = localStorageService.get('likeMarkAsRead' + adalService.userInfo.userName);
        respond = localStorageService.get('likeRespond' + adalService.userInfo.userName);
        response = localStorageService.get('likeResponse' + adalService.userInfo.userName);
      } else if (type == 'dislike') {
        info = 'Performing dislike actions...';
        markAsRead = localStorageService.get('dislikeMarkAsRead' + adalService.userInfo.userName);
        respond = localStorageService.get('dislikeRespond' + adalService.userInfo.userName);
        response = localStorageService.get('dislikeResponse' + adalService.userInfo.userName);
      }
  
      // Add HTTP requests to a promises array so further execution is halted until all complete. 
      var promises = [];
  
      // Mark email as read if setting calls for it.
      if (markAsRead == true || markAsRead == 'true') {
        var markRequest = {
          method: 'PATCH',
          url: 'https://outlook.office365.com/api/v1.0/me/messages/' + email.Id,
          data: {
            "IsRead": true
          }
        };

        promises.push(
          $http(markRequest)
            .then(function (response) {
            console.log('Marked email as read.');
            removeById(email.Id);
          }, function (error) {
              console.log('Unable to mark message as read. Check app permissions.', error);
            })
          );
      }
  
      // Respond to the email if setting calls for it.
      if (respond == true || respond == 'true') {
        var respondRequest = {
          method: 'POST',
          url: 'https://outlook.office365.com/api/v1.0/me/sendmail',
          data: {
            'Message': {
              'Subject': 'RE: ' + email.Subject,
              'Body': {
                'ContentType': 'Text',
                'Content': response
              },
              'ToRecipients': [{
                'EmailAddress': {
                  'Address': email.Sender.EmailAddress.Address
                }
              }]
            },
            'SaveToSentItems': 'true'
          }
        };

        promises.push(
          $http(respondRequest)
            .then(function (response) {
            console.log('Responded to email.');
          }, function (error) {
              console.log('Unable to send response. Check app permissions.', error);
            })
          );
      }

      return promises;
    };
  
    /**
     * Function to remove an email from the collection of emails by its ID. 
     */
    var removeById = function (id) {
      for (var i = 0; i < vm.emails.length; i++) {
        if (vm.emails[i].Id == id) {
          vm.emails.splice(i, 1);
          break;
        }
      }

      if (vm.emails.length == 0) {
        console.log('No more submissions left in folder.');
        vm.messagesError = true;
      }
    };
  
    /**
     * Click handler for when a user clicks on an attachment to bring up the details modal.
     */
    vm.open = function (size, selectedEmail) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceController',
        controllerAs: 'modal',
        size: size,
        resolve: {
          selectedEmail: function () {
            return selectedEmail;
          },
          emailAction: function () {
            return emailAction;
          }
        }
      });

      modalInstance.result.then(function () { }, function () {
        console.log('User took no action on the selected email.');
      });
    };
  
    /**
     * Function to send three emails with a supported ContentType to the user's inbox. 
     */
    vm.populateInboxWithArt = function () {
      var stockImages = [
        'Aero.png',
        'Bird-art.png',
        'Facial.png',
        'Fearther-art.png',
        'guitar-art.png',
        'Leakage.png',
        'MS Robot.png',
        'Mountain-art.png',
        'Win.png',
      ];
  
      // Add HTTP requests to a promises array so further execution is halted until all complete. 
      var promises = [];
      for (var i = 0; i < stockImages.length; i++) {
        promises.push(sendStockImageEmail(stockImages[i]));
      };
  
      // After all emails are sent, inform the user. 
      $q.all(promises).then(function () {
        vm.emailsSentMessage = stockImages.length + ' new submissions have been sent to Inbox. Refresh the page when you receive them and move them to your target folder.';
      });
    };
  
    /**
     * Function to convert a local image file to a base 64 encoded string to send via email.
     */
    var getContentBytes = function (fileName) {
      return $q(function (resolve, reject) {
        // Construct file path.
        fileName = '../../assets/' + fileName;
  
        // Construct HTTP request.
        var request = {
          url: fileName,
          method: 'GET',
          responseType: 'blob'
        };
  
        // Fire HTTP request and read resulting file as a binary string. 
        $http(request)
          .then(function (response) {
          var reader = new FileReader();
  
          // After reader reads the file, encode it to base 64.
          reader.onload = function (readFile) {
            var binaryString = readFile.target.result;
            resolve(btoa(binaryString));
          };

          reader.readAsBinaryString(response.data);
        }, function (error) {
            reject('Unable to read image file.', error);
          });
      });
    };
  
    /**
     * Function to send an email with an attachment to the signed in user to populate Inbox. 
     */
    var sendStockImageEmail = function (fileName) {
      return $q(function (resolve, reject) {
        // Get base 64 encoded string of an image, then send it.
        getContentBytes(fileName).then(function (contentBytes) {
          // Construct HTTP request.
          var request = {
            method: 'POST',
            url: 'https://outlook.office365.com/api/v1.0/me/sendmail',
            data: {
              'Message': {
                'Subject': fileName,
                'Body': {
                  'ContentType': 'Text',
                  'Content': 'Check out ' + fileName + '!'
                },
                'ToRecipients': [{
                  'EmailAddress': {
                    'Address': adalService.userInfo.userName
                  }
                }],
                "Attachments": [{
                  "@odata.type": '#Microsoft.OutlookServices.FileAttachment',
                  "Name": fileName,
                  "ContentBytes": contentBytes,
                  "ContentType": 'image/png'
                }],
              },
              'SaveToSentItems': 'true'
            }
          };
    
          // Fire HTTP request to send an email to the signed in user with an attachment. 
          $http(request)
            .then(function (response) {
            console.log('Sent ' + fileName + ' to Inbox.');
            resolve();
          }, function (error) {
              console.log('Unable to send email. Check app permissions.');
              reject();
            });
        });
      });
    };
  };
  
  /**
   * Controller for the modal that opens when a user clicks on an email.
   */
  function ModalInstanceController($scope, $modalInstance, selectedEmail, emailAction, $q) {
    var vm = this;
    vm.email = selectedEmail;
  
    // Click handler for the like button on the emails detail modal.
    vm.like = function () {
      console.log('User clicked like.');
      $q.all(emailAction('like', selectedEmail)).then(function () {
        $modalInstance.close();
      });
    };
  
    // Click handler for the dislike button on the emails detail modal.  
    vm.dislike = function () {
      console.log('User clicked dislike.');
      $q.all(emailAction('dislike', selectedEmail)).then(function () {
        $modalInstance.close();
      });
    };
  };
  
  /**
   * Customer filter to display time in the format we want (mirrors Outlook).
   */
  function MyShortFilter($filter) {
    return function (text) {
      var dateObject = new Date(text);
      return $filter('date')(dateObject, "EEEE M/d/yyyy h:mm a");
    }
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