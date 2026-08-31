import { useFormContext } from "./form-context";
import { getFormValueAt } from "./form-path";
import { useStore } from "./index";

// Поле формы: значение по dot-path из глобального стора + запись через контекст формы.
// Даёт ту же «гигаформу»: поле может быть где угодно внутри FormProvider и не требует прокидывания пропсов.
export function useFormField(name: string) {
  const { formName, setValue } = useFormContext();
  const value = useStore((s) => getFormValueAt(s, formName, name));
  return { value, setValue, formName };
}
