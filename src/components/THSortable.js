export default function THSortable({ title, changeSortByTo, active, sortAsc, changeSortBy }) {
  return (
    <th 
        className={active ? 'clickable active' : 'clickable'}  
        onClick={() => changeSortBy(changeSortByTo)}
    >
        {title}
        {active && <p className='text-muted sort-indicator'>
            {sortAsc ? '(asc)' : '(desc)'}
        </p>}
    </th>
  )
}
