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

export function getTitle() {
  const env = getEnv()

  const mainTitle = 'Gales Sales'
  let title = ''
  switch (env) {
    case 'development':
      title = `${mainTitle} \u00b7 Dev`
      break
    case 'stage':
      title = `${mainTitle} \u00b7 Staging`
      break
    case 'production':
      title = `${mainTitle} \u00b7 Live`
      break
    default:
      title = mainTitle
  }
  return title
}
