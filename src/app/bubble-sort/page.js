"use client"

import React, { useState } from 'react'
import { Heading } from '@/components/custom-ui/page'
import BubbleSortDemo from '@/components/algorithms/bubble-sort-demo';

export default function Page() {

    return (
        <div className='flex flex-col gap-4'>
            <Heading>Bubble Sort</Heading>

            <p>
                Bubble Sort is a simple sorting algorithm that repeatedly steps through the array, compares adjacent elements, and swaps them if they are in the wrong order. This process continues until the array is sorted. Larger elements “bubble up” to the end of the array with each pass.
            </p>

            <BubbleSortDemo />
        </div>
    )
}
