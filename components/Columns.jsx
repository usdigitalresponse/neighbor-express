import React, { useContext } from 'react';
import { CMSContext } from '../context/cms';
import Button from '@/components/Button';
import Content from '@/components/Content';


const Columns = ({ block }) => {
  let { state, dispatch } = useContext(CMSContext);

  const columns = state.records.filter(record => {
    return record.tag?.includes(block.key) && record.type == "column" && record.enabled;
  });


  return <Content block={block}>
    <h2> {block.title} </h2>
    <div className="grid-row grid-gap">
      {
        columns.map((column) => {
          const imageElement = column.image && column.href ?
            <a href={column.href}>
              <img src={column.image} alt={column.alt}/>
            </a> :
            <img src={column.image} alt={column.alt}/>

          return <div className="tablet:grid-col" key={column.key}>
            {column.image && imageElement}
            {column.title && <h3 className="font-heading-xl margin-top-0 tablet:margin-bottom-0">
              {column.title}
            </h3>}
            {column.body_markdown && <div>
              {column.body_markdown}
            </div>}
          </div>
        })
      }
    </div>
  </Content>
}


export default Columns;