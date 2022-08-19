import { useTimer } from 'context/Timer';
import * as React from 'react';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';

export const Timer = () => {
     const [elapsed, setElapsed] = useTimer();
     const [isRunning, setIsRunning] = React.useState(false);

     const tick = React.useCallback(() => {
          setElapsed(elapsed + 1);
     }, [elapsed, setElapsed])

     const ref = React.useRef<() => any>(tick);

     React.useEffect(() => {
          ref.current = tick;
     }, [tick])

     React.useEffect(() => {
          if (!isRunning) return;

          const id = setInterval(() => {
               ref.current();
          }, 1000)

          return () => {
               clearInterval(id);
          }
     }, [isRunning])

     const start = () => {
          if (isRunning) return;
          setIsRunning(true);
     }

     const stop = () => {
          if (!isRunning) return;
          setIsRunning(false);
     }

     return (
          <div className="timer">
               <div className="screen">
                    <span>{Math.floor(elapsed / 60).toString().padStart(2, '0')}m : {Math.floor(elapsed % 60).toString().padStart(2, '0')}s</span>
               </div>
               <div className="buttons">
                    {isRunning ? (
                         <button className="icon" onClick={() => stop()}>
                              <FaPauseCircle />
                              <span>Stop</span>
                         </button>
                    ) : (
                              <button className="icon" onClick={() => start()}>
                                   <FaPlayCircle />
                                   <span>Start</span>
                              </button>
                         )}
               </div>
          </div>
     )
}