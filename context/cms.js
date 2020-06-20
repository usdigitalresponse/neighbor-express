import React, { useReducer } from "react";
import { processRecords } from '@/utils/cms';
import NodeCache from 'node-cache';

const cache = new NodeCache({ checkperiod: 120 });
let CMSContext = React.createContext();

let initialState = {
  records: [],
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
        records: processRecords(records, { language: action.payload })
      };
  }
};

function CMSContextProvider({ children, records }) {
  let [state, dispatch] = useReducer(reducer, {
    records,
    language: 'en'
  });
  let value = { state, dispatch };

  return (
    <CMSContext.Provider value={value}>{children}</CMSContext.Provider>
  );
}

let CMSContextConsumer = CMSContext.Consumer;

export { CMSContext, CMSContextProvider, CMSContextConsumer };
