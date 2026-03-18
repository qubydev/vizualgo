"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BarPlot } from '../core/array/bar-plot';
import Controllers from '../custom-ui/controllers';

const initialData = [
    { id: '1', value: -3, state: 'idle' },
    { id: '2', value: 7, state: 'idle' },
    { id: '3', value: 0, state: 'idle' },
    { id: '4', value: -10, state: 'idle' },
    { id: '5', value: 5, state: 'idle' },
    { id: '6', value: 2, state: 'idle' },
    { id: '7', value: -7, state: 'idle' },
    { id: '8', value: 10, state: 'idle' },
    { id: '9', value: -1, state: 'idle' },
    { id: '10', value: 6, state: 'idle' },
    { id: '11', value: 3, state: 'idle' },
    { id: '12', value: -5, state: 'idle' },
    { id: '13', value: 9, state: 'idle' },
];

const INITIAL_MESSAGE = 'Click start to see the bubble sort in action!';

export default function BubbleSortDemo() {
    const [sampleData, setSampleData] = useState(initialData);
    const [isSorting, setIsSorting] = useState(false);
    const [message, setMessage] = useState(INITIAL_MESSAGE);
    const [speed, setSpeed] = useState(1);

    const iRef = useRef(0);
    const jRef = useRef(0);
    const phaseRef = useRef(0);
    const intervalRef = useRef(null);
    const historyRef = useRef([]);
    const stepForwardRef = useRef(null);
    const messageRef = useRef(INITIAL_MESSAGE);

    const setMsg = useCallback((msg) => {
        messageRef.current = msg;
        setMessage(msg);
    }, []);

    const stepForward = useCallback(() => {
        const i = iRef.current;
        const j = jRef.current;
        const phase = phaseRef.current;

        if (i >= initialData.length - 1) {
            clearInterval(intervalRef.current);
            setIsSorting(false);
            setSampleData(prev => prev.map(d => ({ ...d, state: 'success' })));
            setMsg('Sorting complete!');
            return;
        }

        if (phase === 0) {
            const msg = `Comparing indices ${j} and ${j + 1}`;
            setSampleData(prevData => {
                historyRef.current.push({ data: prevData.map(d => ({ ...d })), i, j, phase: 0, message: messageRef.current });
                return prevData.map((d, idx) => ({
                    ...d,
                    state: d.state === 'success' ? 'success' : idx === j || idx === j + 1 ? 'active' : 'idle'
                }));
            });
            setMsg(msg);
            phaseRef.current = 1;
        } else {
            setSampleData(prevData => {
                const data = prevData.map(d => ({ ...d, state: d.state === 'success' ? 'success' : 'idle' }));
                const swapped = data[j].value > data[j + 1].value;
                if (swapped) [data[j], data[j + 1]] = [data[j + 1], data[j]];
                const msg = swapped
                    ? `Swapped, because ${data[j + 1].value} > ${data[j].value}`
                    : `No swap needed, because ${data[j].value} <= ${data[j + 1].value}`;
                historyRef.current.push({ data: prevData.map(d => ({ ...d })), i, j, phase: 1, message: messageRef.current });
                const nextJ = j + 1;
                if (nextJ >= initialData.length - i - 1) {
                    data[initialData.length - i - 1].state = 'success';
                    iRef.current = i + 1;
                    jRef.current = 0;
                } else {
                    jRef.current = nextJ;
                }
                phaseRef.current = 0;
                setMsg(msg);
                return data;
            });
        }
    }, [setMsg]);

    useEffect(() => {
        stepForwardRef.current = stepForward;
    }, [stepForward]);

    const reset = useCallback(() => {
        clearInterval(intervalRef.current);
        iRef.current = 0;
        jRef.current = 0;
        phaseRef.current = 0;
        historyRef.current = [];
        setSampleData(initialData.map(item => ({ ...item, state: 'idle' })));
        setIsSorting(false);
        setMsg(INITIAL_MESSAGE);
    }, [setMsg]);

    const stepBackward = useCallback(() => {
        const history = historyRef.current;
        if (history.length === 0) return;
        const prev = history.pop();
        iRef.current = prev.i;
        jRef.current = prev.j;
        phaseRef.current = prev.phase;
        setSampleData(prev.data);
        setMsg(prev.message);
    }, [setMsg]);

    const startSorting = useCallback(() => {
        if (isSorting) return;
        setIsSorting(true);
        intervalRef.current = setInterval(() => stepForwardRef.current?.(), 500 / speed);
    }, [isSorting, speed]);

    const pauseSorting = useCallback(() => {
        clearInterval(intervalRef.current);
        setIsSorting(false);
    }, []);

    const handleSpeedToggle = useCallback(() => {
        const newSpeed = speed === 1 ? 2 : speed === 2 ? 4 : 1;
        setSpeed(newSpeed);
        if (isSorting) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => stepForwardRef.current?.(), 500 / newSpeed);
        }
    }, [speed, isSorting]);

    return (
        <div>
            <div className='py-4'>
                <BarPlot data={sampleData} />
            </div>
            <p className='text-xs'>{"> "}{message}</p>
            <Controllers
                isSorting={isSorting}
                speed={speed}
                onStart={startSorting}
                onPause={pauseSorting}
                onStepForward={stepForward}
                onStepBackward={stepBackward}
                onReset={reset}
                onSpeedToggle={handleSpeedToggle}
            />
        </div>
    );
}