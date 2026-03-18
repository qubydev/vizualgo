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

const INITIAL_MESSAGE = 'Click start to see the selection sort in action!';

export default function SelectionSortDemo() {
    const [sampleData, setSampleData] = useState(initialData);
    const [isSorting, setIsSorting] = useState(false);
    const [message, setMessage] = useState(INITIAL_MESSAGE);
    const [speed, setSpeed] = useState(1);
    const [pointers, setPointers] = useState([]);

    const iRef = useRef(0);
    const jRef = useRef(1);
    const minIdxRef = useRef(0);
    const intervalRef = useRef(null);
    const historyRef = useRef([]);
    const stepForwardRef = useRef(null);
    const messageRef = useRef(INITIAL_MESSAGE);

    const setMsg = useCallback((msg) => {
        messageRef.current = msg;
        setMessage(msg);
    }, []);

    const buildPointers = (i, j, minIdx, length) => {
        const pts = [];
        if (i < length) pts.push({ index: i, label: 'i', color: '#a78bfa' });
        if (j < length) pts.push({ index: j, label: 'j', color: '#fb923c' });
        if (minIdx < length) pts.push({ index: minIdx, label: 'min', color: '#f43f5e' });
        return pts;
    };

    const stepForward = useCallback(() => {
        const i = iRef.current;
        const j = jRef.current;
        const minIdx = minIdxRef.current;

        if (i >= initialData.length - 1) {
            clearInterval(intervalRef.current);
            setIsSorting(false);
            setSampleData(prev => prev.map(d => ({ ...d, state: 'success' })));
            setMsg('Sorting complete!');
            setPointers([]);
            return;
        }

        if (j < initialData.length) {
            setSampleData(prevData => {
                historyRef.current.push({ data: prevData.map(d => ({ ...d })), i, j, minIdx, message: messageRef.current, pointers: buildPointers(i, j, minIdx, initialData.length) });
                const newMin = prevData[j].value < prevData[minIdx].value ? j : minIdx;
                const msg = newMin !== minIdx
                    ? `New minimum found: ${prevData[j].value} at index ${j}`
                    : `${prevData[j].value} >= current min ${prevData[minIdx].value}, no change`;
                minIdxRef.current = newMin;
                jRef.current = j + 1;
                setMsg(msg);
                setPointers(buildPointers(i, j + 1, newMin, initialData.length));
                return prevData.map((d, idx) => ({
                    ...d,
                    state: d.state === 'success' ? 'success' : idx === j || idx === newMin ? 'active' : 'idle'
                }));
            });
        } else {
            setSampleData(prevData => {
                historyRef.current.push({ data: prevData.map(d => ({ ...d })), i, j, minIdx, message: messageRef.current, pointers: buildPointers(i, j, minIdx, initialData.length) });
                const data = prevData.map(d => ({ ...d, state: d.state === 'success' ? 'success' : 'idle' }));
                if (minIdx !== i) [data[i], data[minIdx]] = [data[minIdx], data[i]];
                data[i].state = 'success';
                const msg = minIdx !== i
                    ? `Swapped index ${i} and ${minIdx}, position ${i} is sorted`
                    : `No swap needed, index ${i} is already the minimum`;
                const nextI = i + 1;
                iRef.current = nextI;
                jRef.current = nextI + 1;
                minIdxRef.current = nextI;
                setMsg(msg);
                setPointers(buildPointers(nextI, nextI + 1, nextI, initialData.length));
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
        jRef.current = 1;
        minIdxRef.current = 0;
        historyRef.current = [];
        setSampleData(initialData.map(item => ({ ...item, state: 'idle' })));
        setIsSorting(false);
        setMsg(INITIAL_MESSAGE);
        setPointers([]);
    }, [setMsg]);

    const stepBackward = useCallback(() => {
        const history = historyRef.current;
        if (history.length === 0) return;
        const prev = history.pop();
        iRef.current = prev.i;
        jRef.current = prev.j;
        minIdxRef.current = prev.minIdx;
        setSampleData(prev.data);
        setMsg(prev.message);
        setPointers(prev.pointers);
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
                <BarPlot data={sampleData} pointers={pointers} />
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