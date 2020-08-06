import AbstractCrudRoute from "@route/AbstractCrudRoute";
import Project from "@entity/Project";
import ProjectController from "@controller/ProjectController";
import ProjectResponseType from "@type/response/entity/ProjectResponseType";
import CustomRouteName from "@decorator/CustomRouteNameDecorator";

@CustomRouteName("custom")
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
