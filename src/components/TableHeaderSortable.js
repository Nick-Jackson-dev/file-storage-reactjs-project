import React from "react"
import THSortable from "./THSortable"

//requires array of objects with sortable (boolean), title (string), and changeSortByTo (string), if the column needs hidden, can include a hide boolean
//changeSortBy will be a function that will change the sortBy prop on the parent component to control table body data order
//the classes used are bootstrap classes

export default function TableHeaderSortable({ thArray, sortBy, sortAsc, changeSortBy }) {
  return (
    <thead className="text-center text-wrap">
        <tr>
            {thArray.length && thArray.map(hCell => (
                <React.Fragment key={hCell.title} >
                    {(!hCell.sortable && !hCell.hide) && (
                        <th>{hCell.title}</th>
                    )}

                    {(hCell.sortable && !hCell.hide) && (
                        <THSortable 
                            title={hCell.title}
                            changeSortByTo={hCell.changeSortByTo}
                            active={sortBy===hCell.changeSortByTo}
                            sortAsc={sortAsc}
                            changeSortBy={changeSortBy}
                        />
                    )}
                </React.Fragment>
            ))}
        </tr>
    </thead>
  )
}
