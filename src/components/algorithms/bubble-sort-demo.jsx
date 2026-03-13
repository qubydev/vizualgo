"use client";
import React, { useState, useRef, useCallback } from 'react';
import { BarPlot } from '../core/array/bar-plot';
import { Button } from '../ui/button';
import { SkipForward, SkipBack, Pause, Play } from 'lucide-react';

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

export default function BubbleSortDemo() {
    const [sampleData, setSampleData] = useState(initialData);
    const [isSorting, setIsSorting] = useState(false);

    const iRef = useRef(0);
    const jRef = useRef(0);
    const phaseRef = useRef(0);
    const intervalRef = useRef(null);
    const historyRef = useRef([]);

    const reset = useCallback(() => {
        clearInterval(intervalRef.current);
        iRef.current = 0;
        jRef.current = 0;
        phaseRef.current = 0;
        historyRef.current = [];
        setSampleData(initialData.map(item => ({ ...item, state: 'idle' })));
        setIsSorting(false);
    }, []);

    const stepForward = useCallback(() => {
        const i = iRef.current;
        const j = jRef.current;
        const phase = phaseRef.current;

        if (i >= initialData.length - 1) {
            clearInterval(intervalRef.current);
            setIsSorting(false);
            setSampleData(prev => prev.map(d => ({ ...d, state: 'success' })));
            return;
        }

        if (phase === 0) {
            setSampleData(prevData => {
                historyRef.current.push({ data: prevData.map(d => ({ ...d })), i, j, phase: 0 });
                return prevData.map((d, idx) => ({
                    ...d,
                    state: d.state === 'success' ? 'success' : idx === j || idx === j + 1 ? 'active' : 'idle'
                }));
            });
            phaseRef.current = 1;
        } else {
            setSampleData(prevData => {
                historyRef.current.push({ data: prevData.map(d => ({ ...d })), i, j, phase: 1 });
                const data = prevData.map(d => ({
                    ...d,
                    state: d.state === 'success' ? 'success' : 'idle'
                }));

                if (data[j].value > data[j + 1].value) {
                    const temp = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = temp;
                }

                const nextJ = j + 1;
                if (nextJ >= initialData.length - i - 1) {
                    data[initialData.length - i - 1].state = 'success';
                    iRef.current = i + 1;
                    jRef.current = 0;
                } else {
                    jRef.current = nextJ;
                }

                phaseRef.current = 0;
                return data;
            });
        }
    }, []);

    const stepBackward = useCallback(() => {
        const history = historyRef.current;
        if (history.length === 0) return;

        const prev = history.pop();
        iRef.current = prev.i;
        jRef.current = prev.j;
        phaseRef.current = prev.phase;
        setSampleData(prev.data);
    }, []);

    const startSorting = useCallback(() => {
        if (isSorting) return;
        setIsSorting(true);
        intervalRef.current = setInterval(stepForward, 500);
    }, [isSorting, stepForward]);

    const pauseSorting = useCallback(() => {
        clearInterval(intervalRef.current);
        setIsSorting(false);
    }, []);

    return (
        <div>
            <BarPlot data={sampleData} />
            <div className="flex items-center gap-2 mt-4">
                <Button onClick={isSorting ? pauseSorting : startSorting}>
                    {isSorting ? <><Pause className="mr-1" /> Pause</> : <><Play className="mr-1" /> Start</>}
                </Button>
                <Button variant="outline" size="icon" onClick={stepBackward}>
                    <SkipBack />
                </Button>
                <Button variant="outline" size="icon" onClick={stepForward}>
                    <SkipForward />
                </Button>
                <Button variant="destructive" onClick={reset}>
                    Reset
                </Button>
            </div>
        </div>
    );
}