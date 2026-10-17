// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import {
  ProjectModel,
  TechnologyModel,
  UserModel,
} from "../../models/index.js";

export const createProjectValidation = [
  // TODO: 1. Validar code: obligatorio y único (ProjectModel).
  body("code")
    .notEmpty()
    .withMessage("el codigo no debe de estar vacio")
    .bail()
    .custom(async (code) => {
      const code = await ProjectModel.findOne({ where: { code } });
      if (code) throw new Error("el codigo ya existe");
      return true;
    }),
  // TODO: 2. Validar name y description como obligatorios.
  body("name")
    .notEmpty()
    .withMessage("el nombre del projecto no debe estar vacio"),
  body("description")
    .notEmpty()
    .withMessage("la descripcion del projecto no debe estar vacio"),
  // TODO: 3. Validar status: opcional y limitado a los estados permitidos.
  body("status")
    .optional()
    .isIn(["in_progress", "paused", "finished", "planning"]),
  // TODO: 4. Validar start_date como fecha válida y budget como número positivo, ambos obligatorios.
  body("start_date")
    .notEmpty()
    .withMessage("la fecha no debe estar vacia")
    .bail()
    .isISO8601({ strict: true })
    .withMessage("la fecha ingresada no es valida"),
  body("budget")
    .isInt()
    .withMessage("el  budget no es entero positivo")
    .notEmpty()
    .withMessage("el budget no debe estar vacia"),
  // TODO: 5. Validar leader_id: debe existir y pertenecer a un usuario activo (UserModel).
  body("leader_id").custom(async (project_id, user_id) => {
    const project_id = await ProjectModel.findByPk(project_id);
    const user_id = await UserModel.findByPk(user_id);
    if (!user_id) throw new Error("no existe el id delñ projecto");
    if (!project_id) throw new Error("no existe el id delñ projecto");
    return true;
  }),
  // TODO: 6. Validar technologies: lista de ids que existan (TechnologyModel).
  // ? Un usuario eliminado lógicamente no puede ser líder: comprobar que la búsqueda lo deje afuera.
  body("technologies")
  .isArray().withMessage("las tecnologias deben ser un arreglo")
  .bail()
  .custom(async (technologies) => {
    for (const id of technologies) {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error("el id de la tecnologia no es valido");
      }
      const technology = await TechnologyModel.findByPk(id);
      if (!technology) {
        throw new Error(`la tecnologia con id ${id} no existe`);
      }
    }
    return true;
  }),
];

export const updateProjectValidation = [
  // TODO: 7. Validar code como opcional y único, excluyendo el propio proyecto que se edita.
  body("code")
    .optional()
    .notEmpty()
    .withMessage("el codigo no debe estar vacio")
    .bail()
    .custom(async (code, { req }) => {
      const project_id = req.params.id;
      const codeExist = await ProjectModel.findOne({
        where: { code },
      });
      if (codeExist && String(codeExist.id) !== String(project_id)) {
        throw new Error("el codigo ya pertenece a otro proyecto");
      }
      return true;
    }),
  // TODO: 8. Validar name y description como opcionales y no vacíos.
    
  // TODO: 9. Validar status, start_date y budget como opcionales, con las mismas reglas que al crear.
  // TODO: 10. Validar leader_id como opcional, existente y de un usuario activo.
  // TODO: 11. Validar technologies como opcional, con ids que existan.
  // ? Para saber qué proyecto se edita, el id se obtiene de los parámetros de la ruta (req.params).
];
