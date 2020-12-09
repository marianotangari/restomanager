DELILAH RESTÓ
Este proyecto consiste en una serie de rutas que se conectan con una base de datos, para la creación de un sistema de pedidos online para un restaurante ficticio que permita realizar operaciones de consultas, modificación, ingreso de productos, usuarios y ordenes.

BASE DE DATOS
Para crear la base de datos SQL, se puede utilizar la herramienta PHPmyAdmin de XAMPP y crear una base de datos con las características que están en el archivo delilah-resto/database/config/sequelize.js (allí se encuentran los datos para poder crear la base).
const Sequelize = require("sequelize");
const host = "localhost"
const port = "3306";
const username = "root";
const password = "";
Una vez creada la base, ejecutar las queries que se encuentran en el archivo delilah-resto/database/sql_queries/queries.sql para crear las tablas y cargar algunos datos de prueba.

SERVER
En el archivo delilah-resto/server/App.js /se encuentra el puerto en el que está configurado el servidor, por default está en el 5000 pero se puede modificar en la línea 8 del archivo. Para inicializar el servidor, ubicarse en la ruta raíz del proyecto(en donde se haya guardado en la máquina local una vez clonado de github) y ejecutar el comando:

npm run start

DEPENDENCIAS
Las dependencias se encuentran en el archivo package.json

DOCUMENTACIÓN DE LA API Y POSTMAN COLLECTION
En el archivo delilah-resto/api/swagger.yaml se encuentran las rutas que se pueden visualizar en swagger. Además, para mayor facilidad se incluye una colección de postman con las rutas para testear las APIs.