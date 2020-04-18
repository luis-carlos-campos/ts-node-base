import AbstractController from "./AbstractController";
import MovieRepository from "../repository/MovieRepository";
import Movie from "../entity/Movie";

class MovieController extends AbstractController<Movie, MovieRepository> {
    // Overwriting required properties
    protected allowedFieldsOnCreation: [string, ...string[]];
    protected allowedFieldsOnUpdate: [string, ...string[]];
    protected entity = Movie;
    protected requiredFieldsOnCreation: [string, ...string[]];
    protected requiredFieldsOnUpdate: [string, ...string[]];

    constructor() {
        super(MovieRepository);

        // Defining which properties are requried for creation/update.
        // They could've been initialized directly on property definition as well.
        const allowedFields: [string, ...string[]] = [
            "name",
            "description",
            "time",
            "views",
            "isPublished",
        ];
        const requiredFields: [string, ...string[]] = ["name", "description"];

        this.allowedFieldsOnCreation = allowedFields;
        this.allowedFieldsOnUpdate = allowedFields;
        this.requiredFieldsOnCreation = requiredFields;
        this.requiredFieldsOnUpdate = requiredFields;
    }
}

export default MovieController;
