import React, { useRef, useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const stateColors = {
    idle: 'bg-primary/70',
    active: 'bg-amber-400',
    success: 'bg-green-500',
    error: 'bg-destructive'
};

const makeSegmentGradient = (colors) => {
    if (colors.length === 1) return colors[0];
    const stops = colors.map((c, i) => {
        const start = (i / colors.length) * 100;
        const end = ((i + 1) / colors.length) * 100;
        return `${c} ${start}%, ${c} ${end}%`;
    });
    return `linear-gradient(90deg, ${stops.join(', ')})`;
};

function SegmentedTriangle({ colors, size = 10 }) {
    const id = colors.join('-').replace(/#/g, '');
    const gradientId = `ptr-grad-${id}`;
    const w = size * 2;
    const h = size;
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
            <defs>
                <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
                    {colors.map((c, i) => (
                        <React.Fragment key={i}>
                            <stop offset={`${(i / colors.length) * 100}%`} stopColor={c} />
                            <stop offset={`${((i + 1) / colors.length) * 100}%`} stopColor={c} />
                        </React.Fragment>
                    ))}
                </linearGradient>
            </defs>
            <polygon points={`0,${h} ${w},${h} ${w / 2},0`} fill={`url(#${gradientId})`} />
        </svg>
    );
}

export function BarPlot({ data, pointers = [] }) {
    const containerRef = useRef(null);
    const [colPositions, setColPositions] = useState([]);
    const colRefs = useRef([]);

    const isDataInvalid = !data || !Array.isArray(data) || data.length === 0;
    const hasInvalidItems = !isDataInvalid && data.some(
        (item) => !item || typeof item.value !== 'number' || Number.isNaN(item.value)
    );

    useEffect(() => {
        if (!containerRef.current || isDataInvalid) return;
        const measure = () => {
            const containerLeft = containerRef.current.getBoundingClientRect().left;
            const positions = colRefs.current.map(el => {
                if (!el) return 0;
                const rect = el.getBoundingClientRect();
                return rect.left - containerLeft + rect.width / 2;
            });
            setColPositions(positions);
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, [data?.length, isDataInvalid]);

    if (isDataInvalid || hasInvalidItems) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center p-4 text-destructive">
                <AlertCircle className="w-10 h-10 mb-3" />
                <span className="text-sm font-semibold text-center">
                    Invalid data provided. Please ensure the data is a valid array of objects with numeric values.
                </span>
            </div>
        );
    }

    const maxVal = Math.max(...data.map(i => i.value), 0);
    const minVal = Math.min(...data.map(i => i.value), 0);
    const range = maxVal - minVal || 1;
    const zeroLinePct = (Math.abs(minVal) / range) * 100;

    const groupedByIndex = pointers.reduce((acc, p) => {
        if (!acc[p.index]) acc[p.index] = [];
        acc[p.index].push(p);
        return acc;
    }, {});

    return (
        <div className="w-full flex flex-col">
            <div ref={containerRef} className="relative flex items-end gap-[2px] h-64 w-full">
                <div
                    className="absolute left-0 right-0 h-0.5 bg-foreground z-0 translate-y-1/2"
                    style={{ bottom: `${zeroLinePct}%` }}
                />

                {data.map((item, index) => {
                    const isPositive = item.value >= 0;
                    const barColor = stateColors[item.state] || stateColors.idle;

                    return (
                        <motion.div
                            key={item.id}
                            ref={el => colRefs.current[index] = el}
                            layout
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="flex-1 relative z-10 flex flex-col h-full w-full"
                        >
                            <Bar
                                value={item.value}
                                range={range}
                                zeroLinePct={zeroLinePct}
                                color={barColor}
                            />
                            <div
                                className="absolute w-full flex justify-center z-20 pointer-events-none"
                                style={
                                    isPositive
                                        ? { top: `${100 - zeroLinePct}%`, paddingTop: '8px' }
                                        : { bottom: `${zeroLinePct}%`, paddingBottom: '8px' }
                                }
                            >
                                <span className="text-sm text-muted-foreground">{index}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="relative w-full h-10 mt-1">
                <AnimatePresence>
                    {Object.entries(groupedByIndex).map(([idxStr, group]) => {
                        const index = Number(idxStr);
                        const x = colPositions[index];
                        if (x === undefined) return null;
                        const layoutKey = group.map(p => p.label ?? '').join('-');

                        return (
                            <motion.div
                                key={layoutKey}
                                layoutId={group[0].label ?? idxStr}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                className="absolute top-0 flex flex-col items-center pointer-events-none"
                                style={{ left: x, transform: 'translateX(-50%)' }}
                            >
                                <SegmentedTriangle
                                    colors={group.map(p => p.color ?? '#888')}
                                    size={10}
                                />
                                <div className="flex gap-1 mt-1">
                                    {group.map((p, pi) => (
                                        <span
                                            key={pi}
                                            className="text-sm font-bold leading-none whitespace-nowrap"
                                            style={{ color: p.color ?? 'currentColor' }}
                                        >
                                            {p.label}{pi < group.length - 1 ? ',' : ''}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}

function Bar({ value, range, zeroLinePct, color }) {
    const isPositive = value >= 0;
    const heightPct = (Math.abs(value) / range) * 100;

    return (
        <div
            className={`absolute w-full ${color} transition-colors duration-300`}
            style={{
                height: `${heightPct}%`,
                ...(isPositive
                    ? { bottom: `${zeroLinePct}%` }
                    : { top: `${100 - zeroLinePct}%` }),
            }}
        >
            <span
                className={`absolute w-full text-foreground text-sm font-medium text-center ${isPositive ? 'bottom-0 pb-1' : 'top-0 pt-1'}`}
            >
                {value}
            </span>
        </div>
    );
}