require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

// Middleware de Autenticação
const autheticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if(!token) {
        return res.status(401).json({error: 'Token não encontrado.'});
    }
    const parts = token.split(' ');

    if(parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(403).json({error: 'Token malformado.'});
    }

    const actualToken = parts[1];

    jwt.verify(actualToken, secret, (err, decoded) => {
        if (err) return res.status(403).json({error: 'Token inválido.'});
    
        req.user_id = decoded.id;
        next();
    });

};

module.exports = autheticateToken;