import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';

import InlineLoader from './loader';

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
  setPageSize,
  loading
}: any) => (
  <div className="jp-table-controls">
    <div className="jp-table-controls-left">
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
      <div className="jp-table-controls-text">
        {loading ? (
          <InlineLoader />
        ) : (
          <p className="paragraph padding-text">
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </p>
        )}
      </div>
    </div>

    <div className="jp-table-controls-right jp-table-controls-text">
      <p className="paragraph padding-side">
        Go to page: &emsp;
        <input
          className="input"
          type="number"
          value={pageIndex + 1}
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
          {[25, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize} defaultValue="25">
              Show {pageSize}
            </option>
          ))}
        </select>
      </p>
    </div>
  </div>
);

export default Pagination;
