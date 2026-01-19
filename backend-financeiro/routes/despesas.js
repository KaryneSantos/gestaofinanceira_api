const express = require('express');
const router = express.Router();

const Despesas = require('../models/despesas');

// Criar uma despesa

router.post('/', async (req, res) => {
    try {
        const {valor, descricao, data, categoria} = req.body;
        const errors = [];
    
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

        const despesaExistente = await Despesas.findOnde({
            where: {descricao, data}
        });

        if(despesaExistente) {
            errors.push('Despesa já cadastrada neste dia.');
            return res.status(400).json({errors});
        }

        const novaDespesa = await Despesas.create({valor, descricao, data, categoria});
        res.status(201).json(novaDespesa);
        
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Erro ao criar despesa"});
    }
});

module.exports = router;