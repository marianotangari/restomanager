const express = require('express');
const dependencies = require('../../database/config/sequelize');
const token = require('../auth/Token');
const { sequelize } = require('../../database/config/sequelize');
const status = require('../utils/Status');


async function findUserName (userName) {
    const user = await dependencies.sequelize.query(`SELECT usuario FROM users WHERE usuario = '${userName}'`, 
    {type: dependencies.sequelize.QueryTypes.SELECT});
    return user;
}

async function findUserNameById (id) {
    const user = await dependencies.sequelize.query(`SELECT usuario FROM users WHERE user_id = '${id}'`, 
    {type: dependencies.sequelize.QueryTypes.SELECT});
    return user;
}

async function findUser (password, username) {
    const user = await dependencies.sequelize.query(`SELECT contrasena,is_admin,user_id FROM users WHERE contrasena = '${password}'
     AND usuario= '${username}'`, {type: dependencies.sequelize.QueryTypes.SELECT});
    return user;
}

async function validateUserCredential(userName, password) {
    const user = await findUser(password, userName);
    let jwt;
    if(user.length != 0) {
        const signature = token.signature;
        jwt = token.JWT.sign({userName, password}, signature);
    }else {
        jwt = 0; 
    }
    return jwt;
}

async function verifyToken(tkn) {
    const validateToken = token.JWT.verify(tkn, token.signature);
    const find = await findUser(validateToken.password, validateToken.userName).catch();
    return (find.length > 0 && find[0].is_admin === 1);
}

async function getUsers() {
    const [select] = await dependencies.sequelize.query('SELECT * FROM users');
    return select;
}

async function registerUser(userName, name, mail, phone, adress, password, is_admin) {
    const user = await findUserName(userName).catch();
    if(user.length != 0)
        return "Nombre de usuario ya en uso";
    else{
        if(userName != null && userName.trim() != "" && name != null && mail != null && phone != null && 
        adress != null && password != null && (is_admin === 1 || is_admin === 0)){
            const newUser = await dependencies.sequelize.query('INSERT INTO users (usuario, nombre_apellido, email, telefono, direccion, contrasena, is_admin) '
            + `VALUES ('${userName.trim()}','${name}','${mail}','${phone}','${adress}','${password}','${is_admin}')` );
            return 'Ok';
        }else{
            return 'Parámetros incorrectos o faltantes';
        }
    }     
}

async function postProducts(nombreProducto, precioProducto, imgProducto, descripcion) {
    const post = await dependencies.sequelize.query(`INSERT INTO products(product_name, product_price, img_url, description) VALUES('${nombreProducto}','${precioProducto}','${imgProducto}','${descripcion}')`);
    return post;
}

async function getProducts() {
    const [selectProducts] = await dependencies.sequelize.query('SELECT * FROM products');
    return selectProducts;
}

async function deleteProducts(id) {
    if(await getProduct(id) != undefined ) {
        const deleteProduct = await dependencies.sequelize.query(`DELETE FROM products WHERE product_id = '${id}'`);
        return deleteProduct;
    }
    else 
        return 0;
}

async function getProduct(id) {
    const [product] =  await dependencies.sequelize.query(`SELECT * FROM products WHERE product_id = ${id}`, 
    {type: dependencies.sequelize.QueryTypes.SELECT});
     return product;
}

async function putProduct(id, price, name, img, description) {
    if(await getProduct(id) != undefined && price != undefined && name != undefined && 
    img != undefined && description != undefined) {
        const putProduct = await dependencies.sequelize.query(`UPDATE products SET product_price = '${price}',
         product_name = '${name}', img_url = '${img}', description = '${description}' WHERE product_id = '${id}'`);
        return putProduct;
    }
    else 
        return 0;
}

async function postOrder(user_id, products, pago) {
    let resultado = 'Parámetros incorrectos o faltantes';
    if(pago != undefined &&  user_id != undefined) {
        const estado = status.orderStatus[0];
        let hora = new Date(Date.now());
		let descripcion = ""; 
		let monto = 0; 
        hora = hora.toString().substring(16, 24);
        const getProducts = products.map(async function(id) {
            id = await getProduct(id.product_id);
            return id});
        let productsList = await Promise.all(getProducts);
		if (productsList.some(elem => elem == undefined))
            resultado = 'Producto/s no encontrado/s';
        else {
            const descripcion = "Orden guardada";
            for (i = 0; i < products.length; i ++)
				monto += productsList[i].product_price * products[i].quantity;
			const insertOrder = await dependencies.sequelize.query(`INSERT INTO orders(estado, hora, descripcion, monto, pago, user_id)
                VALUES ('${estado}', '${hora}', '${descripcion}', ${monto}, ${pago}, ${user_id})`);
			for (i = 0; i < productsList.length; i ++){
				const insertOrderProducts = await dependencies.sequelize.query(`INSERT INTO orders_products(order_id, product_id, cantidad_productos)
					VALUES ('${insertOrder}', '${productsList[i].product_id}', ${products[i].quantity})`); 
				};
			resultado = 'Ok';   
            }    
        return resultado;
    }else {
        return resultado;
    }
}

