import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import ProjectModel, { Project } from "../models/Project";
import UserModel, { User } from "../models/User";
import { ADMIN_ROLE } from "../models/UserRoles";
import { validateProject } from "../validation/ProjectValidator";

export const addProject = async (req: any, res: Response) => {
  const userId = req.userId;

  if (!isUserAllowed(userId))
    return res.status(400).json({
      success: false,
      msg: "Invalid User Id or the User can not add projects",
    });

  await saveProject(req, res);
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

const isUserAllowed = async (userId: string): Promise<boolean> => {
  if (!isValidObjectId(userId)) return false;

  try {
    const user: User | null = await UserModel.findById(userId);
    if (user != null && user.role === ADMIN_ROLE) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

// New Methods
export const getProjects = async (req: Request, res: Response) => {
  const { featured, type, count } = req.query;
  const limit = count ? parseInt(count.toString()) ?? 5 : 5;

  let query = {};
  if (type && type.toString().toLowerCase() != "any") {
    query = {
      type: { $regex: `^${type}$`, $options: "i" },
    };
  }

  if (featured) {
    query = {
      ...query,
      isFeatured: JSON.parse(featured.toString()),
    };
  }

  ProjectModel.find(query)
    .sort({ publishedOn: "desc" })
    .limit(limit)
    .then((projects: Project[]) => {
      return res.status(200).json({
        success: true,
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
