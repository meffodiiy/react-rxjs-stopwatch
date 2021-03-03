import React, { useState, useCallback, useRef, createRef, useEffect } from 'react'
import { interval, fromEvent } from 'rxjs'
import { debounceTime, buffer, map, filter } from 'rxjs/operators'
import './App.css'


export default function App () {
    const [ count, setCount ] = useState(0)
    const [ isOn, setOn ] = useState(false)
    const interval$ = useRef(null)
    const waitButton = createRef()

    const wait = useCallback(() => {
        if (isOn) {
            interval$.current.unsubscribe()
            setOn(false)
        }
    }, [isOn])

    useEffect(() => {
        const click$ = fromEvent(waitButton.current, 'click')
        const buffer$ = click$.pipe(debounceTime(300))
        click$.pipe(
            buffer(buffer$),
            map(a => a.length),
            filter(i => i === 2)
        ).subscribe(wait)
    }, [waitButton, wait])

    const onReset = useCallback(() => {
        setCount(0)
    }, [])

    const onStartOrStop = useCallback(() => {
        if (isOn) {
            wait()
            onReset()
        } else {
            interval$.current = interval(1000).subscribe(() => setCount( c => c + 1))
            setOn(true)
        }
    }, [wait, onReset, isOn])

    const hours = Math.floor(count / (3600)),
          minutes = Math.floor((count - (hours * 3600)) / 60),
          seconds = Math.floor(count % 60);

    return (
        <div className="stopwatch">
            <p>{ `${hours > 9 ? hours : '0' + hours }:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}` }</p>
            <div className="buttons">
                <button onClick={ onStartOrStop }>
                    { isOn ? 'STOP' : 'START' }
                </button>
                <button ref={ waitButton }>
                    WAIT
                </button>
                <button onClick={ onReset }>
                    RESET
                </button>
            </div>
        </div>
    )
}
