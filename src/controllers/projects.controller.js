// * ARCHIVO A COMPLETAR
import { matchedData } from "express-validator";
import {
  ProjectModel,
  ProjectTechnologyModel,
  TechnologyModel,
  UserModel,
} from "../models/index.js";

export const createProject = async (req, res) => {
  try {
    // TODO: 1. Crear el project con los datos del body que ya pasaron la validación.
    const data = matchedData(req);
    // ? Revisar de dónde debe salir el leader del proyecto.
    // TODO: 2. Asociar al project las technologies recibidas.
    const projectCreated = await ProjectModel.create(data);
    await projectCreated.setTechnologies(data.technologies);

    const projectInfo = await ProjectModel.findByPk(projectCreated.id, {
      include: [
        {
          model: UserModel,
          as: "leader",
          attributes: { exclude: ["password"] },
        },
        { model: TechnologyModel, as: "technologies" },
      ],
    });

    // TODO: 3. Responder con código 201 y el project con sus technologies y su leader.
    return res
      .status(201)
      .json({ message: "se creo el projecto correctamente", projectInfo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    // TODO: 1. Listar todos los projects incluyendo su leader (sin la password) y sus technologies, y responder con código 200 y los projects..
    const projects = await ProjectModel.findAll({
      include: [
        {
          model: UserModel,
          as: "leader",
          attributes: { exclude: ["password"] },
        },
        {
          model: TechnologyModel,
          as: "technologies",
        },
      ],
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    // TODO: 1. Listar los projects cuyo leader sea el usuario logueado, incluyendo sus technologies, y responder con código 200 y los projects.
    const id = req.user.id;

    const projects = await ProjectModel.findAll({
      where: { leader_id: id },
      include: [
        {
          model: TechnologyModel,
          as: "technologies",
        },
      ],
    });

    return res.status(200).json({ projects });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateProject = async (req, res) => {
  try {
    // TODO: 1. Actualizar el project con los datos recibidos.
    const data = matchedData(req)
    const id = req.params.id;

    const projectToUpdate = await ProjectModel.findByPk(id)

    if (!projectToUpdate) {
      return res.status(404).json({ message: "el proyecto no existe" });
    }

    // TODO: 2. Reemplazar sus technologies si vienen en el body.
    if(projectToUpdate.technologies !== undefined) await  projectToUpdate.setTechnologies(data.technologies);
    // TODO: 3. Responder con código 200 y el project actualizado, incluyendo su leader y sus technologies.
    const projecteUpdatedInfo = await ProjectModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "leader",
          attributes: { exclude: ["password"] },
        },
        {
          model: TechnologyModel,
          as: "technologies",
        },
      ],
    });
    return res.status(200).json({message: "projecto atualizado correctamente",projecteUpdatedInfo});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    // TODO: 1. Eliminar el project y responder con código 204 sin devolver ningún mensaje.
    const id = req.params.id
    const projectToDelete = await ProjectModel.findByPk(id);
    if(!projectToDelete)  return res.status(404).json({ msg: "El proyecto no existe" })
    await projectToDelete.destroy()
    return res.status(204).send()
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
