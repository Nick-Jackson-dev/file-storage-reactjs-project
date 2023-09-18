import expandedIcon from './assets/expanded-icon.svg'
import collapsedIcon from './assets/collapsed-icon.svg'

export default function CollapseIcon({ collapsed }) {


    return (
        <div className='collapse-icon icon'>
            {collapsed && <img src={collapsedIcon} alt='section is collapsed' />}
            {!collapsed && <img src={expandedIcon} alt='section is expanded' />}
        </div>
    )
}
