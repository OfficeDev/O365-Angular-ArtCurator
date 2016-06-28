# 適用於 Angular 的 Art Curator 

這個範例會示範如何使用 Outlook Mail API 來取得 Office 365 的電子郵件和附件。它針對 &lt;a herf="https://github.com/OfficeDev/O365-iOS-ArtCurator"&gt;iOS&lt;/a&gt;、&lt;a herf="https://github.com/OfficeDev/O365-Android-ArtCurator"&gt;Android&lt;/a&gt;、Web (Angular Web 應用程式) 和 &lt;a herf="https://github.com/OfficeDev/O365-WinPhone-ArtCurator"&gt; 建立。查看我們在  &lt;a herf="https://medium.com/office-app-development"&gt;Medium 上的文章&lt;/a&gt;與此 &lt;a herf="https://www.youtube.com/watch?v=M88A6VB9IIw&amp;feature=youtu.be"&gt;YouTube 上的逐步解說影片&lt;/a&gt;。

Art Curator 提供不同的方法來檢視您的收件匣。假設您擁有一家銷售藝術 T 恤的公司。身為公司的擁有人，您會收到大量藝術家的電子郵件，希望您購買他們的設計。比起使用 Outlook 並開啟每個個別的電子郵件、下載附加的圖片，然後開啟它來檢視；您可以先使用 Art Curator 來預覽收件匣的附件 (../限於 .jpg 和 .png 檔案)，以更有效率的方式挑選所要的設計。

&lt;a herf="./README Assets/AC_Angular.png"&gt;&lt;img src="https://youtu.be/4LOvkweDfhY" alt="Art Curator 螢幕擷取畫面&lt;/a&gt;" title="按一下以檢視動態範例。"&gt;&lt;/img&gt;

這個範例會示範來自 **Outlook Mail API** 的下列作業︰
* [取得資料夾](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetFolders)
* [取得訊息](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Getmessages) (包括篩選和使用選取) 
* [取得附件](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetAttachments)
* [更新訊息](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Updatemessages)
* [建立和傳送訊息](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Sendmessages) (包含和不含附件) 

