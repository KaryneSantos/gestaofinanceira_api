const express = require('express');
const router = express.Router();

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/me', async (req, res) => {
    if(req.session.user && req.session.token) {
        try {
            const user = await User.findByPk(req.session.user.id);

            if(!user) {
                return res.status(404).json({error: 'Usuário não encontrado.'});
            }
            
            res.json({
                user: {
                    id: user.id_user,
                    nome: user.nome,
                    email: user.email
                },
                token: req.session.token
            });
        } catch(error){
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
        }
    } else {
        console.error('Usuário não autenticado.', error);
        res.status(401).json({ error: 'Usuário não autenticado.' });
    }
});

router.post('/', async (req, res) => {
    const {email, senha} = req.body;
    const errors = [];

// Validação dos dados

if(!email || !senha) {
    errors.push('Todos os campos são obrigatórios.');
    return res.status(400).json(errors);
}

if(senha.length < 8) {
    errors.push('A senha deve conter pelo menos 8 caracteres.');
    return res.status(400).json(errors);
}

try {
    const user = await User.findOne({where: {email: email} });

    if(user) {
        const isPasswordValid = await bcrypt.compare(password, user.senha);

        if(isPasswordValid) {
                const token = jwt.sign({ email: user.email, id: user.id_user }, process.env.JWT_SECRET, { expiresIn: '1h' });
                req.session.token = token;
                req.session.user = {id: user.id_user, nome: user.nome, email: user.email};
                res.status(200).json({ user: req.session.user, token: token, msg: 'Usuário logado.' });
        } else {
            errors.push('Senha incorreta.');
            return res.status(400).json(errors); 
        }
    } else {
        errors.push('Usuário não encontrado.');
        return res.status(400).json(errors);
    }
} catch(error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(401).json({ error: 'Erro ao buscar dados do usuário.' });
}

});

module.exports = router;