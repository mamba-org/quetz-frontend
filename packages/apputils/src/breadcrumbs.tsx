import { Breadcrumb, BreadcrumbItem } from '@jupyter-notebook/react-components';

import * as React from 'react';
export interface IBreadcrumbsProps {
  items: {
    /**
     * href
     */
    href?: string;
    /**
     * on click callback
     *
     * It will shadow href if defined
     */
    onClick?: (event: React.MouseEvent) => void;
    /**
     * Item content
     */
    text: string;
  }[];
}

export class Breadcrumbs extends React.PureComponent<IBreadcrumbsProps> {
  render(): JSX.Element {
    const { items } = this.props;
    return (
      <Breadcrumb>
        {items.map((item) =>
          item.onClick ? (
            <BreadcrumbItem key={item.text}>
              <a onClick={item.onClick}>{item.text}</a>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem key={item.text} href={item.href}>
              {item.text}
            </BreadcrumbItem>
          )
        )}
      </Breadcrumb>
    );
  }
}
