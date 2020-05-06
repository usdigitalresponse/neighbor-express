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
                                            font-sans-lg text-semibold padding-105"
                  style={{ backgroundImage: `url(${el.image})`,
                           backgroundSize: "cover",  backgroundClip: "content-box",
                           textDecoration: "none" }}
                  key={el.key}>
          <div className="display-flex flex-justify-start flex-align-end padding-2"
               style={{ height: "100%", width: "100%", color: "white",
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))'}}>
            {el.title}
          </div>
        </a>
      })
    }
    </div>
  </Content>
}

export default List;