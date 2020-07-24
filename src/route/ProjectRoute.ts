import AbstractCrudRoute from "./AbstractCrudRoute";
import Project from "../entity/Project";
import ProjectController from "../controller/ProjectController";
import ProjectResponseType from "../type/response/entity/ProjectResponseType";
import { Logger } from "winston";
import LoggerUtil from "../util/LoggerUtil";

class ProjectRoute extends AbstractCrudRoute<
    Project,
    ProjectResponseType,
    ProjectController
> {
    constructor() {
        super(ProjectController);
    }
}

export default ProjectRoute;
