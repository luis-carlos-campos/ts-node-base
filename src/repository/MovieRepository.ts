import AbstractRepository from "./AbstractRepository";
import Movie from "../entity/Movie";

class MovieRepository extends AbstractRepository<Movie> {
    protected type = Movie;
}
export default MovieRepository;
