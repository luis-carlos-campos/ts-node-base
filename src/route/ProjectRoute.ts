import AbstractRoute from "./AbstractRoute";
import Project from "../entity/Project";
import ProjectController from "../controller/ProjectController";
import ProjectResponseType from "../type/response/entity/ProjectResponseType";

class ProjectRoute extends AbstractRoute<
    Project,
    ProjectResponseType,
    ProjectController
> {
    constructor() {
        super(ProjectController);
    }
}

export default ProjectRoute;
