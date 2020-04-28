import { EntityRepository, Repository } from "typeorm";
import Movie from "../entity/Movie";

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {}

export default MovieRepository;
