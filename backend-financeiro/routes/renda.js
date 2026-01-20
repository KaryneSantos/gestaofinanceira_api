const express = require('express');
const router = express.Router();

const Renda = require('../models/renda');

// Cadastrar renda
router.post('/', async (req, res) => {
     try {

         if (!req.session.user) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        
           const {valor, descricao, data, categoria} = req.body;
           const errors = [];
            const usuario_id = req.session.user.id;

            if(!valor || !descricao || !data || !categoria) {
            errors.push('Todos os campos são obrigatórios.');
            return res.status(400).json({errors});
            }

             if(isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
            errors.push('Valor inválido');
            return res.status(400).json({errors});
            }

            const rendaExistente = await Renda.findOne({
            where: {descricao, data, usuario_id}
            });

            if(rendaExistente) {
            errors.push('Renda já cadastrada neste dia.');
            return res.status(400).json({errors});
            }

             const novaRenda = await Renda.create({valor, descricao, data, categoria, usuario_id});
             res.status(201).json(novaRenda);

        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: "Error ao cadastrar renda" })
        }
});

// Listar todas as rendas
router.get('/', async (req, res) => {
    try {
        const usuario_id = req.session.user.id;

        const renda = await Renda.findAll({
            where: { usuario_id },
            order: [['data', 'DESC']]
        });

        res.json(renda);
    } catch (error) {
        res.status(500).json({ error: "Error ao buscar rendas" });
    }
});

// Atualizar renda
router.put('/:id', async (req, res) => {
    try{

        const {id} = req.params;
        const {valor, descricao, data, categoria} = req.body;
        const usuario_id = req.session.user.id;

        const renda = await Renda.findOne({
            where: {id_renda: id, usuario_id}
        });

        if(!renda) {
            return res.status(404).json({error: 'Renda não encontrada.'});
        }

        await renda.update({
            valor,
            descricao,
            data,
            categoria
        });

        res.json({message: 'Renda atualizada com sucesso.', renda});


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error ao atualizar renda" });
    }
});

// Deletar renda
router.delete('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const usuario_id = req.session.user.id;

        const renda = await Renda.findOne({
            where: {id_renda: id, usuario_id}            
        });

        if (!renda) {
            return res.status(404).json({ error: 'Renda não encontrada.' });
        }

        await renda.destroy();

        res.json({ message: 'Renda removida com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Error ao deletar renda" });
    }
});

module.exports = router;