import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const stateColors = {
    idle: 'bg-primary/70',
    active: 'bg-amber-400',
    success: 'bg-green-500',
    error: 'bg-destructive'
};

export function BarPlot({ data }) {
    const isDataInvalid = !data || !Array.isArray(data) || data.length === 0;

    const hasInvalidItems = !isDataInvalid && data.some(
        (item) => !item || typeof item.value !== 'number' || Number.isNaN(item.value)
    );

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

    return (
        <div className="w-full flex flex-col py-8">
            <div className="relative flex items-end gap-[2px] h-64 w-full">

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
                            layout
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                className={`absolute w-full text-foreground text-sm font-medium text-center ${isPositive ? 'bottom-0 pb-1' : 'top-0 pt-1'
                    }`}
            >
                {value}
            </span>
        </div>
    );
}