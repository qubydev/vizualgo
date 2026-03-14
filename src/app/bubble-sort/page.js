import React from 'react'
import { Heading } from '@/components/custom-ui/heading'
import BubbleSortDemo from '@/components/algorithms/bubble-sort-demo';
import SelectionSortDemo from '@/components/algorithms/selection-sort-demo';
import { Mark } from '@/components/custom-ui/mark';

export default function Page() {

    return (
        <div className='flex flex-col gap-4'>
            <Heading>Bubble Sort</Heading>

            <p>
                Bubble Sort is a simple sorting algorithm that repeatedly steps through the array, compares adjacent elements, and swaps them if they are in the wrong order. This process continues until the array is sorted. Larger elements <Mark>“bubble-up”</Mark> to the end of the array with each pass.
            </p>

            <BubbleSortDemo />

            <Heading level={2} className="mt-4">Working</Heading>
        </div>
    )
}
