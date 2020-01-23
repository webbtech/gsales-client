import React from 'react'

export function getEnv() {
  if (window.location.hostname.indexOf('stage') > -1) {
    return 'stage'
  }
  return process.env.NODE_ENV
}

export function NlToBr(string) {
  return string.split(/(?:\r\n|\r|\n)/g).map((item, key) => (
    // eslint-disable-next-line react/no-array-index-key
    <span key={key}>
      {item}
      <br />
    </span>
  ))
}
