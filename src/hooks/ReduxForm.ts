import {useContext} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {change, getFormValues, ReduxFormContext} from "redux-form";

export function useReduxForm(): {form: string} {
  return useContext(ReduxFormContext)
}


export function useFormValues<FormValues=object>(): [FormValues, (name: string, value: any) => void] {
  const { form } = useReduxForm()
  const dispatch = useDispatch()
  const values = useSelector(state => getFormValues(form)(state)) as FormValues

  const setValue = (name: string, value: any) => {
    dispatch(change(form, name, value))
  }
  return [
    values,
    setValue
    ]
}
