const express = require('express');
const router = express.Router();

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
const usuario_existe = await User.findOne({where:{email: email}})



});

module.exports = router;
