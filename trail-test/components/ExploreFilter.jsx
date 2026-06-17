import Dropdown from "react-bootstrap/Dropdown";
import styles from "../src/css/ExploreFilter.module.css";

import explore_search_button from "../src/assets/explore_search_button.svg";
import explore_filter_button from "../src/assets/explore_filter_button.svg";
import sort_button from "../src/assets/sort_button.svg";
import location from "../src/assets/location.svg";
import duration from "../src/assets/duration.svg";
import difficulty from "../src/assets/difficulty.svg";

const sortLabels = {
  newest: "Newest",
  oldest: "Oldest",
  "name-asc": "Name (A → Z)",
  "name-desc": "Name (Z → A)",
  "length-asc": "Length (shortest)",
  "length-desc": "Length (longest)",
};

const durationLabels = {
  Short: "Short (up to 30 min)",
  Medium: "Medium (up to 60 min)",
  Long: "Long (60 min+)",
};

const ExploreFilter = ({
  searchTerm,
  setSearchTerm,
  localityFilter,
  setLocalityFilter,
  difficultyFilter,
  setDifficultyFilter,
  durationFilter,
  setDurationFilter,
  sortOption,
  setSortOption,
}) => {
  const buttonBase =
    "btn bg-white d-flex align-items-center border shadow-none text-nowrap px-3";

  return (
    <div className="d-flex flex-column flex-lg-row gap-3 align-items-stretch align-items-lg-center mb-4">
      <div className={`input-group flex-grow-1 ${styles.searchBox}`}>
        <span
          className={`input-group-text bg-white border-end-0 px-3 ${styles.searchIconBox}`}
        >
          <img src={explore_search_button} alt="" />
        </span>

        <input
          type="text"
          className={`form-control border-start-0 shadow-none ${styles.searchInput}`}
          placeholder="Search trails, topics, locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Dropdown>
        <Dropdown.Toggle
          variant=""
          className={`${buttonBase} justify-content-between w-100 ${styles.selectButton}`}
        >
          <span className="d-flex align-items-center gap-2">
            <img src={location} alt="" className={styles.selectIcon} />
            {localityFilter || "All Locations"}
          </span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setLocalityFilter("")}>
            All Locations
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setLocalityFilter("Slovakia")}>
            Slovakia
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setLocalityFilter("Czech Republic")}>
            Czech Republic
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setLocalityFilter("Spain")}>
            Spain
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown>
        <Dropdown.Toggle
          variant=""
          className={`${buttonBase} justify-content-between w-100 ${styles.selectButton}`}
        >
          <span className="d-flex align-items-center gap-2">
            <img src={difficulty} alt="" className={styles.selectIcon} />
            {difficultyFilter || "All Difficulties"}
          </span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setDifficultyFilter("")}>
            All Difficulties
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setDifficultyFilter("Easy")}>
            Easy
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setDifficultyFilter("Medium")}>
            Medium
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setDifficultyFilter("Hard")}>
            Hard
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown>
        <Dropdown.Toggle
          variant=""
          className={`${buttonBase} justify-content-between w-100 ${styles.selectButton}`}
        >
          <span className="d-flex align-items-center gap-2">
            <img src={duration} alt="" className={styles.selectIcon} />
            {durationFilter ? durationLabels[durationFilter] : "All Durations"}
          </span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setDurationFilter("")}>
            All Durations
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setDurationFilter("Short")}>
            Short (up to 30 min)
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setDurationFilter("Medium")}>
            Medium (up to 60 min)
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setDurationFilter("Long")}>
            Long (60 min+)
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <div className="d-flex gap-3 ms-lg-auto">
        <button
          type="button"
          className={`${buttonBase} justify-content-start ${styles.actionButton}`}
        >
          <img
            src={explore_filter_button}
            alt=""
            className={styles.selectIcon}
          />
          <span className="ms-2">Filters</span>
        </button>

        <Dropdown>
          <Dropdown.Toggle
            variant=""
            className={`${buttonBase} justify-content-start ${styles.actionButton} ${styles.sortButton}`}
          >
            <img src={sort_button} alt="" className={styles.selectIcon} />
            <span className="ms-2">Sort by: {sortLabels[sortOption]}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSortOption("newest")}>
              Newest
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption("oldest")}>
              Oldest
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption("name-asc")}>
              Name (A → Z)
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption("name-desc")}>
              Name (Z → A)
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption("length-asc")}>
              Length (shortest)
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption("length-desc")}>
              Length (longest)
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default ExploreFilter;
