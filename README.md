# TO-DO LIST
El proyecto se basa en el típico gestor de tareas “to-do”, incorporándole un añadido de “folders” que sirven para gestionar aún mejor las anotaciones del usuario. Se pueden filtrar por tareas hechas y tareas sin hacer, además de editar, eliminar parcial y definitivamente todas las tareas creadas. Los usuarios pueden crearse una cuenta con correo electrónico y contraseña, la cual está cifrada y gestionada por firebase desde el frontend. El sitio es responsive, lo que permite ser utilizado tanto en desktop como en mobile sin perder ninguna funcionalidad.


## TO-DO next:
Quedan algunas funcionalidades por crear para que el sistema quede completamente utilizable en el día a día:
Modal dialogs de confirmación al eliminar tasks y folders para mejorar la UX.
Botones para borrar o vaciar todas las tasks de la papelera o de un filtro.
Funcionalidad de pomodoro.
Funcionalidad de gestión del usuario (cambiar username, mail, password, avatar, etc.)
FIX de algunos errores menores.


## CMDs para la ejecución:
npm install
npm run dev


## Paquetes instalados - BE:
cors
dotenv
express
mongoose
nodemon (como dev dependency)

## Paquetes instalados - FE:
axios
firebase
react-hook-form
@hookform/resolvers
react-router
joi
framer-motion
lucide-react
react-icons
react-toastify


## Entidades y relaciones:
User
Posee su propio array de Tasks y de Folders.
Posee el UID de firebase, un username, un avatar, un email y un booleano isActive.
Task
Posee un User creador y un Folder que lo contiene.
Posee un title, dos booleanos: isCompleted e isActive.
Folder
Posee su propio array de Tasks.
Tiene un title.


## Endpoints y sus rutas:
User:
createUser - (POST) http://localhost:3000/api/users/
getUsers - (GET) http://localhost:3000/api/users/
getUserById - (GET) http://localhost:3000/api/users/:firebaseUid
updateUser - (PUT) http://localhost:3000/api/users/update/:firebaseUid
disableUser - (PATCH) http://localhost:3000/api/users/disable/:firebaseUid
enableUser - (PATCH) http://localhost:3000/api/users/enable/:firebaseUid
deleteUser - (DELETE) http://localhost:3000/api/users/:firebaseUid

Task:
createTask - (POST) http://localhost:3000/api/task/
getTasks - (GET) http://localhost:3000/api/task/
getTasksById - (GET) http://localhost:3000/api/task/:id
getTasksByUser - (GET) http://localhost:3000/api/task/user/:firebaseUid
getTasksByFolder - (GET) http://localhost:3000/api/task/folder/:folderId
updateTitle - (PATCH) http://localhost:3000/api/task/update/:id
completeTask - (PATCH) http://localhost:3000/api/task/complete/:id
undoneTask - (PATCH) http://localhost:3000/api/task/undone/:id
disableTask - (PATCH) http://localhost:3000/api/task/disable/:id
enableTask - (PATCH) http://localhost:3000/api/task/enable/:id
deleteTask - (DELETE) http://localhost:3000/api/task/:id/:firebaseUid

Folder:
createFolder - (POST) http://localhost:3000/api/folder/
getFolders - (GET) http://localhost:3000/api/folder/
getFolderById - (GET) http://localhost:3000/api/folder/:id
getFoldersByUser - (GET) http://localhost:3000/api/folder/user/:firebaseUid
updateTitle - (PATCH) http://localhost:3000/api/folder/update/:id
deleteFolder - (DELETE) http://localhost:3000/api/folder/:id/:firebaseUid

## Anotaciones sobre algunos endpoints:
getUserById trae por params el UID de firebase, y no el id de la DB de mongo.
createTask debe traer si o si por el body de la request un UID y un folderID para poder ser asignados al nuevo task que se está creando. Aplico bidireccionalidad en la relación de User-Task y Folder-Task.
deleteTask elimina su referencia del array de tasks del usuario autenticado, y luego elimina físicamente ese mismo task.
createFolder debe traer si o si por el body de la request el UID del usuario autenticado para poder asignar la nueva folder creada al array de folders del usuario.
deleteFolder quita las referencias de las tasks que pertenecen a esa folder del array de tasks del user, luego quita las referencias del folder del array de folders del user. Por último, elimina físicamente todas las tasks asociadas a la folder, y termina eliminando a la folder en sí.


## Happy path:
El usuario registra una cuenta con su correo electrónico, un username y una contraseña.
El usuario lee los mensajes que guían en una mejor experiencia de usuario, y termina creando su primer folder.
El usuario crea su primer task dentro de la nueva folder que creó.
El usuario edita el contenido de la task, la da por completada, y manda la misma a la papelera.
El usuario elimina permanentemente la task de la papelera.
Repite el proceso…
