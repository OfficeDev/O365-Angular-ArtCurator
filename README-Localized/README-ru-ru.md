# Art Curator для Angular 

В этом примере показано, как извлекать сообщения и вложения из Office 365 с помощью API Почты Outlook. Это приложение создано для [iOS](https://github.com/OfficeDev/O365-iOS-ArtCurator), [Android](https://github.com/OfficeDev/O365-Android-ArtCurator), веб-браузера (веб-приложение на платформе Angular) и [Windows Phone](https://github.com/OfficeDev/O365-WinPhone-ArtCurator). Просмотрите нашу [статью на сайте Medium](https://medium.com/office-app-development) и это [видеоруководство на YouTube](https://www.youtube.com/watch?v=M88A6VB9IIw&amp;feature=youtu.be).

Art Curator воплощает новый подход к просмотру папки "Входящие". Представьте, что вы владеете компанией, которая продает дизайнерские футболки. Как владелец компании вы получаете много сообщений с рисунками от художников. Вместо того чтобы использовать Outlook и открывать каждое сообщение отдельно, скачивать вложенный рисунок и открывать его для просмотра, можно использовать Art Curator для просмотра вложений (только файлы JPG и PNG) из папки "Входящие". Таким образом выбирать понравившиеся рисунки намного удобнее.

[![Art Curator Screenshot](../README Assets/AC_Angular.png)](https://youtu.be/4LOvkweDfhY "Click to see the sample in action.")

В этом примере демонстрируются следующие операции из **API Почты Outlook**:
* [Извлечение папок](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetFolders)
* [Извлечение сообщений](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Getmessages) (в том числе фильтрация и использование выборки) 
* [Извлечение вложений](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetAttachments)
* [Обновление сообщений](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Updatemessages)
* [Создание и отправка сообщений](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Sendmessages) (с вложением или без него) 

Кроме того, в этом примере демонстрируется проверка подлинности в Azure Active Directory с помощью библиотеки [Active Directory Authentication Library (ADAL) для JavaScript](https://github.com/AzureAD/azure-activedirectory-library-for-js).

<a name="prerequisites"></a>
## Необходимые компоненты

Для этого примера требуются следующие компоненты:
* [Node.js](https://nodejs.org/). Платформа Node необходима для установки зависимостей и запуска примера на сервере разработки. 
* Учетная запись Office 365. Вы можете [подписаться на план Office 365 для разработчиков](http://aka.ms/ro9c62), который включает ресурсы, необходимые для создания приложений Office 365.

<a name="configure"></a>
## Регистрация приложения

1. Чтобы быстро настроить и запустить этот пример, перейдите на страницу [Outlook Dev Portal App Registration Tool](https://dev.outlook.com/appregistration).
2. На **шаге 1** войдите с помощью существующей учетной записи Office 365 или нажмите кнопку, чтобы получить бесплатную пробную версию. После входа перейдите к следующему действию.
3. На **шаге 2** заполните форму, используя приведенные ниже значения.
	* *Название приложения:* Art Curator
	* *Тип приложения:* Одностраничное приложение (SPA)
	* *URI перенаправления:* http://127.0.0.1:8080/
	* *URL-адрес домашней страницы:* http://artcurator.{your_subdomain}.com (поддомен .onmicrosoft клиента Office 365)
4. На **шаге 3** выберите следующие разрешения в разделе **API Почты**.
	* *Чтение и создание писем от имени пользователя*
	* *Отправка почты*
5. На **шаге 4** нажмите кнопку **Зарегистрировать приложение**, чтобы зарегистрировать приложение в Azure Active Directory.
6. Наконец, скопируйте **идентификатор клиента** из формы для использования в следующем разделе.

<a name="run"></a>
## Запуск приложения

Откройте файл *app/scripts/app.js* и замените *{your_tenant}* поддоменом .onmicrosoft, который вы указали для своего клиента Office 365, и идентификатором клиента, который вы получили на странице Outlook Dev Portal App Registration Tool на предыдущем шаге, в строках 46 и 47 соответственно. 

Затем установите необходимые зависимости и запустите проект с помощью командной строки. Для начала откройте командную строку и перейдите в корневую папку. Затем выполните указанные ниже действия.

1. Установите зависимости проекта с помощью команды ```npm install```.
2. Теперь, когда все зависимости проекта установлены, запустите сервер разработки с помощью файла ```node server.js``` в корневой папке.
3. Перейдите на страницу ```http://127.0.0.1:8080/``` в веб-браузере.

<a name="understand"></a>
## Сведения о коде

### Подключение к Office 365

Для запроса и получения маркеров при использовании API Office 365 необходима проверка подлинности. В этом проекте она выполняется в Azure Active Directory с помощью библиотеки [Azure Active Directory Library (ADAL) для JavaScript](https://github.com/AzureAD/azure-activedirectory-library-for-js).

Служба настроена в файле *app/app.js* в функции конфигурации модуля. В файле *app/controllers/navBarController.js* есть две функции, которые отвечают за вход в службу Azure Active Directory и выход из нее. Azure Active Directory также отвечает за получение маркеров. 

### API Почты

В этом проекте используются стандартные вызовы REST для связи с API Почты. Дополнительные сведения о доступных конечных точках см. в [справочнике по REST API Почты Outlook](https://msdn.microsoft.com/en-us/office/office365/api/mail-rest-operations) 

Все функции API Почты включены в контроллер *app/controllers/mainController.js*. Сначала он извлекает сведения обо всех папках, доступных на клиенте пользователя, и использует значение в строке *localStorage* для поиска целевой папки. После этого он извлекает сведения о 50 последних непрочитанных сообщениях с вложениями. Затем с помощью вызовов он извлекает содержимое каждого из этих вложений. На этом этапе все сообщения и содержимое вложений извлечены и хранятся в массиве, доступном для просмотра.

Кроме того, контроллер *mainController.js* может помечать сообщения как прочтенные, а также создавать и отправлять ответы. 

### Ограничения

Указанные ниже функции не включены в текущую версию.

* Поддержка типов файлов, отличных от PNG и JPG
* Обработка одного сообщения с несколькими вложениями
* Подкачка (извлечение более 50 сообщений)
* Обработка уникальности имен папок
* Папкой отправки должна быть папка верхнего уровня

## Уведомление по безопасности
[ADAL JS](https://github.com/AzureAD/azure-activedirectory-library-for-js) не проверяет маркер, полученный из Azure AD. За это отвечает серверная часть приложения, и до вызова серверной части неизвестно, получил ли пользователь допустимый маркер. Из соображений безопасности в бизнес-приложения должен быть встроен серверный компонент для проверки подлинности пользователей. Без этой проверки маркеров ваше приложение уязвимо для атак, например [атак на доверие](https://en.wikipedia.org/wiki/Confused_deputy_problem). Дополнительные сведения см. в этой [записи блога](http://www.cloudidentity.com/blog/2015/02/19/introducing-adal-js-v1/).

<a name="questions-and-comments"></a>
## Вопросы и комментарии

— Если у вас не получается запустить этот пример, [сообщите о проблеме](https://github.com/OfficeDev/O365-Angular-ArtCurator/issues).
— Общие вопросы об API Office 365 задавайте на сайте [Stack Overflow](http://stackoverflow.com/). Обязательно помечайте свои вопросы и комментарии тегом [office365].
  
<a name="additional-resources"></a>
## Дополнительные ресурсы

* [Создание приложения Angular с API Office 365](http://aka.ms/get-started-with-js)
* [Обзор платформы API Office 365](http://msdn.microsoft.com/office/office365/howto/platform-development-overview)
* [Центр разработки для Office](http://dev.office.com/)
* [Art Curator для iOS](https://github.com/OfficeDev/O365-iOS-ArtCurator)
* [Art Curator для Android](https://github.com/OfficeDev/O365-Android-ArtCurator)
* [Art Curator для Windows Phone](https://github.com/OfficeDev/O365-WinPhone-ArtCurator)

## Авторские права
(c) Корпорация Майкрософт (Microsoft Corporation), 2015. Все права защищены.

