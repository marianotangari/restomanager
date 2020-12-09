const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares/middlewares');


router.post('/users/register', async (req, res) => {
    const {userName, name, mail, phone, adress, password, is_admin } = req.body;
    const register = await middlewares.registerUser(userName, name, mail, phone, adress, password, is_admin);
    res.status(register == 'Ok' ? 201 : 400).send(register);
})

router.post('/users/login', async (req,res) => {
    const {userName, password} = req.body;
    const token = await middlewares.validateUserCredential(userName, password);
    if (token != 0) {
        res.status(201).send(token);
    }else {
        res.status(400).send("Usuario no existente");
    }
})

router.get('/users', async (req,res) => {
    const token = req.headers.token;
    const verify = await middlewares.verifyToken(token).catch();
    if(verify) {
        res.status(200).send(await middlewares.getUsers());
    }else{
        res.status(403).send("No tiene los permisos necesarios");
    }
})


module.exports = router;