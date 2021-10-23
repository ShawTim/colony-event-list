import React from 'react';
import styles from './index.module.scss';

export type ItemListProps = React.HTMLAttributes<HTMLElement>;

const ItemList = (props: ItemListProps) => (
  <ol {...props} className={[styles.itemListContainer, props.className].join(" ")}>
    {props.children}
  </ol>
);

export default ItemList;