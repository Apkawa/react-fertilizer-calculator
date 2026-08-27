import React from "react";
import { FieldArray } from "redux-form";
import { required } from "../../ui/ReduxForm/validators";
import { SelectedList } from "./SelectedList";

export const Container = () => {
  return (
    <FieldArray<{}>
      name={"fertilizers"}
      component={SelectedList}
      validate={required("Выберите удобрения")}
    />
  );
};
