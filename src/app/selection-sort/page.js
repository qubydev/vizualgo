import React from 'react'
import { Heading } from '@/components/custom-ui/heading'
import SelectionSortDemo from '@/components/algorithms/selection-sort-demo';
import { Mark } from '@/components/custom-ui/mark';

export default function Page() {

    return (
        <div className='flex flex-col gap-4'>
            <Heading>Selection Sort</Heading>

            <p>
                Selection Sort is a simple sorting algorithm that divides the array into a sorted and unsorted region. On each pass, it scans the unsorted region to find the <Mark>minimum element</Mark> and swaps it into its correct position, growing the sorted region one element at a time.
            </p>

            <SelectionSortDemo />
        </div>
    )
}