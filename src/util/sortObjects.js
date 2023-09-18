//sorts an array of objects based on properties. no matter now deep as long as it is passed using dot-notation.
//expects firebase data, so date is not handled, but timestamp is.
import { Timestamp } from 'firebase/firestore'

export default function sortObjects (arrayList, propertyToSortBy, sortAsc) {
    let newList = []
    let sortBy = [propertyToSortBy]
    newList = arrayList.sort((a, b) => {
        let x = a[sortBy[0]]
        let y = b[sortBy[0]]
        if(propertyToSortBy.includes('.')) {
            sortBy = propertyToSortBy.split('.')
            sortBy.forEach((s, index) => {
                if(index === 0) {
                    x = a[s]
                    y = b[s]
                } else {
                    x = x[s]
                    y = y[s]
                }
            })
        }

        //determine a value to sortBy
        if(typeof x === 'string') x = x.trim().toLowerCase()
        if(typeof y === 'string') y = y.trim().toLowerCase()
        if(x instanceof Timestamp) x = x.toDate()
        if(y instanceof Timestamp) y = y.toDate()
        if(!x || x === 'no data') x = new Date(0)
        if(!y || y === 'no data') y = new Date(0)
        if(y === 'unset') y = ''
        if(x === 'unset') x = ''

        //sort
        if(sortAsc) {
            if (x > y) {return -1}
            if (x < y) {return 1}
        } else {
            if (x < y) {return -1}
            if (x > y) {return 1}
        }
        return 0
    })

    return newList
        
}