import React, { useReducer } from "react";
import { processRecords } from '@/utils/cms';
import { records } from '../cms-cache.js'

let CMSContext = React.createContext();

let initialState = {
  records: processRecords(records, {language: 'en'}),
  language: 'en'
};

let reducer = (state, action) => {
  switch (action.type) {
    case "set-records":
      return { ...state, records: action.payload };
    case "set-cached-records":
      // Cached records should never overwrite existing records if we have them
      if (state.records.length == 0) {
        return { ...state, records: action.payload };
      } else {
        console.warn("Tried to use cached records when we already had some.");
      }
    case "set-language":
      const { records } = state;
      return {
        ...state,
        language: action.payload,
        records: processRecords(records, {language: action.payload} )
      };
  }
};

function CMSContextProvider(props) {
  let [state, dispatch] = useReducer(reducer, initialState);
  let value = { state, dispatch };

  return (
    <CMSContext.Provider value={value}>{props.children}</CMSContext.Provider>
  );
}

let CMSContextConsumer = CMSContext.Consumer;

export { CMSContext, CMSContextProvider, CMSContextConsumer };
