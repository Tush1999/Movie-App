import { useState, useEffect } from "react";

import { fetchAllGenres } from "../apis/movies";

const SidebarFilters = ({ activeGenresIds, setActiveGenresIds }) => {
  const [genresList, setGeneresList] = useState([]);

  useEffect(() => {
    fetchAllGenres().then((res) => {
      const genres = res?.data?.genres;
      setGeneresList(genres);
    });
  }, []);

  const handleChange = (evt) => {
    const { value, checked } = evt.target;

    let activeIds = checked
      ? activeGenresIds.concat(value)
      : activeGenresIds.filter((ids) => ids != value);

    setActiveGenresIds(activeIds);
  };

  return (
    <div className="filter-container">
      <div>Filters By:</div>
      {genresList.map(({ id, name }) => (
        <div className="filters">
          <input
            type="checkbox"
            id={id}
            name={name}
            value={id}
            onChange={handleChange}
          />
          <label htmlFor={id}>{name}</label>
        </div>
      ))}
    </div>
  );
};

export default SidebarFilters;
