const express = require('express');
const router = express.Router();

const Despesas = require('../models/despesas');

// Criar uma despesa

router.post('/', async (req, res) => {
    try {

// Verificar se usuário está logado

         if (!req.session.user) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        const {valor, descricao, data, categoria} = req.body;
        const usuario_id = req.session.user.id;
        const errors = [];

        console.log('Token usuário autenticado:', usuario_id);
    
// Validação dos dados

        if(!valor || !descricao || !data || !categoria) {
            errors.push('Todos os campos são obrigatórios.');
            return res.status(400).json({errors});
        }
        
        if(isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
            errors.push('Valor inválido');
            return res.status(400).json({errors});
        }

// Verifica se já existe uma despesa com a mesma descrição

        const despesaExistente = await Despesas.findOne({
            where: {descricao, data, usuario_id}
        });

        if(despesaExistente) {
            errors.push('Despesa já cadastrada neste dia.');
            return res.status(400).json({errors});
        }

        const novaDespesa = await Despesas.create({valor, descricao, data, categoria, usuario_id});
        res.status(201).json(novaDespesa);
        
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Erro ao criar despesa"});
    }
});


// Lista das despesas do usuário

router.get('/', async (req, res) => {
    try {

// Verificar se usuário está logado
        const usuario_id = req.session.user.id;

        const despesas = await Despesas.findAll({
            where: { usuario_id },
            order: [['data', 'DESC']]
        });

        res.json(despesas);

    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'Erro ao listar despesas'});
    }
});

// Atualizar despesas

router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {valor, descricao, data, categoria} = req.body;
        const usuario_id = req.session.user.id;

        const despesa = await Despesas.findOne({
            where: {id_despesas: id, usuario_id}
        });

        if(!despesa) {
            return res.status(404).json({error: 'Despesa não encontrada.'});
        }

        await despesa.update({
            valor,
            descricao,
            data,
            categoria
        });

        res.json({message: 'Despesa atualizada com sucesso.', despesa});
    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'Erro ao atualizar despesa.'});
    }
});

// Deletar uma despesa

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const usuario_id = req.session.user.id;

        const despesa = await Despesas.findOne({
            where: {id_despesas: id, usuario_id}            
        });

        if (!despesa) {
            return res.status(404).json({ error: 'Despesa não encontrada.' });
        }

        await despesa.destroy();

        res.json({ message: 'Despesa removida com sucesso.' });
    } catch(error) {
         console.error(error);
         res.status(500).json({ error: 'Erro ao deletar despesa.' });
    }
});

module.exports = router;