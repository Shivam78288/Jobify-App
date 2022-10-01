import React from "react";
import { FormRow, FormRowSelect } from ".";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/SearchContainer";

const SearchContainer = () => {
  const {
    isLoading,
    searchType,
    searchPosition,
    searchCompany,
    searchStatus,
    sort,
    sortOptions,
    jobStatusOptions,
    jobTypeOptions,
    handleInputChange,
    clearFilters,
  } = useAppContext();

  const handleSearch = (e) => {
    if (isLoading) return;
    handleInputChange({ key: e.target.name, value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearFilters();
  };

  return (
    <Wrapper>
      <form className="form">
        <h4>search form</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="searchPosition"
            value={searchPosition}
            labelText="Job Title"
            handleChange={handleSearch}
          ></FormRow>
          <FormRow
            type="text"
            name="searchCompany"
            value={searchCompany}
            labelText="Company"
            handleChange={handleSearch}
          ></FormRow>
          <FormRowSelect
            labelText="status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            options={["all", ...jobStatusOptions]}
          ></FormRowSelect>
          <FormRowSelect
            labelText="type"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            options={["all", ...jobTypeOptions]}
          ></FormRowSelect>
          <FormRowSelect
            labelText="sort"
            name="sort"
            value={sort}
            handleChange={handleSearch}
            options={sortOptions}
          ></FormRowSelect>
          <button
            disabled={isLoading}
            className="btn btn-danger btn-block"
            onClick={handleSubmit}
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
