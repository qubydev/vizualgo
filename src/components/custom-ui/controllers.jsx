"use client";
import React from 'react';
import { Button } from '../ui/button';
import { SkipForward, SkipBack, Pause, Play } from 'lucide-react';
export default function Controllers({ isSorting, speed, onStart, onPause, onStepForward, onStepBackward, onReset, onSpeedToggle }) {
    return (
        <div className="flex items-center gap-2 mt-6">
            <Button onClick={isSorting ? onPause : onStart}>
                {isSorting ? <><Pause className="mr-1" /> Pause</> : <><Play className="mr-1" /> Start</>}
            </Button>
            <Button variant="outline" size="icon" onClick={onStepBackward}>
                <SkipBack />
            </Button>
            <Button variant="outline" size="icon" onClick={onStepForward}>
                <SkipForward />
            </Button>
            <Button variant="destructive" onClick={onReset}>
                Reset
            </Button>
            <Button variant='outline' size="icon" onClick={onSpeedToggle}>
                x{speed}
            </Button>
        </div>
    );
}