async function findId(id, tabla, idTabla) {
    const find = await dependencies.sequelize.query(`SELECT * FROM ${tabla} WHERE ${idTabla} = ${id}`, 
    {type: dependencies.sequelize.QueryTypes.SELECT});
    console.log(find);
    return find;
}

async function changeStatus(estado, id) {
    const findById = await findId(id, 'orders', 'order_id');
    if(status.orderStatus.indexOf(estado) >= 0 && findById.length > 0){  
        const updateOrder = await dependencies.sequelize.query(`UPDATE orders SET estado = '${estado}' WHERE order_id = ${id}`);
        console.log(updateOrder);
        return 'Ok';
    }else {
        return 'Error al actualizar el estado de la orden';
    }
}

async function deleteOrder(id) {
    const findById = await findId(id, 'orders', 'order_id');
    if(findById.length > 0){  
        const deleteOrder = await dependencies.sequelize.query(`DELETE FROM orders WHERE order_id = ${id}`);
        console.log(deleteOrder);
        return 'Ok';
    }else {
        return 'Error al eliminar la orden';
    }
}

async function getOrders() {
    const findOrders = await dependencies.sequelize.query(`SELECT * FROM orders`, 
    {type: dependencies.sequelize.QueryTypes.SELECT});
    console.log(findOrders);
    return findOrders;
}

/*async function getOrderDetail(id, tkn) {
    const validateToken = token.JWT.verify(tkn, token.signature);
    const find = await findUser(validateToken.password, validateToken.userName).catch();
    console.log(find);
    let findOrder;
    if(find[0].is_admin === 1) {
        findOrder = await dependencies.sequelize.query(`SELECT * FROM orders INNER JOIN
        users ON orders.user_id = users.user_id WHERE orders.order_id = ${id}`,
        {type: dependencies.sequelize.QueryTypes.SELECT});
    }else {
        findOrder = await dependencies.sequelize.query(`SELECT * FROM orders INNER JOIN
        users ON orders.user_id = users.user_id WHERE orders.order_id = ${id} AND orders.user_id = ${find[0].user_id}`,
        {type: dependencies.sequelize.QueryTypes.SELECT});
    }
    console.log(findOrder);
    return findOrder;
}*/

async function getOrderDetail(id, tkn) {
    const validateToken = token.JWT.verify(tkn, token.signature);
    const find = await findUser(validateToken.password, validateToken.userName).catch();
    let findOrder;
    findOrder = await dependencies.sequelize.query(`SELECT * FROM orders INNER JOIN
    orders_products ON orders.order_id = orders_products.order_id WHERE orders.order_id = ${id}`,
        {type: dependencies.sequelize.QueryTypes.SELECT});
    console.log("ORDERS: " + JSON.stringify(findOrder[0])); 
    console.log("ORDERS: " + JSON.stringify(findOrder[1]));
	const products = await dependencies.sequelize.query(`SELECT DISTINCT * FROM products 
		INNER JOIN orders_products ON orders_products.product_id = products.product_id WHERE orders_products.order_id = ${findOrder[0].order_id}`,
		{type: dependencies.sequelize.QueryTypes.SELECT});
    let productsList = await Promise.all(products);
	console.log("PRODUCTOS: " + productsList);
	const user  = await dependencies.sequelize.query(`SELECT * from users WHERE users.user_id = ${findOrder[0].user_id}`,
	{type: dependencies.sequelize.QueryTypes.SELECT});
	console.log("PRODUCTOS: " + products);
	const detail = {
		"usuario" : user[0].usuario,
        "direccion": user[0].direccion,
        "mail": user[0].email,
        "telefono": user[0].telefono,
		"estado" : findOrder[0].estado, 
		"forma_de_pago" : findOrder[0].pago,
		"monto_total": findOrder[0].monto,
		"productos" : products};
    console.log("DETALLE: " + detail);
    return detail
}





module.exports = {findUserName, validateUserCredential, verifyToken, getUsers, registerUser, postProducts, 
    getProducts, deleteProducts, getProduct, putProduct, postOrder, findUserNameById, changeStatus,
     findId, deleteOrder, getOrders, getOrderDetail};