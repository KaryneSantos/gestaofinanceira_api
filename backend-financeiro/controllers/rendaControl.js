const { Renda, Despesa } = require("../models/renda.js");

class RendaController {
    static async CriarRenda(req, res) {
        try {
            const { descricao, valor } = req.body;

            if(!descricao || !valor) {
                return req.status(400).json({ error: "Preenchar todos os campos" })
            }

            await Renda.CriarRenda(descricao, valor);

            return res.json({ mensagem: "Renda cadastrada com sucesso!" })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: "Error ao cadastrar renda" })
        }
    }

    static async CriarDespesa(req, res){
        try {
            const { descricao, valor } = req.body;

            if(!descricao || !valor) {
                return req.status(400).json({ error: "Preenchar todos os campos" })
            }

            await Despesa.CriarDespesa(descricao, valor);

            return res.json({ mensagem: "Despesa cadastrada" })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error ao cadastrar despesa" })
        }
    }
}

module.exports = { RendaController };