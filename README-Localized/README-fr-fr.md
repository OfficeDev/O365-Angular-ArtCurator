# Art Curator pour Angular 

Cet exemple présente comment utiliser l’API de messagerie Outlook pour obtenir des messages électroniques et des pièces jointes à partir d’Office 365. Il est conçu pour [iOS](https://github.com/OfficeDev/O365-iOS-ArtCurator), [Android](https://github.com/OfficeDev/O365-Android-ArtCurator), Web (application web Angular) et [Windows Phone](https://github.com/OfficeDev/O365-WinPhone-ArtCurator). Consultez notre [article sur Medium](https://medium.com/office-app-development) et cette [vidéo YouTube présentant la procédure pas à pas](https://www.youtube.com/watch?v=M88A6VB9IIw&amp;feature=youtu.be).

Art Curator propose une nouvelle façon d’afficher votre boîte de réception. Imaginez que vous êtes propriétaire d’une entreprise qui vend des tee-shirts artistiques. En tant que propriétaire de l’entreprise, vous recevez de nombreux messages électroniques de la part d’artistes comportant des conceptions qu’ils tentent de vous vendre. Au lieu d’utiliser Outlook et d’ouvrir chaque message individuellement, de télécharger l’image jointe, puis de l’ouvrir pour l’afficher, vous pouvez utiliser Art Curator pour avoir un premier aperçu des pièces jointes de votre boîte de réception (../limité aux fichiers .jpg et .png) afin de sélectionner et choisir les conceptions qui vous plaisent de façon plus efficace.

[![Art Curator Screenshot](../README Assets/AC_Angular.png)](https://youtu.be/4LOvkweDfhY "Click to see the sample in action.")

Cet exemple illustre les opérations suivantes à réaliser à partir de l’**API de messagerie Outlook** :
* [Obtenir des dossiers](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetFolders)
* [Obtenir des messages](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Getmessages) (y compris le filtrage et la sélection) 
* [Obtenir des pièces jointes](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetAttachments)
* [Mettre à jour des messages](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Updatemessages)
* [Créer et envoyer des messages](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Sendmessages) (avec et sans pièce jointe) 

Cet exemple présente également l’authentification auprès d’Azure Active Directory à l’aide d’[ADAL (Active Directory Authentication Library) pour JavaScript](https://github.com/AzureAD/azure-activedirectory-library-for-js).

<a name="prerequisites"></a>
## Conditions requises

Cet exemple nécessite les éléments suivants :
* [Node.js](https://nodejs.org/). Node est requis pour exécuter l’exemple sur un serveur de développement et installer des dépendances. 
* Un compte Office 365. Vous pouvez vous inscrire à [Office 365 Developer](http://aka.ms/ro9c62) pour accéder aux ressources dont vous avez besoin pour commencer à créer des applications Office 365.

<a name="configure"></a>
## Inscription de l’application

1. Pour configurer et exécuter cet exemple rapidement, utilisez l’[outil d’inscription d’application auprès du portail de développement Outlook](https://dev.outlook.com/appregistration).
2. À l’**étape 1**, connectez-vous avec votre compte Office 365 existant ou cliquez sur le bouton pour obtenir une version d’évaluation gratuite. Une fois que vous êtes connecté, passez à l’étape suivante.
3. À l’**étape 2**, remplissez le formulaire avec les valeurs suivantes.
	* *Nom d’application :* Art Curator
	* *Type d’application :* application monopage (SPA)
	* *URI de redirection :* http://127.0.0.1:8080/
	* *URL de la page d’accueil :* http://artcurator.{votre_sous-domaine}.com (le sous-domaine .onmicrosoft de votre client Office 365)
4. À l’**étape 3**, sélectionnez les autorisations suivantes sous **API de messagerie**.
	* *Lire et écrire un courrier électronique*
	* *Envoyer un courrier électronique*
5. À l’**étape 4**, cliquez sur **Inscrire l’application** pour inscrire votre application auprès d’Azure Active Directory.
6. Enfin, copiez l’**ID client** à partir du formulaire à utiliser dans la section suivante.

<a name="run"></a>
## Exécuter l’application

Ouvrez *app/scripts/app.js* et remplacez *{votre_client}* par le sous-domaine .onmicrosoft que vous avez indiqué pour votre client Office 365 et l’ID client de votre application Azure inscrite envoyé par l’outil d’inscription d’application auprès du portail de développement Outlook lors de la dernière étape (lignes 46 et 47, respectivement). 

Ensuite, installez les dépendances nécessaires et exécutez le projet par l’intermédiaire de la ligne de commande. Commencez par ouvrir une invite de commandes et accédez au dossier racine. Une fois que vous l’avez trouvé, suivez les étapes ci-dessous.

1. Installez des dépendances du projet en exécutant ```npm install```.
2. Maintenant que toutes les dépendances du projet sont installées, démarrez le serveur de développement en exécutant ```node server.js``` dans le dossier racine.
3. Accédez à ```http://127.0.0.1:8080/``` dans votre navigateur web.

<a name="understand"></a>
## Comprendre le code

### Connexion à Office 365.

Ce projet utilise [Azure Active Directory à l’aide d’ADAL (Azure Active Directory Library) pour JavaScript](https://github.com/AzureAD/azure-activedirectory-library-for-js) pour s’authentifier auprès d’Azure Active Directory afin de demander et de recevoir des jetons pour pouvoir utiliser des API Office 365.

Le service est configuré dans *app/app.js* dans la fonction de configuration du module. Dans *app/controllers/navBarController.js*, il existe deux fonctions qui gèrent la connexion à Azure Active Directory et la déconnexion. Azure Active Directory gère également l’acquisition de jetons. 

### API de messagerie

Ce projet utilise des appels REST standard qui permettent d’interagir avec l’API de messagerie. Reportez-vous à l’article relatif à la [référence d’API REST de messagerie Outlook](https://msdn.microsoft.com/en-us/office/office365/api/mail-rest-operations) pour plus d’informations sur les points de terminaison disponibles.

L’ensemble des fonctionnalités d’API de messagerie se trouvent dans le fichier *app/controllers/mainController.js*. Tout d’abord, elle obtient tous les dossiers disponibles sur le client de l’utilisateur et utilise la valeur stockée dans *localStorage* pour rechercher le dossier cible. Après cela, elle obtient les 50 derniers courriers électroniques non lus comportant des pièces jointes. Ensuite, des appels sont émis pour obtenir le contenu de toutes ces pièces jointes. À ce stade, elle comporte tous les courriers électroniques et l’ensemble du contenu des pièces jointes qui sont stockés dans une matrice affichable.

D’autres fonctionnalités incluses dans *mainController.js* comprennent le marquage des courriers électroniques comme lus, ainsi que la création et l’envoi de réponses. 

### Limitations

Les fonctionnalités suivantes ne sont pas incluses dans la version actuelle.

* Prise en charge de formats de fichiers autres que .png et .jpg
* Gestion d’un courrier électronique unique avec plusieurs pièces jointes
* Pagination (réception de plus de 50 courriers électroniques)
* Gestion de l’unicité des noms de dossiers
* Dossier de soumission devant être un dossier de niveau supérieur

## Note de sécurité
[ADAL JS](https://github.com/AzureAD/azure-activedirectory-library-for-js) ne valide pas le jeton envoyé par Azure Active Directory. Cette validation incombe au serveur principal de l’application, et jusqu’à ce que vous appeliez ce dernier, vous ne savez pas si l’utilisateur a obtenu un jeton acceptable. Pour des raisons de sécurité, les applications d’entreprise doivent comporter un composant côté serveur intégré à l’application web pour l’authentification des utilisateurs. Sans la validation du jeton par le serveur principal, votre application est vulnérable aux attaques de sécurité, telles que les [problèmes de député confus (confused deputy problem)](https://en.wikipedia.org/wiki/Confused_deputy_problem). Consultez ce [billet de blog](http://www.cloudidentity.com/blog/2015/02/19/introducing-adal-js-v1/) pour plus d’informations.

<a name="questions-and-comments"></a>
## Questions et commentaires

- Si vous rencontrez des problèmes lors de l’exécution de cet exemple, veuillez [les consigner](https://github.com/OfficeDev/O365-Angular-ArtCurator/issues).
- Pour des questions générales relatives aux API Office 365, publiez sur [Stack Overflow](http://stackoverflow.com/). Posez vos questions avec la balise [office365].
  
<a name="additional-resources"></a>
## Ressources supplémentaires

* [Création d’une application Angular avec des API Office 365](http://aka.ms/get-started-with-js)
* [Présentation de la plateforme des API Office 365](http://msdn.microsoft.com/office/office365/howto/platform-development-overview)
* [Centre de développement Office](http://dev.office.com/)
* [Art Curator pour iOS](https://github.com/OfficeDev/O365-iOS-ArtCurator)
* [Art Curator pour Android](https://github.com/OfficeDev/O365-Android-ArtCurator)
* [Art Curator pour Windows Phone](https://github.com/OfficeDev/O365-WinPhone-ArtCurator)

## Copyright
Copyright (c) 2015 Microsoft. Tous droits réservés.
