// * ARCHIVO A COMPLETAR
import { UserModel, ProfileModel } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";
import { matchedData } from "express-validator";


export const register = async (req, res) => {
  try {
    const data = matchedData(req);
    const {username,email, password, role, profile} = data
    // TODO: 1. Hashear la password antes de guardarla (hashPassword).
    const passwordHashed = await hashPassword(password)
    // TODO: 2. Crear el user y su profile asociado.
    const userCreated = await UserModel.create({
      username,
      email,
      password: passwordHashed,
      role,
    });

    const profileCreated = await ProfileModel.create({
      ...profile,
      user_id: userCreated.id,
    });
    // TODO: 3. Responder con código 201, un mensaje de éxito y devolver el usuario sin la password.
    const userInfo = await UserModel.findByPk(userCreated.id, {
      attributes: { exclude: ["password"] },
    });
    return res.status(201).json({message: "usuario y perfil cargados correctamente", userInfo})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    // TODO: 1. Buscar el user por email y comparar la password (comparePassword).
    const {email, password} = matchedData(req)
    const user  = await UserModel.findOne({where: { email }})
    if (!user) return res.status(401).json({ message: "credenciales incorrectas" });

    const passwordValid = await comparePassword(password, user.password);
    if(!passwordValid) return res.status(401).json({message: "credenciales incorrectas"});
    // TODO: 2. Firmar un JWT con el id y el role del user (signToken).
    const token = signToken({
      id: user.id,
      role: user.role
    })
    // TODO: 3. Guardar el token en una cookie httpOnly llamada "token", responder con código 200 y un mensaje de éxito.
    // ? Considerar qué mensaje devolver ante credenciales inválidas.
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 //esto equivale a una hora
    })
    return res.status(200).json({ message: "inicio de sesion exitoso" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const logout = async (_req, res) => {
  try {
    // TODO: 1. Eliminar la cookie "token" y responder con código 204 sin devolver ningun mensaje.
    res.clearCookie("token")
    return res.status(204).send()
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
