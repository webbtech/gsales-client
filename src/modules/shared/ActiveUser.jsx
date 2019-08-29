import React, { Component } from 'react'

import { userAuthVals } from '../../utils'

export default class ActiveUser extends Component {

  render() {
    const user = userAuthVals.getVals()
    return (
      <div style={{float: 'left', margin: '14px 1em 0 0', color: '#fff'}}>{user && user.fullName}</div>
    )
  }
}
