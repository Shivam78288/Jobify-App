import React from "react";
import { useAppContext } from "../context/appContext";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";
import styled from "styled-components";

const NumPagesComponent = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-wrap: wrap;
  color: var(--primary-500);
`;

const PageButtonContainer = () => {
  const { numOfPages, page, changePage } = useAppContext();

  // pages = [1,2,3,4,.....,numOfPages]
  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1;
  });

  const setPage = (pageNumber) => {
    changePage({ page: pageNumber });
  };

  return (
    <>
      <NumPagesComponent>
        <p>{numOfPages} pages found</p>
      </NumPagesComponent>
      <Wrapper>
        <button
          className="prev-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <HiChevronDoubleLeft />
          Prev
        </button>
        <div className="btn-container">
          {pages.map((pageNumber) => {
            return (
              <button
                type="button"
                className={pageNumber === page ? "pageBtn active" : "pageBtn"}
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
        <button
          className="next-btn"
          disabled={page === numOfPages}
          onClick={() => setPage(page + 1)}
        >
          Next
          <HiChevronDoubleRight />
        </button>
      </Wrapper>
    </>
  );
};

export default PageButtonContainer;
