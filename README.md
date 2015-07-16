# Art Curator for Angular 

This sample demonstrates how to use the Outlook Mail API to get emails and attachments from Office 365. It's built for [iOS](https://github.com/OfficeDev/O365-iOS-ArtCurator), [Android](https://github.com/OfficeDev/O365-Android-ArtCurator), Web (Angular web app), and [Windows Phone](https://github.com/OfficeDev/O365-WinPhone-ArtCurator). Check out our [article on Medium](https://medium.com/office-app-development).

Art Curator is a different way to view your inbox. Imagine you own a company that sells artistic t-shirts. As the owner of the company, you receive lots of emails from artists with designs they want you to buy. Instead of using Outlook and opening every individual email, downloading the attached picture, and then opening it to view, you can use Art Curator to give you an attachment-first (limited to .jpg and .png files) view of your inbox to pick and choose designs you like in a more efficient way.

[![Art Curator Screenshot](./README Assets/AC_Angular.png)](https://youtu.be/4LOvkweDfhY "Click to see the sample in action.")

This sample demonstrates the following operations from the **Outlook Mail API**:
* [Get folders](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetFolders)
* [Get messages](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Getmessages) (including filtering and using select) 
* [Get attachments](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetAttachments)
* [Update messages](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Updatemessages)
* [Create and send messages](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Sendmessages) (with and without an attachment) 

This sample also demonstrates authentication with Azure Active Directory using [Active Directory Authentication Library (ADAL) for JavaScript](https://github.com/AzureAD/azure-activedirectory-library-for-js).

<a name="prerequisites"></a>
## Prerequisites

This sample requires the following:
* [Node.js](https://nodejs.org/). Node is required to run the sample on a development server and to install dependencies. 
* An Office 365 account. You can sign up for [an Office 365 Developer subscription](http://aka.ms/ro9c62) that includes the resources that you need to start building Office 365 apps.

<a name="configure"></a>
## Register the app

1. To get this sample up and running quickly, go to the [Outlook Dev Portal App Registration Tool](https://dev.outlook.com/appregistration).
2. In **Step 1**, sign in with your existing Office 365 account or click the button to get a free trial. After you sign in, proceed to the next step.
3. In **Step 2**, fill out the form with the following values.
	* *App Name:* Art Curator
	* *App Type:* Single-Page app (SPA)
	* *Redirect URI:* http://127.0.0.1:8080/
	* *Home Page URL:* http://artcurator.{your_subdomain}.com (the subdomain of .onmicrosoft of your Office 365 tenant)
4. In **Step 3**, select the following permissions underneath **Mail API**.
	* *Read and write mail*
	* *Send mail*
5. In **Step 4**, click **Register App** to register your application with Azure Active Directory.
6. Finally, copy the **Client ID** from the form to use in the next section.

<a name="run"></a>
## Run the app

Open *app/scripts/app.js* and replace *{your_tenant}* with the subdomain of .onmicrosoft you specified for your Office 365 tenant and the client ID of your registered Azure application that you received from the Outlook Dev Portal App Registration Tool in the last step on lines 46 and 47, respectively. 

Next, install the necessary dependencies and run the project via the command line. Begin by opening a command prompt and navigating to the root folder. Once there, follow the steps below.

1. Install project dependencies by running ```npm install```.
2. Now that all the project dependencies are installed, start the development server by running ```node server.js``` in the root folder.
3. Navigate to ```http://127.0.0.1:8080/``` in your web browser.

<a name="understand"></a>
## Understand the code

### Connect to Office 365

This project uses [Azure Active Directory using Azure Active Directory Library (ADAL) for JavaScript](https://github.com/AzureAD/azure-activedirectory-library-for-js) to authenticate with Azure Active Directory in order to request and receive tokens for using the Office 365 APIs.

The service is configured in *app/app.js* in the module's config function. In *app/controllers/navBarController.js*, there are two functions that handle logging in and out of Azure Active Directory which handles acquiring tokens as well. 

### Mail API

This project uses standard REST calls to interact with the Mail API. Refer to the [Outlook Mail REST API reference](https://msdn.microsoft.com/en-us/office/office365/api/mail-rest-operations) for details on the available endpoints.

All of the Mail API functionality lives in *app/controllers/mainController.js*. First, it gets all of the folders available on the user's tenant and uses the stored value in *localStorage* to find the target folder. After that, it gets the 50 most recent emails that are unread and have attachments. Then, calls are made to get the content of each of those attachments. At this point, it has all of the emails and contents of the attachments and they are stored in an array that is made available to the view for display.

Other functionality included in *mainController.js* includes marking emails as read and creating and sending responses. 

### Limitations

The following features are not included in the current version.

* File support beyond .png and .jpg
* Handling a single email with multiple attachments
* Paging (getting more than 50 emails)
* Handling folder name uniqueness
* Submission folder must be a top-level folder

## Security notice
[ADAL JS](https://github.com/AzureAD/azure-activedirectory-library-for-js) does not validate the token received from Azure AD. It relies on the app’s backend to do so, and until you call the backend, you don’t know if the user obtained an acceptable token. Business applications should have a server-side component for user authentication built into the web application for security reasons. Without this backend token validation, your app is susceptible to security attacks such as the [confused deputy problem](https://en.wikipedia.org/wiki/Confused_deputy_problem). Check out this [blog post](http://www.cloudidentity.com/blog/2015/02/19/introducing-adal-js-v1/) for more information.

<a name="questions-and-comments"></a>
## Questions and comments

- If you have any trouble running this sample, please [log an issue](https://github.com/OfficeDev/O365-Angular-ArtCurator/issues).
- For general questions about the Office 365 APIs, post to [Stack Overflow](http://stackoverflow.com/). Make sure that your questions or comments are tagged with [office365].
  
<a name="additional-resources"></a>
## Additional resources

* [Get started with Office 365 APIs in JavaScript web applications](http://aka.ms/get-started-with-js)
* [Office 365 APIs platform overview](http://msdn.microsoft.com/office/office365/howto/platform-development-overview)
* [Office Dev Center](http://dev.office.com/)
* [Art Curator for iOS](https://github.com/OfficeDev/O365-iOS-ArtCurator)
* [Art Curator for Android](https://github.com/OfficeDev/O365-Android-ArtCurator)
* [Art Curator for Windows Phone](https://github.com/OfficeDev/O365-WinPhone-ArtCurator)

## Copyright
Copyright (c) 2015 Microsoft. All rights reserved.