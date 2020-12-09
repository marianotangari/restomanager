--Archivo para crear las tablas

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--Query para crear la base de datos

CREATE SCHEMA IF NOT EXISTS 'delilahresto';

--Query para crear la tabla de usuarios

CREATE TABLE IF NOT EXISTS users (
    user_id int not null auto_increment,
    usuario varchar(55) not null,
    nombre_apellido varchar(55) not null,
    email varchar(55) not null,
    contrasena varchar(55) not null,
    telefono varchar(55) not null,
    direccion varchar(55) not null,
    is_admin int(10) unsigned not null,
    primary key(user_id)
    );


--Query para crear la tabla de productos 
CREATE TABLE IF NOT EXISTS products(
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR (55) NOT NULL,
    product_price int unsigned NOT NULL,
    img_url VARCHAR(200) NOT NULL,
    description VARCHAR(150) NOT NULL
    );

--Query para crear la tabla de órdenes

CREATE TABLE IF NOT EXISTS orders (
        order_id int NOT NULL AUTO_INCREMENT,
        estado varchar(20) NOT NULL,
        hora varchar(15) NOT NULL,
        descripcion varchar(50) NOT NULL,
        monto int NOT NULL,
        pago boolean NOT NULL,
        user_id int NOT NULL,
        PRIMARY KEY (order_id),
        CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES users (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--Query para crear la tabla intermedia
CREATE TABLE IF NOT EXISTS orders_products(
    order_products_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id int NOT NULL,
    product_id int NOT NULL,
    cantidad_productos int NOT NULL
    );


INSERT INTO users (usuario, nombre_apellido, email, contrasena, telefono, direccion, is_admin)
VALUES ('Federico', 'Federico Sanchez', 'federico.com','48325543','Ameghino 12','klaviers',1);
INSERT INTO users (usuario, nombre_apellido, email, contrasena, telefono, direccion, is_admin)
VALUES ('Ramon', 'Ramon Diaz', 'ramon.com','44321234','Rivadavia 72','river',0);
INSERT INTO users (usuario, nombre_apellido, email, contrasena, telefono, direccion, is_admin)
VALUES ('Juan', 'Juan Segovia', 'juan.com','48761284','Callao 432','hardware',0);
INSERT INTO users (usuario, nombre_apellido, email, contrasena, telefono, direccion, is_admin)
VALUES ('Raul', 'Raul Gonzalez', 'raul.com','48761284','Maipu 4322','hardware',0);

INSERT INTO products (product_name, product_price, img_url, description) 
VALUES ('Bagel de salmon ahumado', '425', 'url', 'Bagel de salmon');
INSERT INTO products (product_name, product_price, img_url, description) 
VALUES ('Hamburguesa clasica', '350', 'url', 'Hamburguesa de la casa');
INSERT INTO products (product_name, product_price, img_url, description)
VALUES ('Sandwich veggie', '310', 'url', 'Delicioso sandwich vegetariano');
INSERT INTO products (product_name, product_price, img_url, description)
VALUES ('Ensalada veggie', '340', 'url', 'Ensalada vegetariana');
INSERT INTO products (product_name, product_price, img_url, description)
VALUES ('Focaccia', '440', 'url', 'Focaccia tradicional italiana');
INSERT INTO products (product_name, product_price, img_url, description)
VALUES ('Sandwich Focaccia', '440', 'url', 'Sandwich de Focaccia');


INSERT INTO orders (estado, hora, descripcion, monto, pago, user_id)
VALUES ('new', '15:34:02', 'Orden guardada','3700','0', 2);


COMMIT;
