const express = require('express');
const router = express.Router();

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

// Cadastrar um novo usuário
router.post('/', async (req, res) => {
    const {nome, email, senha, confirmacao_senha} = req.body;
    const errors = [];

// Validação dos dados

    if(!nome || !email || !senha || !confirmacao_senha) {
        errors.push('Todos os campos são obrigatórios.');
        return res.status(400).json({errors});
    }

    if(senha.length < 8) {
        errors.push('A senha deve conter pelo menos 8 caracteres.');
        return res.status(400).json({errors});
    }

    if(senha != confirmacao_senha) {
        errors.push('As senhas não coincidem.');
        return res.status(400).json({errors});
    }

// Verifica se usuário já tem um cadastro
const usuario_existe = await User.findOne({where:{email: email}});

if(usuario_existe) {
    errors.push('Email já está em uso.');
    return res.status(400).json({errors});
}

try {
    // Criptografando senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criando um novo usuário
    const newUser = await User.create({nome: nome, email: email, senha: hashedPassword});
    const token = jwt.sign({id: newUser.id_user, email: email}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.status(201).json({user: email, token:token});
} catch(error) {
    res.status(500).json(error);
}
});

// Listar todos os usuários

router.get('/', async (req, res) => {
    const users = await User.findAll();
    res.status(200).json(users);
});

// Atualizar usuário

router.put('/update', authenticateToken, async (req, res) => {
    try {
        const userId = req.user_id;
        const {nome, email} = req.body;

        const user = await User.findByPk(userId);

        if(!user) {
            return res.status(404).json({message: 'Usuário não encontrado.'});
        }

        await user.update({
            nome: nome && nome.trim() !== "" ? nome : user.nome,
            email: email && email.trim() !== "" ? email : user.email
        });

        res.status(200).json({
            message: 'Usuário atualizado com sucesso!',
            user: {
                user_id: user.user_id,
                nome: user.nome,
                email: user.email
            }
        });
    } catch(error) {
        console.error('Erro ao atualizar o usuário:', error);
        res.status(500).json({
            message: 'Erro ao atualizar o usuário.',
            error: error.message || error
        });
    }
});

// Deletar usuário

router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user_id;

        const user = await User.findByPk(user_id);
        console.log(user);

        if(!user) {
            return res.status(404).json({message: 'Usuário não encontrado.'});
        }

        await user.destroy();
        res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar o usuário:', error);
        res.status(500).json({ 
            message: 'Erro ao deletar o usuário.',
            error: error.message || error
        });
    }
});

module.exports = router;
