import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  NumberField,
  Option,
  Select,
} from '@jupyter-notebook/react-components';
import { InlineLoader } from '@quetz-frontend/apputils';
import * as React from 'react';

export const Pagination = ({
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
  loading,
  showPagination,
}: any) => {
  const JSXButtonGroup = () => {
    if (showPagination) {
      return (
        <div className="btn-group">
          <Button
            title="Go to first page"
            appearance="stealth"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </Button>
          <Button
            title="Go to previous page"
            appearance="stealth"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </Button>
          <Button
            title="Go to next page"
            appearance="stealth"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </Button>
          <Button
            title="Go to last page"
            appearance="stealth"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </Button>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const JSXPageIndex = () => {
    if (showPagination) {
      return (
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
      );
    } else {
      return <div></div>;
    }
  };

  const JSXPageNumberField = () => {
    if (showPagination) {
      return (
        <p className="paragraph padding-side">
          Go to page: &emsp;
          <NumberField
            value={pageIndex + 1}
            onChange={(e) => {
              // @ts-expect-error target has value
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px', verticalAlign: 'middle' }}
          />
        </p>
      );
    } else {
      return <p></p>;
    }
  };

  return (
    <div className="jp-table-controls">
      <div className="jp-table-controls-left">
        <JSXButtonGroup />
        <JSXPageIndex />
      </div>
      <div className="jp-table-controls-right jp-table-controls-text">
        <JSXPageNumberField />
        <p className="paragraph padding-side">
          <Select
            defaultValue="25"
            value={pageSize.toString()}
            onChange={(e) => {
              // @ts-expect-error target has value
              setPageSize(Number(e.target.value));
            }}
          >
            {['25', '50', '100'].map((pageSize) => (
              <Option key={pageSize} value={pageSize}>
                Show {pageSize}
              </Option>
            ))}
          </Select>
        </p>
      </div>
    </div>
  );
};
