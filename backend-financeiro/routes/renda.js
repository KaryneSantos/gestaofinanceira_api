const express = require('express');
const router = express.Router();

const Renda = require('../models/renda');

// cadastrar renda
router.post('/', async (req, res) => {
     try {
            const { descricao, valor } = req.body;

            if(!descricao || !valor) {
                return res.status(400).json({ error: "Preenchar todos os campos" })
            }

            await Renda.create(descricao, valor);

            return res.json({ mensagem: "Renda cadastrada com sucesso!" })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: "Error ao cadastrar renda" })
        }
});

// listar renda
router.get('/', async (req, res) => {
    try {
        const rendas = await Renda.findAll();
        res.json(rendas);
    } catch (error) {
        res.status(500).json({ error: "Error ao buscar rendas" });
    }
});

// deletar renda
router.delete('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const renda = await Renda.findByPk(id);

        if(!renda) {
            return res.status(404).json({ error: "Renda não encontrada" });
        }

        await renda.destroy();

        return res.json({ mensagem: "Renda deletada com sucesso!" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Error ao deletar renda" });
    }
});

// atualizar renda
router.put('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const { descricao, valor } = req.body;

        const renda = await Renda.findByPk(id)

        if(!renda) {
            return res.status(404).json({ error: "Renda não encontrada" })
        }

        await renda.update({ descricao, valor });
        res.json({ mensagem: "Renda atualizada com sucesso!", renda })


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error ao atualizar renda" });
    }
});

module.exports = router;