import { reduce, union } from 'lodash';

import { Link } from 'react-router-dom';

import * as React from 'react';

const BreadcrumbChild = ({ data }: any) => {
  if (data.link) {
    return (
      <Link to={data.link} className="breadcrumb-link">
        {data.text}
      </Link>
    );
  }
  if (data.href) {
    return (
      <a href={data.href} className="breadcrumb-link">
        {data.text}
      </a>
    );
  }
  return data.text;
};

class Breadcrumbs extends React.PureComponent<any, any> {
  render() {
    const { items } = this.props;
    return (
      <div className="breadcrumbs">
        {(reduce(
          items,
          (unionArray: Array<any>, item: any) =>
            union(unionArray, [
              <div className="breadcrumb-item" key={item.text}>
                <BreadcrumbChild data={item} />
              </div>,
              <div
                className="breadcrumb-separator"
                key={`${item.text}-separator`}
              >
                &emsp;/&emsp;
              </div>,
            ]),
          []
        ) as Array<any>).slice(0, -1)}
      </div>
    );
  }
}

export default Breadcrumbs;
