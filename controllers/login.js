const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



loginRouter.post('/', async (req, res) =>{
   const { email, password } = req.body;
   const userExists = await User.findOne({ email });
//    console.log(userExists);
   
   if(!userExists) {
    return res.status(400).json( { error: 'El usuario o la contraseña es incorrecta'} );
   }
   
   if(!userExists.verified) {
    return res.status(400).json( {error: 'Por favor verifica tu cuenta'} );
   }
   const saltRounds = 10;
       const isCorrect = await bcrypt.compare(password, userExists.passwordHash);
    //    console.log(isCorrect);
    if(!isCorrect) {
        return res.status(400).json( { error: 'El usuario o la contraseña es incorrecta'} );
    }

    const userForToken = {
        id: userExists._id,
    };

    const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
   
    //  console.log(accessToken);
    // console.log(new Date());
    // console.log(new Date(Date.now() + 1000 * 60 * 60 * 24 * 1));
    
    res.cookie('accessToken', accessToken, { 
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
     });

return res.status(200).json({ message: 'Login exitoso' });

    // return res.status(200);
    
});

module.exports = loginRouter;