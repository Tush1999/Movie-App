import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";

import MovieCard from "./card";

import { fetchMovieList } from "../apis/movies";

import SidebarFilters from "./sidebar-filters";
import useInfiniteScroll from "../hooks/infinite-scroll";

const MoviesList = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [list, setList] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [year, setYear] = useState(2012);
  const [activeGenresIds, setActiveGenresIds] = useState([]);

  const fetchMovies = (movieYear = year, page = 1) => {
    const genresId = id || activeGenresIds.join(",");

    fetchMovieList({ movieYear, genresId })
      .then((response) => {
        const { results } = response?.data || {};
        
        setYear(movieYear + 1);
        setList((data) => ({ ...data, [movieYear]: results }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const inifiniteFetchMovies = () => {
    const currentYear = new Date().getFullYear();

    if (year <= currentYear) {
      fetchMovies();
    }
  };

  useInfiniteScroll({ successFunc: inifiniteFetchMovies });

  useEffect(() => {
    if (id) {
      setList([]);
      setYear(2012);
    }
    fetchMovies(2012);
  }, [id, activeGenresIds]);

  if (isLoading) {
    return <div>...Data is loading</div>;
  }

  return (
    <>
      {id && (
        <div onClick={() => navigate("/")} className="back">
          Back
        </div>
      )}
      <div className="movie-list-wrapper">
        {!id && (
          <SidebarFilters
            activeGenresIds={activeGenresIds}
            setActiveGenresIds={setActiveGenresIds}
          />
        )}
        <div className="right-container">
          {Object.entries(list).map(([key, values]) => {
            return (
              <div className="list-container">
                <div className="selected-year">{key}</div>
                <div className="movie-list-container">
                  {values?.length ? (
                    values.map((data) => <MovieCard {...data} />)
                  ) : (
                    <div className="no-movie">No movies under this filter</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MoviesList;
