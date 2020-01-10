import { useEffect, useReducer, useState } from 'react'
import axios from 'axios'

import { DWNLD_XLS_SERVICE_URL } from '../constants'

// https://www.robinwieruch.de/react-hooks-fetch-data
// https://github.com/the-road-to-learn-react/react-hooks-introduction/blob/master/src/useDataApiHook-example/index.js

// searched for: error from cloudfront x-amzn-errortype: MissingAuthenticationTokenException
// cors issue: https://stackoverflow.com/questions/41100859/aws-api-gateway-returns-a-403-with-x-amzn-errortypeaccessdeniedexception-header

/* fake server request, getting the file url as response
setTimeout(() => {
  const response = {
    // file: 'http://releases.ubuntu.com/12.04.5/ubuntu-12.04.5-alternate-amd64.iso',
    file: url,
  }
  setLoading(false)
  // server sent the url to the file!
  // now, let's download:
  // window.location.href = response.file
  // you could also do:
  // window.open(response.file);
}, 2000) */

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, isError: false }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        payload: action.payload,
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    default:
      throw new Error()
  }
}

const useDataApi = () => {
  const [postData, setPostData] = useState(null)

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    payload: null,
  })

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' })

      try {
        const result = await axios.post(DWNLD_XLS_SERVICE_URL, postData)

        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
        }
      } catch (error) {
        console.error('error:', error) // eslint-disable-line no-console
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' })
        }
      }
    }

    if (postData) {
      fetchData()
    }

    return () => {
      didCancel = true
    }
  }, [postData])

  return [state, setPostData]
}

export default useDataApi
