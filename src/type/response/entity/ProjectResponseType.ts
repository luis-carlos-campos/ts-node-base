type ProjectResponseType = {
    type: string;
    id: number;
    attributes: {
        name: string;
        description: string;
        startDate: Date;
        endDate: Date;
        email: string;
        teamSize: number;
    };
};

export default ProjectResponseType;
