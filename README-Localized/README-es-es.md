# Art Curator para Angular 

Este ejemplo muestra cómo usar la API de Correo de Outlook para obtener correos electrónicos y datos adjuntos de Office 365. Se ha creado para [iOS](https://github.com/OfficeDev/O365-iOS-ArtCurator), [Android](https://github.com/OfficeDev/O365-Android-ArtCurator), Web (aplicación web Angular) y [Windows Phone](https://github.com/OfficeDev/O365-WinPhone-ArtCurator). Consulte nuestro [artículo en Medium](https://medium.com/office-app-development) y este [vídeo tutorial en YouTube](https://www.youtube.com/watch?v=M88A6VB9IIw&amp;feature=youtu.be).

Art Curator es una forma diferente de ver la bandeja de entrada. Imagine que posee una empresa que vende camisetas artísticas. Como propietario de la empresa, recibe muchos mensajes de correo electrónico de artistas con diseños que desean que compre. En vez de usar Outlook y abrir cada correo electrónico por separado, descargar la imagen adjunta y, a continuación, abrirla para verla, puede usar Art Curator para proporcionarle una primera vista del archivo adjunto (../limitada a archivos .jpg y .png) de su bandeja de entrada para elegir y seleccionar los diseños que le gustan de una forma más eficaz.

[![Art Curator Screenshot](../README Assets/AC_Angular.png)](https://youtu.be/4LOvkweDfhY "Click to see the sample in action.")

Este ejemplo muestra las siguientes operaciones desde la **API de Correo de Outlook**:
* [Obtener carpetas](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetFolders)
* [Obtener mensajes](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Getmessages) (incluyendo la selección de filtrado y uso) 
* [Obtener datos adjuntos](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#GetAttachments)
* [Actualizar mensajes](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Updatemessages)
* [Crear y enviar mensajes](https://msdn.microsoft.com/office/office365/APi/mail-rest-operations#Sendmessages) (con y sin datos adjuntos) 

Este ejemplo también muestra la autenticación con Azure Active Directory mediante la [biblioteca de autenticación de Active Directory (ADAL) para JavaScript](https://github.com/AzureAD/azure-activedirectory-library-for-js).

<a name="prerequisites"></a>
## Requisitos previos

Este ejemplo requiere lo siguiente:
* [Node.js](https://nodejs.org/). Node es necesario para ejecutar el ejemplo en un servidor de desarrollo y para instalar las dependencias. 
* Una cuenta de Office 365. Puede registrarse en [una suscripción a Office 365 Developer](http://aka.ms/ro9c62) que incluye los recursos que necesita para comenzar a crear aplicaciones de Office 365.

<a name="configure"></a>
## Registrar la aplicación

1. Para poner este ejemplo en funcionamiento rápidamente, vaya a la [herramienta de registro de aplicaciones del Portal de desarrollo de Outlook](https://dev.outlook.com/appregistration).
2. En el **Paso 1**, inicie sesión con su cuenta existente de Office 365 o haga clic en el botón para obtener una prueba gratuita. Después de iniciar sesión, vaya al paso siguiente.
3. En el **Paso 2**, rellene el formulario con los siguientes valores.
	* *Nombre de la aplicación:* Art Curator
	* *Tipo de aplicación:* Aplicación de una sola página (SPA)
	* *Identificador URI de redireccionamiento:* http://127.0.0.1:8080/
	* *Dirección URL de página principal:* http://artcurator.{your_subdomain}.com (el subdominio de .onmicrosoft de su inquilino de Office 365)
4. En el **Paso 3**, seleccione los siguientes permisos debajo de **API de correo**.
	* *Leer y escribir correo*
	* *Enviar correo*
5. En el **Paso 4**, haga clic en **Registrar aplicación** para registrar su aplicación con Azure Active Directory.
6. Por último, copie el **identificador de cliente** desde el formulario para usarlo en la siguiente sección.

<a name="run"></a>
## Ejecutar la aplicación

Abra *app/scripts/app.js* y reemplace *{su_inquilino}* con el subdominio de .onmicrosoft que especificó para su inquilino de Office 365 y el identificador de cliente de su aplicación de Azure registrada que recibió desde la herramienta de registro de aplicaciones del Portal de desarrollo de Outlook en el último paso, en las líneas 46 y 47 respectivamente. 

A continuación, instale las dependencias necesarias y ejecute el proyecto a través de la línea de comandos. Empiece abriendo un símbolo del sistema y vaya a la carpeta raíz. Una vez allí, siga los siguientes pasos.

1. Instale las dependencias del proyecto ejecutando ```npm install```.
2. Ahora que todas las dependencias del proyecto están instaladas, inicie el servidor de desarrollo ejecutando ```node server.js``` en la carpeta raíz.
3. Vaya a ```http://127.0.0.1:8080/``` en el explorador web.

<a name="understand"></a>
## Entender el código

### Conectarse a Office 365

Este proyecto usa [Azure Active Directory usando la biblioteca de Azure Active Directory (ADAL) para JavaScript](https://github.com/AzureAD/azure-activedirectory-library-for-js) para autenticar con Azure Active Directory con el fin de solicitar y recibir tokens para su uso con las API de Office 365.

El servicio está configurado en *app/app.js* en la función de configuración del módulo. En *app/controllers/navBarController.js*, hay dos funciones que controlan el inicio y el cierre de sesión de Azure Active Directory, que también controla la adquisición de tokens. 

### API de correo

Este proyecto usa llamadas REST estándar para interactuar con la API de correo. Consulte la [referencia de la API de REST de Correo de Outlook](https://msdn.microsoft.com/en-us/office/office365/api/mail-rest-operations) para obtener información sobre los puntos de conexión disponibles.

Toda la funcionalidad de la API de correo reside en *app/controllers/mainController.js*. En primer lugar, obtiene todas las carpetas disponibles en el inquilino del usuario y usa el valor almacenado en *localStorage* para encontrar la carpeta de destino. A continuación, obtiene los 50 correos electrónicos más recientes que no se han leído y contienen datos adjuntos. Después, se realizan llamadas para obtener el contenido de cada uno de los archivos adjuntos. En este punto, dispone de todos los correos electrónicos y del contenido de los datos adjuntos y se almacenan en una matriz que está disponible para su visualización.

Otra funcionalidad incluida en *mainController.js* incluye marcar los correos electrónicos como leídos y crear y enviar respuestas. 

### Limitaciones

Las características siguientes no se incluyen en la versión actual.

* Compatibilidad de archivos además de .png y .jpg
* Controlar un solo correo electrónico con varios datos adjuntos
* Paginación (obtener más de 50 correos electrónicos)
* Controlar la unicidad del nombre de carpeta
* La carpeta de envío debe ser una carpeta de nivel superior

## Aviso de seguridad
[ADAL JS](https://github.com/AzureAD/azure-activedirectory-library-for-js) no valida el token recibido desde Azure AD. Cuenta con el back-end de la aplicación para hacerlo, y hasta que llame al back-end, no sabe si el usuario obtuvo un token aceptable. Las aplicaciones empresariales deberían tener un componente del lado del servidor para la autenticación integrada del usuario en la aplicación web por motivos de seguridad. Sin esta validación del token del lado del back-end, su aplicación es susceptible a los ataques de seguridad como el [problema "confused deputy"](https://en.wikipedia.org/wiki/Confused_deputy_problem). Consulte esta [publicación del blog](http://www.cloudidentity.com/blog/2015/02/19/introducing-adal-js-v1/) para obtener más información.

<a name="questions-and-comments"></a>
## Preguntas y comentarios

- Si tiene algún problema al ejecutar este ejemplo, [regístrelo](https://github.com/OfficeDev/O365-Angular-ArtCurator/issues).
- Para realizar preguntas generales acerca de las API de Office 365, publíquelas en [Stack Overflow](http://stackoverflow.com/). Asegúrese de que sus preguntas o comentarios se etiquetan con [office365].
  
<a name="additional-resources"></a>
## Recursos adicionales

* [Crear una aplicación de Angular con las API de Office 365](http://aka.ms/get-started-with-js)
* [Información general de la plataforma de las API de Office 365](http://msdn.microsoft.com/office/office365/howto/platform-development-overview)
* [Centro de desarrollo de Office](http://dev.office.com/)
* [Art Curator para iOS](https://github.com/OfficeDev/O365-iOS-ArtCurator)
* [Art Curator para Android](https://github.com/OfficeDev/O365-Android-ArtCurator)
* [Art Curator para Windows Phone](https://github.com/OfficeDev/O365-WinPhone-ArtCurator)

## Copyright
Copyright (c) 2015 Microsoft. Todos los derechos reservados.

