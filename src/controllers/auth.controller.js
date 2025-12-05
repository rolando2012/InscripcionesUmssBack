import jwt  from'jsonwebtoken';
import prisma from '../base/db.js';
import bcrypt from 'bcrypt';
import config from '../config.js';

export const loginUser = async (req, res) => {
    const { CodigoSis, contrasena, dia, mes,ano } = req.body;
    
    // Extraemos el número del mes, por ejemplo "5 - Mayo" → 5
    const mesNumero = parseInt(mes.split(" - ")[0], 10);

    // Crear la fecha correctamente
    const fechaNacimiento = new Date(ano, mesNumero - 1, dia);

    const estudiante = await prisma.estudiante.findFirst({
        where:{
            CodigoSis: CodigoSis 
    }}); 

    if(!estudiante){
        return res.status(401).json({ message: 'Datos Ingresados no coinciden' });
    }

    const persona = await prisma.persona.findFirst({
        where:{
            personaId: estudiante.idPersona,
            fechaNacimiento: new Date(fechaNacimiento)
        }
    });

     if(!persona){
        return res.status(401).json({ message: 'Datos Ingresados no coinciden' });
    }

    if (!(await bcrypt.compareSync(contrasena,estudiante.contrasena))){
        return res.status(401).json({ message: 'Datos Ingresados no coinciden' });
    }

    try{
        const token = jwt.sign({ id: estudiante.id, codigo: estudiante.codigoSis}, config.app.jwt, { expiresIn: '1h' });
        res.cookie('access_token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:'none',
            maxAge: 3600000 // 1 hour,  
        }).send({ token, estudiante: { id: estudiante.id, codigo: estudiante.codigoSis} }) ;
    }catch(error){
        res.status(401).send(error.message)
    }
    
};

export const logout = async(req,res) =>{
    res
        .clearCookie('access_token')
        .json({message: 'Cerrado de sesion exitoso'})
}
