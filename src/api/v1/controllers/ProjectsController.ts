import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import BlogModel from "../models/Blog";
import ProjectModel, { Project } from "../models/Project";
import ProjectBlogModel, { ProjectBlog } from "../models/ProjectBlog";
import UserModel, { User } from "../models/User";
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

  if (isUserAllowed(userId))
    return res.status(400).json({
      success: false,
      msg: "Invalid User Id or the User can not add projects",
    });

  await saveProject(req, res);
};

export const relateBlogToProject = async (req: any, res: Response) => {
  const userId = req.userId;
  const { projectId } = req.params;
  const { blogId } = req.body;

  if (!isUserAllowed(userId))
    return res.status(400).json({
      success: false,
      msg: "Invalid User Id or the User can not modify projects",
    });

  if (isValidObjectId(blogId) && isValidObjectId(projectId)) {
    const result = await addBlogProjectRelation(blogId, projectId);
    if (!result)
      return res.status(400).json({
        success: false,
        msg: "Error occurred adding the relation ship between the project and the specified blog",
      });
    else
      return res.status(200).json({
        success: true,
        msg: "Relation added Successfully",
      });
  } else
    return res.status(400).json({
      success: false,
      msg: "Invalid Blog or Project Id provided",
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

const addBlogProjectRelation = async (
  blogId: string,
  projectId: string
): Promise<boolean> => {
  const project = await ProjectModel.findById(projectId);
  const blog = await BlogModel.findById(blogId);

  try {
    if (project && blog) {
      const projectBlog: ProjectBlog = new ProjectBlogModel({
        blogId: blog._id,
        projectId: project._id,
        relationKey: `${blog._id}-${project._id}`,
      });
      await projectBlog.save();
      return true;
    } else return false;
  } catch (error) {
    return false;
  }
};
