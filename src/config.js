import dotenv from 'dotenv';
dotenv.config();
export default  {
    app:{
        port: process.env.PORT || 4000,
        jwt: process.env.JWT_SECRET
    }
}
