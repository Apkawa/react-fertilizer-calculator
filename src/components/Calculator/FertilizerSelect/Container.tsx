import React from "react";
import {SelectedList} from "./SelectedList";
import {FieldArray} from "redux-form";
import {FertilizerType} from "./types";
import {required} from "../../ui/ReduxForm/validators";




export const Container = () => {
  return (
    <FieldArray<{}>
      name={"fertilizers"}
      component={SelectedList}
      validate={required("Выберите удобрения")}
    />
  )
}

