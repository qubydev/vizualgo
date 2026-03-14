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

/**
 * Selection Sort — per step:
 *   - Scan through the unsorted region (i..n-1), tracking minIdx
 *   - Highlight i (pivot), minIdx (current best), and j (current scan target) as 'active'
 *   - When j reaches end of unsorted region: swap data[i] ↔ data[minIdx], mark i as 'success', advance i
 *
 * History stack stores { data, i, j, minIdx } snapshots for step-back support.
 */
export default function SelectionSortDemo() {
    const [sampleData, setSampleData] = useState(initialData);
    const [isSorting, setIsSorting] = useState(false);

    const iRef = useRef(0); // start of unsorted region
    const jRef = useRef(1); // current scan position
    const minIdxRef = useRef(0); // index of current minimum in unsorted region
    const intervalRef = useRef(null);
    const historyRef = useRef([]);

    const reset = useCallback(() => {
        clearInterval(intervalRef.current);
        iRef.current = 0;
        jRef.current = 1;
        minIdxRef.current = 0;
        historyRef.current = [];
        setSampleData(initialData.map(item => ({ ...item, state: 'idle' })));
        setIsSorting(false);
    }, []);

    const stepForward = useCallback(() => {
        const n = initialData.length;
        const i = iRef.current;
        const j = jRef.current;
        const minIdx = minIdxRef.current;

        // All passes complete — mark everything success and stop
        if (i >= n - 1) {
            clearInterval(intervalRef.current);
            setIsSorting(false);
            setSampleData(prev => prev.map(d => ({ ...d, state: 'success' })));
            return;
        }

        setSampleData(prevData => {
            // Snapshot for step-back
            historyRef.current.push({
                data: prevData.map(d => ({ ...d })),
                i, j, minIdx,
            });

            // Highlight: i (pivot), minIdx (best so far), j (being compared)
            const data = prevData.map((d, idx) => {
                if (d.state === 'success') return d;
                if (idx === i || idx === minIdx || idx === j) return { ...d, state: 'active' };
                return { ...d, state: 'idle' };
            });

            // Update minimum if current scan target is smaller
            const newMinIdx = data[j].value < data[minIdx].value ? j : minIdx;

            if (j >= n - 1) {
                // Scan complete — swap minimum into position i
                if (newMinIdx !== i) {
                    const temp = { ...data[i] };
                    data[i] = { ...data[newMinIdx] };
                    data[newMinIdx] = temp;
                }
                data[i].state = 'success';

                const nextI = i + 1;
                iRef.current = nextI;
                jRef.current = nextI + 1;
                minIdxRef.current = nextI;
            } else {
                minIdxRef.current = newMinIdx;
                jRef.current = j + 1;
            }

            return data;
        });
    }, []);

    const stepBackward = useCallback(() => {
        const history = historyRef.current;
        if (history.length === 0) return;

        const prev = history.pop();
        iRef.current = prev.i;
        jRef.current = prev.j;
        minIdxRef.current = prev.minIdx;
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
                    {isSorting
                        ? <><Pause className="mr-1" /> Pause</>
                        : <><Play className="mr-1" /> Start</>}
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