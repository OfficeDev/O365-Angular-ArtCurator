# Angular 用 Art Curator

このサンプルでは、Outlook メール API を使用して Office 365 からメールと添付ファイルを取得する方法を示します。これは、[iOS](https://github.com/OfficeDev/O365-iOS-ArtCurator)、[Android](https://github.com/OfficeDev/O365-Android-ArtCurator)、Web (Angular Web アプリ)、[Windows Phone](https://github.com/OfficeDev/O365-WinPhone-ArtCurator) 用に作成されています。[article on Medium](https://medium.com/office-app-development) and this [YouTube のチュートリアル ビデオ](https://www.youtube.com/watch?v=M88A6VB9IIw&amp;feature=youtu.be)をご確認ください。

Art Curator は、受信トレイを表示する別の方法です。芸術的な T シャツを販売する会社を経営していると想像してみてください。会社のオーナーであるあなたのもとには、買ってほしいと思うデザインを示したたくさんのメールがアーティストから届きます。Outlook を使用して個々のメールを開き、添付の画像をダウンロードしてから開いて表示する代わりに、Art Curator を使用すると、受信トレイの添付ファイル優先 (..jpg と .png ファイルに限定) ビューが最初に表示され、より効率的な方法で気に入ったデザインを選べるようになります。

[![Art Curator Screenshot](../README Assets/AC_Angular.png)](https://youtu.be/4LOvkweDfhY "Click to see the sample in action.")

このサンプルでは、**Outlook メール API** から行う次の操作を示します。
* [フォルダーの取得](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetFolders)
* [メッセージの取得](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Getmessages) (フィルター処理、および選択の使用を含む)
* [添付ファイルの取得](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetAttachments)
* [メッセージの更新](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Updatemessages)
* [メッセージの作成と送信](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Sendmessages) (添付ファイルがある場合とない場合)

また、このサンプルでは [JavaScript 用 Active Directory 認証ライブラリ (ADAL)](https://github.com/AzureAD/azure-activedirectory-library-for-js) を使用した Azure Active Directory での認証も示しています。

<a name="prerequisites"></a>
## 前提条件

このサンプルを実行するには次のものが必要です。
* [Node.js](https://nodejs.org/)。Node は、開発サーバーでサンプルを実行して、依存関係をインストールするために必要です。
* Office 365 アカウント。Office 365 アプリのビルドを開始するために必要なリソースを含む [Office 365 Developer サブスクリプション](http://aka.ms/ro9c62)にサインアップできます。

<a name="configure"></a>
## アプリを登録する

1. このサンプルをすばやく稼働状態にするには、[Outlook デベロッパー ポータル アプリ登録ツール](https://dev.outlook.com/appregistration)にアクセスしてください。
2. **手順 1** で、既存の Office 365 アカウントでサインインするか、またはボタンをクリックして無料試用版を入手します。サインインした後、次の手順に進みます。
3. **手順 2** で、次の値をフォームに記入します。
	* *アプリ名:* Art Curator
	* *アプリの種類:* Single-Page app (SPA)
	* *リダイレクト URI:* http://127.0.0.1:8080/
	* *ホーム ページ URL:* http://artcurator.{your_subdomain}.com (Office 365 テナントの .onmicrosoft のサブドメイン)
4. **手順 3** で、**メール API** の下の次のアクセス許可を選びます。
	* *メールの読み取りと書き込み*
	* *メールの送信*
5. **手順 4** で、**[アプリの登録]** をクリックして、Azure Active Directory にアプリケーションを登録します。
6. 最後に、次のセクションで使用するフォームから**クライアント ID** をコピーします。

<a name="run"></a>
## アプリの実行

*app/scripts/app.js* を開き、行 46 で *{your_tenant}* を Office 365 テナントのために指定した .onmicrosoft のサブドメインに置き換え、行 47 で最後の手順で Outlook デベロッパー ポータル アプリ登録ツールから受け取った登録済みの Azure アプリケーションのクライアント ID を記入します。

次に、必要な依存関係をインストールし、コマンドラインからプロジェクトを実行します。まず、コマンド プロンプトを開き、ルート フォルダーに移動します。移動したら、以下の手順を行います。

1. ```npm install``` を実行して、プロジェクトの依存関係をインストールします。
2. これで、すべてのプロジェクトの依存関係がインストールされたので、ルート フォルダーで ```node server.js``` を実行して開発サーバーを起動します。
3. Web ブラウザーで ```http://127.0.0.1:8080/``` に移動します。

<a name="understand"></a>
## コードを理解する

### Office 365 への接続

このプロジェクトでは、Office 365 API を使用するためのトークンを要求して受け取るために、[JavaScript 用 Azure Active Directory Library (ADAL) を使用した Azure Active Directory](https://github.com/AzureAD/azure-activedirectory-library-for-js) を使用して Azure Active Directory で認証します。

サービスは、*app/app.js* のモジュールの config 関数内で構成されています。*app/controllers/navBarController.js* には、トークンの取得も処理する Azure Active Directory へのログインとログアウトを処理する 2 つの関数があります。

### メール API

このプロジェクトでは、メール API を操作する標準的な REST 呼び出しを使用します。使用可能なエンドポイントの詳細については、「[Outlook メール REST API リファレンス](https://msdn.microsoft.com/ja-jp/office/office365/api/mail-rest-operations)」をご参照ください。

すべてのメール API 機能は、*app/controllers/mainController.js* にあります。まずユーザーのテナントで利用可能なすべてのフォルダーを取得し、*localStorage* に保存されている値を使用して対象のフォルダーを検索します。その後、ファイルが添付されている未読の直近のメールを 50 通取得します。次に、これらの添付ファイルのそれぞれのコンテンツを取得するために呼び出しが行われます。この時点で、すべてのメールと添付ファイルの内容があり、これらは表示用のビューで使用できる配列に格納されます。

*mainController.js* に含まれるその他の機能には、メールに開封済みマークを付け、返信を作成して送信する機能があります。

### 制限事項

現在のバージョンでは、次の機能は含まれません。

* .png と.jpg 以外のファイルのサポート
* 添付ファイルが複数ある 1 つのメールの処理
* ページング (50 通を超えるメールの受け取り)
* フォルダー名の一意性の処理
* 送信フォルダーは最上位のフォルダーでなければならない

## セキュリティに関する通知
[ADAL JS](https://github.com/AzureAD/azure-activedirectory-library-for-js) では Azure AD から受信したトークンを検証しません。これを行うにはアプリのバックエンドを使用するため、バックエンドを呼び出すまではユーザーが許容可能なトークンを取得していたかどうかが分かりません。セキュリティ上の理由で、ビジネス アプリケーションには、ユーザー認証用のサーバー側コンポーネントが Web アプリケーションに組み込まれている必要があります。このバックエンドのトークン検証がない場合、アプリは [混乱した使節の問題](https://en.wikipedia.org/wiki/Confused_deputy_problem)などのセキュリティ攻撃に対して脆弱になります。詳細については、この [ブログの投稿](http://www.cloudidentity.com/blog/2015/02/19/introducing-adal-js-v1/)をご確認ください。

<a name="questions-and-comments"></a>
## 質問とコメント

このサンプルの実行について問題がある場合は、[問題をログに記録](https://github.com/OfficeDev/O365-Angular-ArtCurator/issues)してください。
Office 365 API 全般の質問については、[Stack Overflow](http://stackoverflow.com/) に投稿してください。質問やコメントには、必ず [office365] のタグを付けてください。
 
<a name="additional-resources"></a>
## その他の技術情報

* [Office 365 API で Angular アプリを作成する](http://aka.ms/get-started-with-js)
* [Office 365 API プラットフォームの概要](http://msdn.microsoft.com/office/office365/howto/platform-development-overview)
* [Office デベロッパー センター](http://dev.office.com/)
* [iOS 用 Art Curator](https://github.com/OfficeDev/O365-iOS-ArtCurator)
* [Android 用 Art Curator](https://github.com/OfficeDev/O365-Android-ArtCurator)
* [Windows Phone 用 Art Curator](https://github.com/OfficeDev/O365-WinPhone-ArtCurator)

## 著作権
Copyright (c) 2015 Microsoft.All rights reserved.