本範例也會示範使用 [JavaScript 適用的 Active Directory 驗證程式庫 (ADAL)](https://github.com/AzureAD/azure-activedirectory-library-for-js) 進行 Azure Active Directory 的驗證。

<a name="prerequisites"></a>
## 必要條件

此範例需要下列項目：
* [Node.js](https://nodejs.org/)。需要有 Node 才能在開發伺服器上執行範例以及安裝相依項目。 
* Office 365 帳戶。您可以註冊 [Office 365 開發人員訂用帳戶](http://aka.ms/ro9c62)，其中包含開始建置 Office 365 應用程式所需的資源。

<a name="configure"></a>
## 註冊應用程式

1. 若要讓此範例快速地啟動並執行，請移至 [Outlook 開發人員入口網站應用程式註冊工具](https://dev.outlook.com/appregistration)。
2. 在**步驟 1** 中，以現有的 Office 365 帳號登入，或按一下按鈕，以取得免費的試用版。登入後，請繼續下一個步驟。
3. 在**步驟 2** 中，以下列值填寫表單。
	<b> *應用程式名稱︰&lt;/b&gt;Art Curator
	<b> *應用程式類型︰&lt;/b&gt;單頁應用程式 (SPA)
	<b> *重新導向 URI︰&lt;/b&gt;http://127.0.0.1:8080/
	<b> *首頁 URL︰&lt;/b&gt; http://artcurator.{your_subdomain}.com (您 Office 365 租用戶的 .onmicrosoft 子網域)
4. 在**步驟 3** 中，選取**Mail API** 下方的下列權限。
	<b> *閱讀和撰寫郵件&lt;/b&gt;
	<b> *傳送郵件&lt;/b&gt;
5. 在**步驟 4** 中，按一下 [註冊應用程式]<e /> 以 Azure Active Directory 來註冊您的應用程式。
6. 最後，從表單中複製**「用戶端識別碼」**在下一區段中使用。

<a name="run"></a>
## 執行應用程式

開啟 *app/scripts/app.js*，並分別以您指定的 Office 365 租用戶 .onmicrosoft 子網域，和您從「Outlook 開發人員入口網站應用程式註冊工具」所收到，註冊的 Azure 應用程式用戶端識別碼，來取代最後一個步驟中，第 46 和 47 行上的 *{your_tenant}*。 

接下來，安裝所需的相依性，並透過命令列執行專案。開始時，請開啟命令提示字元並瀏覽至根資料夾。一旦到達那裏，請依照下列步驟。

1. 藉由執行 ```npm install``` 來安裝專案相依性。
2. 現在已安裝所有專案相依性，執行根資料夾中的 ```node server.js``` 以啟動程式開發伺服器。
3. 在網頁瀏覽器中瀏覽至 ```http://127.0.0.1:8080/```。

<a name="understand"></a>
## 瞭解程式碼

### 連線至 Office 365

此專案使用[「使用 JavaScript 適用的 Active Directory 驗證程式庫 (ADAL) 的 Azure Active Directory」](https://github.com/AzureAD/azure-activedirectory-library-for-js)來驗證 Azure Active Directory，才能要求並接收使用 Office 365 API 的權杖。

該服務要在模組的組態函數中 *app/app.js* 內設定。在 *app/controllers/navBarController.js* 中，有兩個函數會處理 Azure Active Directory 的登入和登出，它們也處理權杖的取得。 

### Mail API

此專案會使用標準的 REST 呼叫來與 Mail API 互動。請參閱 [「Outlook Mail REST API 參照」](https://msdn.microsoft.com/en-us/office/office365/api/mail-rest-operations)以獲得關於可用端點的詳細資訊。

所有的 Mail API 功能存在於以下路徑：*app/controllers/mainController.js*。首先，它會在使用者租用戶中取得所有可用的資料夾，並使用 *localStorage 中的儲存值*來尋找目標資料夾。在那之後，它會取得 50 封未閱讀而且有附件的最新電子郵件。然後，進行呼叫以取得這些附件中每一個的內容。此時，它已經具有所有的電子郵件和附件的內容，並儲存在可於檢視中顯示的陣列內。

其他包含在 *mainController.js* 內的功能，包括將電子郵件標示為已閱讀和傳送回應。 

### 限制

目前的版本不包含下列功能。

* .png 和 .jpg 以外的檔案支援
* 處理有多個附件的單一電子郵件
* 分頁 (取得 50 封以上的電子郵件)
* 處理資料夾名稱的唯一性
* 提交資料夾必須是最上層的資料夾

## 安全性注意事項
[ADAL JS](https://github.com/AzureAD/azure-activedirectory-library-for-js) 並不會驗證從 Azure AD 所收到的權杖。它依賴應用程式的後端來進行驗證，且在您您呼叫後端之前，都不會知道使用者是否已取得可接受的權杖。基於安全理由，商務應用程式應在 Web 應用程式中，內建供使用者驗證用的伺服器端元件。若沒有這個後端權杖驗證，您的應用程式會受到安全性攻擊，例如[「混淆代理問題」](https://en.wikipedia.org/wiki/Confused_deputy_problem)。看看此[部落格文章](http://www.cloudidentity.com/blog/2015/02/19/introducing-adal-js-v1/)以獲得更多資訊。

<a name="questions-and-comments"></a>
## 問題和建議

- 如果執行此範例有任何問題，請[開立問題](https://github.com/OfficeDev/O365-Angular-ArtCurator/issues)。
- 若您對於 Office 365 API 有任何疑問，請張貼到 [[堆疊溢位]](http://stackoverflow.com/)。請務必以 [Office365] 標記您的問題和建議。
  
<a name="additional-resources"></a>
## 其他資源

* [使用 Office 365 API 來建立 Angular 應用程式](http://aka.ms/get-started-with-js)
* [Office 365 API 平台概觀](http://msdn.microsoft.com/office/office365/howto/platform-development-overview)
* [Office 開發人員中心](http://dev.office.com/)
* [適用於 iOS 的 Art Curator](https://github.com/OfficeDev/O365-iOS-ArtCurator)
* [適用於 Android 的 Art Curator](https://github.com/OfficeDev/O365-Android-ArtCurator)
* [適用於 Windows Phone 的 Art Curator](https://github.com/OfficeDev/O365-WinPhone-ArtCurator)

## 著作權
Copyright (c) 2015 Microsoft.著作權所有，並保留一切權利。

