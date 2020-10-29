import {useContext} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {change, FormContext, getFormValues, ReduxFormContext} from "redux-form";

export function useReduxForm(): FormContext {
  return useContext(ReduxFormContext)
}

export function useFormName(): string {
  return useReduxForm().form
}

export function useFormValues<FormValues=object>(formName: string): [FormValues, (name: string, value: any) => void] {
  const dispatch = useDispatch()
  const values = useSelector(state => getFormValues(formName)(state)) as FormValues

  const setValue = (name: string, value: any) => {
    dispatch(change(formName, name, value))
  }
  return [
    values,
    setValue
    ]
}
