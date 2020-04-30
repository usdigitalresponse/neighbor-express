import React, { useContext } from 'react';
import { CMSContext } from '../context/cms';
import { getByTag } from '../utils/cms';
import Button from '@/components/Button';
import Content from '@/components/Content';

const List = ({ block }) => {
  let { state, dispatch } = useContext(CMSContext);

  const list_elements = state.records.filter(record => {
    return record.tag?.includes(block.key) && record.type == "list-element" && record.enabled;
  });

  return <Content block={block}>
    <h2> {block.title} </h2>
    <div className="grid-row grid-gap-lg">
    {
      list_elements.map((el)=>{
        return <a href={el.href} className="tablet:grid-col-4 height-card-lg text-center
                                            text-base-lightest font-sans-xl text-middle
                                            padding-105 display-flex flex-justify-center
                                            flex-align-center"
                  style={{ backgroundImage: `url(${el.image})`,
                           backgroundSize: "cover",  backgroundClip: "content-box",
                           textDecoration: "none" }}
                  key={el.key}>
          <div>
            {el.title}
          </div>
        </a>
      })
    }
    </div>
  </Content>
}

export default List;