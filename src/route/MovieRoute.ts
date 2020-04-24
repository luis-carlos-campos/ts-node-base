import AbstractRoute from "./AbstractRoute";
import Movie from "../entity/Movie";
import MovieRepository from "../repository/MovieRepository";
import MovieController from "../controller/MovieController";

class MovieRoute extends AbstractRoute<
    Movie,
    MovieRepository,
    MovieController
> {
    constructor() {
        super(MovieController);
    }
}

export default MovieRoute;
