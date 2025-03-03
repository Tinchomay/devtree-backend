import bcrypt from 'bcrypt';

export const hashPassword = async (password : string) => {
    //saltos de bcrypt
    const salt = await bcrypt.genSalt(10);
    //generar password hasheado y retornarnlo
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return hashedPassword;
}

export const comparePassword = async (password : string, hashedPassword : string) => {
    //comparar password con la password hasheada
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}