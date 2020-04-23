import React, { useContext } from 'react';
import { CMSContext } from '../context/cms';
import { getByTag } from '../utils/cms';
import Button from '@/components/Button';

const List = ({ block }) => {
  let { state, dispatch } = useContext(CMSContext);

  const list_elements = state.records.filter(record => {
    return record.tag?.includes(block.key) && record.type == "list-element" && record.enabled;
  });
  console.log(list_elements);

  return <section className="usa-section">
    <div className="grid-container">
      <h2> {block.title} </h2>
      {
        list_elements.map((el)=>{
          return <p>
            <a href={el.href}>{el.title}</a>
          </p>
        })
      }

    </div>
  </section>
}

export default List;