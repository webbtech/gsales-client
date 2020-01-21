import { useEffect, useReducer, useState } from 'react'
import axios from 'axios'

import { DWNLD_PDF_SERVICE_URL } from '../sales/constants'

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
        const token = localStorage.getItem('userToken')
        const result = await axios({
          method: 'POST',
          url: DWNLD_PDF_SERVICE_URL,
          headers: { authorization: token },
          data: postData,
        })

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
