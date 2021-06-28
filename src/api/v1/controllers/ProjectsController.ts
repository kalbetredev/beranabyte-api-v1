import { Request, Response } from "express";
import ProjectModel, { Project } from "../models/Project";
import User from "../models/User";
import { ADMIN_ROLE } from "../models/UserRoles";
import { validateProject } from "../validation/ProjectValidator";

export const getProjects = async (req: Request, res: Response) => {
  ProjectModel.find({})
    .sort({ title: "asc" })
    .then((projects: Project[]) => {
      return res.status(200).json({
        success: true,
        msg: "Successfully fetched projects",
        projects: projects,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        success: false,
        msg: "Error fetching projects",
      });
    });
};

export const addProject = async (req: any, res: Response) => {
  const userId = req.userId;

  if (!userId)
    return res.status(400).json({
      success: false,
      msg: "Unknown Error Ocurred Getting User",
    });

  User.findOne({ _id: userId }).then((user: any) => {
    if (user.role === ADMIN_ROLE) {
      saveProject(req, res);
    } else {
      return res.status(401).json({
        success: false,
        msg: "This user can not publish blogs",
      });
    }
  });
};

const saveProject = async (req: any, res: Response) => {
  const { title, summary, githubLink, tags }: Project = req.body;

  if (!validateProject({ title, summary, githubLink, tags }))
    return res.status(500).json({
      success: false,
      msg: "Invalid Inputs",
    });

  const project: Project = new ProjectModel({
    title,
    summary,
    githubLink,
    tags,
  });

  project
    .save()
    .then((project: Project) => {
      return res.status(200).json({
        success: true,
        project: project,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        success: false,
        msg: "Error Occurred saving the projects",
      });
    });
};
