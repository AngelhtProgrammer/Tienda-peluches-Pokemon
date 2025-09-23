const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const { PAGE_URL } = require('../config');
const { response } = require('../app');

//ENDPOINT
usersRouter.post('/', async (req, res) =>{
    console.log(req.body);
    
    const {name, email, password} = req.body;
    
    //VALIDACION A NIVEL DE BACKEND
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos los espacions son requeridos' });
    }
    
    // Validacion de email unico
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'El email ya esta registrado' });
    }

    //ENCRYPTACION DE LA CONTRASEÑA
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log(passwordHash);

    //REGISTRO DE BASE DE DATOS
     const newUser = new User({
         name, 
         email,
         passwordHash,
     });

     const savedUser = await newUser.save();
    console.log(savedUser);

    // TRABAJAR CON LOS  WEB TOKEN
     const token = jwt.sign({ id: savedUser.id }, process.env.ACCESS_TOKEN_SECRET, {
         expiresIn: '1d'
     });


    //NODEMAILER
     const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 587,
   secure: false, // true for 465, false for other ports
   auth: {
     user: process.env.EMAIL_USER,
     pass: process.env.EMAIL_PASS,
     
 }});
  
//  Wrap in an async IIFE so we can use await.
  (async () => {
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: savedUser.email, // list of receivers
        subject: "Verificacion de usuario", // Subject line
        html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar correo</a>`, // html body
      });

     return res.status(201).json('Usuario creado. Por favor verifica tu correo')

//       console.log("Message sent: %s", info.messageId);
//       console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
      console.error("Error while sending mail", err);
    }
  })();


});

usersRouter.patch('/:id/:token', async (req, res) => {
try {
  const token = req.params.token;
  
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // console.log(decodedToken);
  const id = decodedToken.id;
  await User.findByIdAndUpdate(id, { verified: true });
  return res.status(200).json('Usuario verificado correctamente');
  
} catch (error) {
  //Encontrar el email del usuario
  const id = req.params.id;
  const { email } = await User.findById(id);

  
  // Firmar el nuevo token
   const token = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, {
         expiresIn: '1d'
     });


  //   enviar el correo de nuevo
     const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 587,
   secure: false, // true for 465, false for other ports
   auth: {
     user: process.env.EMAIL_USER,
     pass: process.env.EMAIL_PASS,
     },
    });
  
  (async () => {
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: email, // list of receivers
        subject: "Verificacion de usuario", // Subject line
        html: `<a href="${PAGE_URL}/verify/${id}/${token}">Verificar correo</a>`, // html body
      });

  return res.status(400).json({ error: 'El link ya ha expirado, se ha enviado un nuevo link de verificación a su correo.' });

    } catch (err) {
      console.error("Error while sending mail", err);
    }
  })();
}
});

module.exports = usersRouter;