import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
} from '@jupyter-notebook/react-components';

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
              <Button appearance="lightweight" onClick={item.onClick}>
                {item.text}
              </Button>
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
