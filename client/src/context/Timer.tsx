import * as React from 'react';

export const useTimer = () => {
     return React.useContext(TimerContext);
}

export const TimerContextProvider = (props: any) => {
     const [count, setCount] = React.useState(0);

     const value = React.useMemo(() => [count, setCount], [count]);

     return (
          <TimerContext.Provider value={value} {...props} />
     )
}

export const TimerContext = React.createContext<any>(0);