import React, { useReducer } from "react";

let CMSContext = React.createContext();

let initialState = {
  records: [],
  language: 'en'
};

let reducer = (state, action) => {
  switch (action.type) {
    case "set-records":
      return { ...state, records: action.payload };
    case "set-language":
      return { ...state, language: action.payload };
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
