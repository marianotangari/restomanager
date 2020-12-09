const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares/middlewares');

router.post('/orders', async(req,res, next) => {
    const {user_id, products, pago} = req.body;
    const validateUser = await middlewares.findId(user_id, 'users', 'user_id');
    if(validateUser.length > 0) {
        const order = await middlewares.postOrder(user_id, products, pago);
        res.status(order == 'Ok' ? 201 : 400).send(order);
        next();
    }else {
        res.status(404).send('Operacion invalida, usuario no registrado');
        next();
    }
})

router.put('/orders', async(req,res,next) => {
    const {status, order_id} = req.body;
    const token = req.headers.token;
    const verify = await middlewares.verifyToken(token).catch(
        () => {res.status(500).send('Token invalido');
        next();
    });
    if( !verify) {
        res.status(403).send("No tiene los permisos necesarios");
    }else {
        const putOrder = await middlewares.changeStatus(status, order_id);
        res.status(putOrder == 'Ok' ? 201 : 400).send(putOrder);
    }
})

router.delete('/orders', async(req,res,next) => {
    const {order_id} = req.body;
    const token = req.headers.token;
    const verify = await middlewares.verifyToken(token).catch(
        () => {res.status(500).send('Token invalido');
        next();
    }
    );
    if( !verify) {
        res.status(403).send("No tiene los permisos necesarios");
    }else {
        const deleteOrder = await middlewares.deleteOrder(order_id);
        res.status(deleteOrder == 'Ok' ? 201 : 400).send(deleteOrder);
    }
})

router.get('/orders', async(req,res, next) => {
    const token = req.headers.token;
    const verify = await middlewares.verifyToken(token).catch(
        () => {res.status(500).send('Token invalido');
        next();
    });
    if( !verify) {
        res.status(403).send("No tiene los permisos necesarios");
    }else {
        res.status(200).send(await middlewares.getOrders());
    }
})

router.get('/orders/:id', async(req,res, next) => {
    const token = req.headers.token;
    const id = req.params.id;
    const getOrder = await middlewares.getOrderDetail(id, token);
    //if(getOrder.length > 0)
        res.status(200).send(getOrder);
    //else
    //    res.status(404).send('Orden no encontrada');
    next();
})
















module.exports = router;