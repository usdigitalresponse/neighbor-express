import React, { useContext } from 'react';
import { CMSContext } from '../context/cms';
import { getByTag } from '../utils/cms';
import Button from '@/components/Button';
import Content from '@/components/Content';
import styles from './List.module.css'
var classNames = require('classnames');


const List = ({ block }) => {
  let { state, dispatch } = useContext(CMSContext);

  const list_elements = state.records.filter(record => {
    return record.tag?.includes(block.key) && record.type == "list-element" && record.enabled;
  });

  const imageLinkClasses = classNames(styles.image, "tablet:grid-col-4",
    "height-card-lg", "font-sans-lg", "text-semibold", "padding-105");
  const overlayClasses = classNames(styles.overlay, "display-flex",
    "flex-justify-start", "flex-align-end", "padding-2");

  return <Content block={block}>
    <h2> {block.title} </h2>
    <div className="grid-row grid-gap-lg">
    {
      list_elements.map((el)=>{
        return <a href={el.href} className={imageLinkClasses}
                  style={{  backgroundImage: `url(${el.image})`}} key={el.key}>
          <div className={overlayClasses}>
            {el.title}
          </div>
        </a>
      })
    }
    </div>
  </Content>
}

export default List;