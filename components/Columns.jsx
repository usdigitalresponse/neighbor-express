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
    <div className="grid-row grid-gap">
      {
        columns.map((column) => {
          return <div className="tablet:grid-col" key={column.key}>
            {column.image && <img src={column.image} />}
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