# Art Curator für Angular 

In diesem Beispiel wird veranschaulicht, wie Sie die Outlook-E-Mail-API verwenden, um E-Mails und Anhänge aus Office 365 abzurufen. Die API ist für [iOS](https://github.com/OfficeDev/O365-iOS-ArtCurator), [Android](https://github.com/OfficeDev/O365-Android-ArtCurator), Web (Angular Web App) und [Windows Phone](https://github.com/OfficeDev/O365-WinPhone-ArtCurator) ausgelegt. Lesen Sie dazu auch unseren [Artikel auf Medium](https://medium.com/office-app-development)  und sehen Sie sich dieses [YouTube-Video mit der exemplarischen Vorgehensweise](https://www.youtube.com/watch?v=M88A6VB9IIw&amp;feature=youtu.be) an.

Mit Art Curator können Sie Ihren Posteingang auf andere Weise anzeigen. Angenommen, Sie besitzen ein Unternehmen, das künstlerisch gestaltete T-Shirts verkauft. Als Inhaber des Unternehmens erhalten Sie eine Vielzahl von E-Mails von Künstlern mit Designs, die Sie von den Künstlern erwerben sollen. Anstatt jede einzelne E-Mail mit Outlook zu öffnen, das angehängte Bild herunterzuladen und es dann zum Ansehen zu öffnen, können Sie mit Art Curator zuerst alle Anhänge Ihres Posteingangs (nur JPG- und PNG-Dateien) anzeigen, um auf effiziente Weise die gewünschten Designs auszuwählen.

[![Art Curator Screenshot](../README Assets/AC_Angular.png)](https://youtu.be/4LOvkweDfhY "Click to see the sample in action.")

In diesem Beispiel werden folgende Vorgänge der **Outlook-E-Mail-API** veranschaulicht:
* [Abrufen von Ordnern](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetFolders)
* [Abrufen von Nachrichten](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Getmessages) (einschließlich Filtern und Verwendung der Auswahl) 
* [Abrufen von Anhängen](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetAttachments)
* [Aktualisieren von Nachrichten](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Updatemessages)
* [Erstellen und Senden von Nachrichten](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Sendmessages) (mit und ohne Anhang) 

In diesem Beispiel wird auch die Authentifizierung mit Azure Active Directory mithilfe der [Active Directory Authentifizierungsbibliothek (Active Directory Authentication Library, ADAL) für JavaScript](https://github.com/AzureAD/azure-activedirectory-library-for-js) veranschaulicht.

<a name="prerequisites"></a>
## Voraussetzungen

Für dieses Beispiel ist Folgendes erforderlich:
* [Node.js](https://nodejs.org/). Node ist für das Ausführen des Beispiels auf einem Entwicklungsserver und für das Installieren der Abhängigkeiten erforderlich. 
* Ein Office 365-Konto. Sie können sich für [ein Office 365-Entwicklerabonnement](http://aka.ms/ro9c62) registrieren. Dieses umfasst die Ressourcen, die Sie zum Erstellen von Office 365-Apps benötigen.

<a name="configure"></a>
## Registrieren der App

1. Um dieses Beispiel schnell nutzen zu können, führen Sie die Anweisungen im [App-Registrierungstool des Outlook-Entwicklerportals](https://dev.outlook.com/appregistration) aus.
2. Melden Sie sich in **Schritt 1** mit Ihrem Office 365-Konto an oder klicken Sie auf die Schaltfläche für eine kostenlose Testversion. Fahren Sie nach der Anmeldung mit dem nächsten Schritt fort.
3. Geben Sie in **Schritt 2** folgende Werte in das Formular ein.
	* *App-Name:* Art Curator
	* *App-Typ:* Single-Page app (SPA)
	* *Umleitungs-URI:* http://127.0.0.1:8080/
	* *Homepage-URL:* http://artcurator.{Ihre_Unterdomäne}.com (.onmicrosoft-Unterdomäne Ihres Office 365-Mandanten)
4. Wählen Sie in **Schritt 3** unter **E-Mail-API** die folgenden Berechtigungen aus.
	* *Lese- und Schreibberechtigungen für E-Mail*
	* *E-Mail senden*
5. Klicken Sie in **Schritt 4** auf **App registrieren**, um Ihre App im Azure Active Directory zu registrieren.
6. Kopieren Sie schließlich die **Client-ID** aus dem Formular, um sie im nächsten Abschnitt zu verwenden.

<a name="run"></a>
## Ausführen der App

Öffnen Sie *app/scripts/app.js* und ersetzen Sie jeweils in den Zeilen 46 und 47 *{your_tenant}* mit der .onmicrosoft-Unterdomäne, die Sie für Ihren Office 365-Mandanten angegeben haben, und der vom Registrierungstool des Outlook-Entwicklerportals empfangenen Client-ID Ihrer für Azure registrierten App. 

Installieren Sie als Nächstes die erforderlichen Abhängigkeiten und führen Sie das Projekt über die Befehlszeile aus. Öffnen Sie dazu als Erstes eine Eingabeaufforderung und navigieren Sie zum Stammordner. Führen Sie anschließend folgende Schritte durch.

1. Installieren Sie die Projektabhängigkeiten, indem Sie ```npm install``` ausführen.
2. Nachdem nun alle Projektabhängigkeiten installiert sind, starten Sie den Entwicklungsserver, indem Sie ```node server.js``` im Stammordner ausführen.
3. Navigieren Sie im Webbrowser zu ```http://127.0.0.1:8080/```.

<a name="understand"></a>
## Grundlegendes zum Code

### Verbinden mit Office 365

Dieses Projekt verwendet für die Authentifizierung bei Azure Active Directory die [Active Directory Authentifizierungsbibliothek (Active Directory Authentication Library, ADAL) für JavaScript](https://github.com/AzureAD/azure-activedirectory-library-for-js), um Token für die Verwendung der Office 365-APIs anzufordern und zu empfangen.

Der Dienst wird in *app/app.js* in der config-Funktion des Moduls konfiguriert. In *app/controllers/navBarController.js* gibt es zwei Funktionen, die die An- und Abmeldung bei Azure Active Directory verarbeiten, welches auch das Abrufen von Token verarbeitet. 

### E-Mail-API

Dieses Projekt verwendet Standard-REST-Aufrufe, um mit der E-Mail-API zu interagieren. Informationen zu den verfügbaren Endpunkten finden Sie im Leitfaden [Outlook Mail REST API](https://msdn.microsoft.com/en-us/office/office365/api/mail-rest-operations).

Sämtliche Funktionen der E-Mail-API befinden sich in *app/controllers/mainController.js*. Zuerst werden alle im Mandanten des Benutzers verfügbaren Ordner abgerufen und mithilfe des in *localStorage* gespeicherten Werts nach dem Zielordner gesucht. Danach werden die 50 aktuellsten E-Mails abgerufen, die ungelesen sind und über Anhänge verfügen. Dann werden Aufrufe ausgeführt, um den Inhalt der einzelnen Anhänge zu abzurufen. An diesem Punkt liegen alle E-Mails und Inhalte der Anhänge vor. Sie werden in einem Array gespeichert, das der anzuzeigenden Ansicht zur Verfügung gestellt wird.

Weitere Funktionen von *mainController.js* sind das Markieren von E-Mails als gelesen und das Erstellen und Versenden von Antworten. 

### Einschränkungen

Die folgenden Funktionen sind in der aktuellen Version nicht enthalten.

* Unterstützung anderer Dateien als .png und .jpg
* Verarbeitung von E-Mails mit mehreren Anhängen
* Paging (Abrufen von mehr als 50 E-Mails)
* Verarbeitung der Eindeutigkeit von Ordnernamen
* Der Ordner zum Senden muss ein Ordner der obersten Ebene sein.

## Sicherheitshinweis
[ADAL JS](https://github.com/AzureAD/azure-activedirectory-library-for-js) überprüft das von Azure AD empfangene Token nicht. Dies ist Aufgabe des Back-End der App, und solange Sie das Back-End nicht aufrufen, wissen Sie nicht, ob der Benutzer ein zulässiges Token erworben hat. Geschäftsanwendungen sollten aus Sicherheitsgründen eine serverseitige Komponente zur Benutzerauthentifizierung in der Webanwendung integriert haben. Ohne diese Überprüfung des Tokens durch das Back-End ist die App anfällig für Angriffe wie z. B. das [Confused-Deputy-Problem](https://en.wikipedia.org/wiki/Confused_deputy_problem). Weitere Informationen finden Sie in diesem [Blogbeitrag](http://www.cloudidentity.com/blog/2015/02/19/introducing-adal-js-v1/).

<a name="questions-and-comments"></a>
## Fragen und Kommentare

- Wenn Sie beim Ausführen dieses Beispiels Probleme haben, [melden Sie sie bitte](https://github.com/OfficeDev/O365-Angular-ArtCurator/issues).
- Allgemeine Fragen zu den Office 365-APIs können Sie auf [Stack Overflow](http://stackoverflow.com/) stellen. Stellen Sie sicher, dass Ihre Fragen oder Kommentare mit [office365] markiert sind.
  
<a name="additional-resources"></a>
## Zusätzliche Ressourcen

* [Erstellen einer Angular-App mit Office 365-APIs](http://aka.ms/get-started-with-js)
* [Office 365-APIs – Plattformübersicht](http://msdn.microsoft.com/office/office365/howto/platform-development-overview)
* [Office Dev Center](http://dev.office.com/)
* [Art Curator für iOS](https://github.com/OfficeDev/O365-iOS-ArtCurator)
* [Art Curator für Android](https://github.com/OfficeDev/O365-Android-ArtCurator)
* [Art Curator für Windows Phone](https://github.com/OfficeDev/O365-WinPhone-ArtCurator)

## Copyright
Copyright (c) 2015 Microsoft. Alle Rechte vorbehalten.
