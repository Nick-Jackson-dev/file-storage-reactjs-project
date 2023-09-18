import { useMemo, useState } from 'react'
import sortObjects from '../../util/sortObjects'

const useSortData = (data, sortBy, sortAsc) => {
    const [sortedData, setSortedData] = useState([])
    useMemo(() => {
        let newList = []
        
        if(data) newList = sortObjects(data, sortBy, sortAsc)
        setSortedData(newList)
    }, [data, sortBy, sortAsc])

    return sortedData
}

export { useSortData }