import Dropdown from "react-bootstrap/Dropdown";
import styles from "../src/css/ExploreFilter.module.css";

import explore_search_button from "../src/assets/explore_search_button.svg";
import explore_filter_button from "../src/assets/explore_filter_button.svg";
import sort_button from "../src/assets/sort_button.svg";
import location from "../src/assets/location.svg";
import duration from "../src/assets/duration.svg";
import difficulty from "../src/assets/difficulty.svg";
import arrow_down from "../src/assets/arrow_down.svg";

const sortLabels = {
  newest: "Newest",
  oldest: "Oldest",
  "name-asc": "Name (A → Z)",
  "name-desc": "Name (Z → A)",
  "length-asc": "Shortest",
  "length-desc": "Longest",
};

const difficultyLabels = {
  easy: "Easy",
  moderate: "Medium",
  difficult: "Hard",
};

const durationLabels = {
  short: "Short",
  medium: "Medium",
  long: "Long",
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

  const dropdownButtonClass = `${buttonBase} justify-content-between w-100 ${styles.selectButton}`;

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

      <div className="d-flex gap-2 gap-lg-3">
        <Dropdown className="flex-fill">
          <Dropdown.Toggle
            variant=""
            className={`${dropdownButtonClass} ${styles.noCaret}`}
          >
            <span className="d-flex align-items-center gap-2">
              <img src={location} alt="" className={styles.selectIcon} />
              <span className={styles.mobileShortText}>
                {localityFilter || "All Locations"}
              </span>
            </span>
            <img src={arrow_down} alt="" className={styles.arrowIcon} />
          </Dropdown.Toggle>

          <Dropdown.Menu className={styles.dropdownMenu}>
            {["", "Slovakia", "Czech Republic", "Spain"].map((value) => (
              <Dropdown.Item
                key={value || "all"}
                active={localityFilter === value}
                onClick={() => setLocalityFilter(value)}
              >
                {value || "All Locations"}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="flex-fill">
          <Dropdown.Toggle
            variant=""
            className={`${dropdownButtonClass} ${styles.noCaret}`}
          >
            <span className="d-flex align-items-center gap-2">
              <img src={difficulty} alt="" className={styles.selectIcon} />
              <span className={styles.mobileShortText}>
                {difficultyFilter
                  ? difficultyLabels[difficultyFilter]
                  : "All Difficulties"}
              </span>
            </span>
            <img src={arrow_down} alt="" className={styles.arrowIcon} />
          </Dropdown.Toggle>

          <Dropdown.Menu className={styles.dropdownMenu}>
            <Dropdown.Item
              active={difficultyFilter === ""}
              onClick={() => setDifficultyFilter("")}
            >
              All Difficulties
            </Dropdown.Item>

            {Object.entries(difficultyLabels).map(([value, label]) => (
              <Dropdown.Item
                key={value}
                active={difficultyFilter === value}
                onClick={() => setDifficultyFilter(value)}
              >
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="flex-fill">
          <Dropdown.Toggle
            variant=""
            className={`${dropdownButtonClass} ${styles.noCaret}`}
          >
            <span className="d-flex align-items-center gap-2">
              <img src={duration} alt="" className={styles.selectIcon} />
              <span className={styles.mobileShortText}>
                {durationFilter
                  ? durationLabels[durationFilter]
                  : "All Durations"}
              </span>
            </span>
            <img src={arrow_down} alt="" className={styles.arrowIcon} />
          </Dropdown.Toggle>

          <Dropdown.Menu className={styles.dropdownMenu}>
            <Dropdown.Item
              active={durationFilter === ""}
              onClick={() => setDurationFilter("")}
            >
              All Durations
            </Dropdown.Item>

            {Object.entries(durationLabels).map(([value, label]) => (
              <Dropdown.Item
                key={value}
                active={durationFilter === value}
                onClick={() => setDurationFilter(value)}
              >
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="d-lg-none flex-shrink-0">
          <Dropdown.Toggle
            variant=""
            className={`btn bg-white border shadow-none ${styles.iconOnlyButton} ${styles.noCaret}`}
          >
            <img src={sort_button} alt="Sort" className={styles.selectIcon} />
          </Dropdown.Toggle>

          <Dropdown.Menu align="end" className={styles.dropdownMenu}>
            {Object.entries(sortLabels).map(([value, label]) => (
              <Dropdown.Item
                key={value}
                active={sortOption === value}
                onClick={() => setSortOption(value)}
              >
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="d-none d-lg-flex gap-3 ms-lg-auto">
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
            className={`${buttonBase} justify-content-between ${styles.actionButton} ${styles.sortButton} ${styles.noCaret}`}
          >
            <span className="d-flex align-items-center">
              <img src={sort_button} alt="" className={styles.selectIcon} />
              <span className="ms-2">Sort by: {sortLabels[sortOption]}</span>
            </span>
            <img src={arrow_down} alt="" className={styles.arrowIcon} />
          </Dropdown.Toggle>

          <Dropdown.Menu className={styles.dropdownMenu}>
            {Object.entries(sortLabels).map(([value, label]) => (
              <Dropdown.Item
                key={value}
                active={sortOption === value}
                onClick={() => setSortOption(value)}
              >
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default ExploreFilter;
