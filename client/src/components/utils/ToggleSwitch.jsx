import React from 'react'
import '../../styles/ToggleSwitch.css'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css'
function ToggleSwitch (props) {
  const onToggle = () => {
    props.setIsToggled(!props.isToggled)
  }
  return (
    <>
      <Tooltip
        placement={'top'}
        trigger={'hover'}
        overlay={<span>Show text analytics</span>}
      >
        <label className='toggle-switch'>
          <input
            disabled={props.isdisabled}
            type='checkbox'
            checked={props.isToggled}
            onChange={onToggle}
          />
          <span className='switch' />
        </label>
      </Tooltip>
    </>
  )
}
export default ToggleSwitch
