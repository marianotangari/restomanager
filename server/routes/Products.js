const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares/middlewares');

router.post('/products', async (req,res) => {
    const token = req.headers.token;
    const verify = await middlewares.verifyToken(token).catch();
    const { product_name, product_price, img_url, description} = req.body;
    if( !verify) {
        res.status(403).send("No tiene los permisos necesarios");
    }
    if(product_name != "" && product_price!= null) {
       const product = middlewares.postProducts(product_name, product_price, img_url, description).catch();
       res.status(201).send('Producto creado'); 
    }else{
        res.status(400).send('El producto debe tener un precio y nombre');
    }
})

router.get('/products', async (req,res) => {
    res.status(200).send(await middlewares.getProducts().catch());
})

router.delete('/products/:id', async (req,res) => {
    const id = req.params.id;
    const token = req.headers.token;
    const verify = await middlewares.verifyToken(token).catch();
    if( !verify) {
        res.status(403).send("No tiene los permisos necesarios");
    }else {
        const deleted = await middlewares.deleteProducts(id).catch(() => {return res.status(404).send('Error en la base de datos')} );
        res.status(200).send(deleted == 0 ? 'Producto no encontrado' : 'Producto eliminado');
    }
})

router.put('/products/:id', async (req,res) => {
    const id = req.params.id;
    const token = req.headers.token;
    const {product_name, product_price, img_url, description} = req.body;
    const verify = await middlewares.verifyToken(token).catch();
    if( !verify) {
        res.status(403).send("No tiene los permisos necesarios");
    }else {
        const put = await middlewares.putProduct(id, product_price, product_name, img_url, description).catch(() => {return res.status(404).send('Error en la base de datos')} );
        res.status(200).send(put == 0 ? 'Producto no encontrado' : 'Producto modificado exitosamente');
    }
})


module.exports = router;