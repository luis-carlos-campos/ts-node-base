import AbstractController from "./AbstractController";
import Project from "../entity/Project";
import ProjectResponseType from "../type/response/entity/ProjectResponseType";

class ProjectController extends AbstractController<
    Project,
    ProjectResponseType
> {
    // Overwriting required properties
    protected allowedFieldsOnCreation: [string, ...string[]];
    protected allowedFieldsOnUpdate: [string, ...string[]];
    protected entity = Project;
    protected requiredFieldsOnCreation: [string, ...string[]];
    protected requiredFieldsOnUpdate: [string, ...string[]];

    constructor() {
        super();

        // Defining which properties are requried for creation/update.
        // They could've been initialized directly on property definition as well.
        const allowedFields: [string, ...string[]] = [
            "name",
            "description",
            "startDate",
            "endDate",
            "email",
            "teamSize",
        ];
        const requiredFields: [string, ...string[]] = [
            "name",
            "startDate",
            "endDate",
            "email",
        ];

        this.allowedFieldsOnCreation = allowedFields;
        this.allowedFieldsOnUpdate = allowedFields;
        this.requiredFieldsOnCreation = requiredFields;
        this.requiredFieldsOnUpdate = requiredFields;
    }

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
