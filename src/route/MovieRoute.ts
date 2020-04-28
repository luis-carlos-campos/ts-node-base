import AbstractRoute from "./AbstractRoute";
import Movie from "../entity/Movie";
import MovieController from "../controller/MovieController";

class MovieRoute extends AbstractRoute<Movie, MovieController> {
    constructor() {
        super(MovieController);
    }
}

export default MovieRoute;
