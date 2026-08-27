import { actionTypes, change, type FormAction, getFormValues } from "redux-form";
import { all, call, fork, put, select, takeLatest } from "redux-saga/effects";
import { normalizeFertilizer } from "@/calculator/fertilizer";
import type { AddEditFormType } from "@/components/Calculator/FertilizerManager/types";
import { equal } from "@/utils";
import { FERTILIZER_EDIT_FORM_NAME } from "./constants";

function* updateFertilizerForm() {
  const formValues: AddEditFormType = yield select(getFormValues(FERTILIZER_EDIT_FORM_NAME));
  if (formValues.composition_enable) {
    const npk = normalizeFertilizer(
      { id: "", composition: formValues.composition },
      false,
    ).elements;
    if (!equal(formValues.npk, npk)) {
      yield put(change(FERTILIZER_EDIT_FORM_NAME, "npk", npk));
    }
    if (!formValues.composition?.length) {
      yield put(change(FERTILIZER_EDIT_FORM_NAME, "composition", [{ formula: "" }]));
    }
  }
}

function* fertilizerEditFormChangeWatcher() {
  yield takeLatest(
    [actionTypes.CHANGE, actionTypes.BLUR, actionTypes.ARRAY_PUSH, actionTypes.ARRAY_REMOVE],
    function* (action: FormAction) {
      if (action.meta.form === FERTILIZER_EDIT_FORM_NAME) {
        yield call(updateFertilizerForm);
      }
    },
  );
}

export default function* fertilizerManagerRootSaga() {
  yield all([fork(fertilizerEditFormChangeWatcher)]);
}
