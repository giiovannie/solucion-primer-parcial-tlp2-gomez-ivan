// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import { UserModel, ProfileModel } from "../../models/index.js";

export const registerValidation = [
  // TODO: 1. Validar username: obligatorio, entre 3 y 20 caracteres y único (UserModel).
  body("username")
    .notEmpty().withMessage("el username esta vacio")
    .isString().withMessage("la no es del tipo string")
    .isLength({min: 3, max:20}).withMessage("el user name no cumple con los minimos y maximos caracteres")
    .bail()
    .custom(async(username)=>{
      const userNameExist = await UserModel.findOne({where: {username}})
      if (userNameExist) throw new Error("el username ya existe intente con otro")
      return true
    }),
  // TODO: 2. Validar email: obligatorio, con formato válido y único.
  body("email")
    .notEmpty().withMessage("el email no debe estar vacio")
    .isEmail().withMessage("el campo no es del tipo email")
    .isString().withMessage("la no es del tipo string")
    .bail()
    .custom(async(email)=>{
      const emailExist = await UserModel.findOne({where: { email}})
      if(emailExist) throw new Error("el email ya existe")
      return true
    }),
    
  // TODO: 3. Validar password: obligatoria, con mínimo de 8 caracteres.
  body("password")
    .notEmpty().withMessage("el mensaje no debe de estar vacio")
    .isString().withMessage("la no es del tipo string")
    .isLength({min: 8}).withMessage("la contraseña no de un minimo de 8 caracteres")
    .isString().withMessage("la contraseña no es del tipo string"),
  // TODO: 4. Validar role: opcional y limitado a los roles permitidos.
  body("role")
    .optional()
    .isIn(["developer", "administrator"]),
  // TODO: 5. Validar profile.employee_number: obligatorio y único (ProfileModel).
  body("profile.employee_number")
    .notEmpty().withMessage("de numero de empleado esta vacio")
    .bail()
    .custom(async(employee_number)=>{
      const empleadoExist = await ProfileModel.findOne({
        where: {employee_number}
      })
      if (empleadoExist) throw new Error("el numero de empleado ya existe")
      return true
    }),
  // TODO: 6. Validar profile.first_name y profile.last_name como obligatorios, y profile.phone como opcional.
  // ? Las unicidades requieren una validación personalizada asíncrona.
    body("profile.first_name")
      .notEmpty().withMessage("el nombre no debe de estar vacio"),
    body("profile.last_name")
      .notEmpty().withMessage("el apellido no debe de estar vacio"),
    body("profile.phone")
      .optional()
];

export const loginValidation = [
  // TODO: 7. Validar email: obligatorio y con formato válido.
  body("email")
    .isEmail().withMessage("El email no es valido")
    .notEmpty().withMessage("el email es obliggatorio"),
  // TODO: 8. Validar password: obligatoria.
  body("password")
    .notEmpty().withMessage("la contraseña no de de estar vacia")
];
