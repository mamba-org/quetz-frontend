import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';

const Pagination = ({
  pageSize,
  pageCount,
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  pageIndex,
  pageOptions,
  setPageSize
}: any) => (
  <div className="pagination flex">
    <div className="btn-group">
      <button
        className="btn btn-default"
        onClick={() => gotoPage(0)}
        disabled={!canPreviousPage}
      >
        <FontAwesomeIcon icon={faAngleDoubleLeft} />
      </button>
      <button
        className="btn btn-default"
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <button
        className="btn btn-default"
        onClick={() => nextPage()}
        disabled={!canNextPage}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
      <button
        className="btn btn-default"
        onClick={() => gotoPage(pageCount - 1)}
        disabled={!canNextPage}
      >
        <FontAwesomeIcon icon={faAngleDoubleRight} />
      </button>
    </div>
    <p className="paragraph padding-side">
      Page{' '}
      <strong>
        {pageIndex + 1} of {pageOptions.length}
      </strong>
    </p>
    <p className="paragraph padding-side">
      Go to page: &emsp;
      <input
        className="input"
        type="number"
        defaultValue={pageIndex + 1}
        onChange={e => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0;
          gotoPage(page);
        }}
        style={{ width: '100px' }}
      />
    </p>
    <p className="paragraph padding-side">
      <select
        className="btn btn-default"
        value={pageSize}
        onChange={e => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </p>
  </div>
);

export default Pagination;
