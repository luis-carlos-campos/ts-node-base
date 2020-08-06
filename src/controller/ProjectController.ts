import AbstractCrudController from "@controller/AbstractCrudController";
import Project from "@entity/Project";
import ProjectResponseType from "@type/response/entity/ProjectResponseType";

class ProjectController extends AbstractCrudController<
    Project,
    ProjectResponseType
> {
    // Overwriting required properties
    protected entity = Project;

    /**
     * @inheritdoc
     */
    responseParser(project: Project): ProjectResponseType {
        const {
            id,
            name,
            description,
            startDate,
            endDate,
            email,
            teamSize,
        } = project;
        return {
            type: "project",
            id,
            attributes: {
                name,
                description,
                startDate,
                endDate,
                email,
                teamSize,
            },
        };
    }
}

export default ProjectController;
