import {
  type FERTILIZER_ELEMENT_NAMES,
  MACRO_ELEMENT_NAMES,
  MICRO_ELEMENT_NAMES,
} from "@fertilizer/calculator/constants";
import { HPGFormat } from "@fertilizer/calculator/format/hpg";
import { getNPKDetailInfo } from "@fertilizer/calculator/helpers";
import {
  calculateEC,
  convertProfileWithEC,
  fixIonicBalanceByCa,
  fixIonicBalanceByS,
} from "@fertilizer/calculator/profile";
import {
  ALLOWED_ELEMENT_IN_MATRIX,
  convertProfileWithRatio,
  getMultiElementRatio,
  getProfileRatioMatrix,
  OPTIMAL_RATIO,
} from "@fertilizer/calculator/ratio";
import type { Elements, NeedElements } from "@fertilizer/calculator/types";
import {
  Button,
  type ModalActions,
  NumberInput,
  type NumberInputChangeEvent,
} from "@fertilizer/ui";
import React, { useEffect, useState } from "react";
import { StyledBalanceCell } from "@/components/Calculator/Options/Recipe";
import { decimal, StyledInput } from "@/components/ui/Form";
import { useStore } from "@/store";
import { entries, round } from "@/utils";

interface RecipeTuneFormProps {
  modal: ModalActions;
  onSave: (npk: NeedElements) => void;
}

const ELEMENT_IN_MATRIX = ALLOWED_ELEMENT_IN_MATRIX.filter((el) => !["NH4", "NO3"].includes(el));

const IMPORTANT_CELLS = ["K:N", "K:Ca", "K:Mg", "NH4:NO3", "P", "Cl", "EC", "B"];
const BLOCKING_CELLS = ["N:Ca", "Ca:N", "Ca:K", "Ca:Mg", "Mg:K", "Mg:Ca"];

export function RecipeTuneForm(props: RecipeTuneFormProps) {
  // Значения рецепта из глобального стора (расчётный form), фолбэк на пустой профиль
  const form = useStore((s) => s.calculator.calculationForm);
  const [recipe, setRecipe] = useState<NeedElements>(form?.recipe ?? {});
  const recipeInfo = getNPKDetailInfo(recipe as Elements);
  const [ratio, setRatio] = useState(recipeInfo.ratio);
  const [EC, setEC] = useState(recipeInfo.EC);

  const [profileString, setProfileString] = useState(
    HPGFormat.stringifyProfile(form?.recipe ?? {}),
  );

  const onChangeRecipe = (el: FERTILIZER_ELEMENT_NAMES, value: number) => {
    const newRecipe = { ...recipe, [el]: value };
    if (el === "S") {
      newRecipe.Ca = fixIonicBalanceByCa(newRecipe);
    } else {
      newRecipe.S = fixIonicBalanceByS(newRecipe);
    }
    setRecipe(newRecipe);
    setEC(calculateEC(newRecipe));
    setRatio(getProfileRatioMatrix(newRecipe));
  };

  const onChangeEC = (val: number) => {
    const newRecipe = convertProfileWithEC(recipe as Elements, val);
    setRecipe(newRecipe);
    setEC(calculateEC(newRecipe));
    setRatio(getProfileRatioMatrix(newRecipe));
  };
  const onChangeRatio = (
    El1: ALLOWED_ELEMENT_IN_MATRIX,
    El2: ALLOWED_ELEMENT_IN_MATRIX,
    val: number,
  ) => {
    if (val) {
      let newNpk = convertProfileWithRatio(recipe, { [El1]: { [El2]: val } });
      newNpk = convertProfileWithEC(newNpk, EC);
      setRecipe(newNpk);
      setEC(calculateEC(newNpk));
      setRatio(getProfileRatioMatrix(newNpk));
    } else {
      setRatio({ ...ratio, [El1]: { ...ratio[El1], [El2]: val } });
    }
  };

  const onSaveHandler = () => {
    props.onSave(recipe);
    props.modal.close();
  };

  function onChangeProfileString(s: string) {
    let npk = HPGFormat.parseProfileString(s);
    if (entries(npk).length) {
      npk = HPGFormat.fillNPKElements(npk);
      setProfileString(s);
      setRecipe(npk);
      setEC(calculateEC(npk));
      setRatio(getProfileRatioMatrix(npk));
    } else {
      // Reset
      setProfileString(HPGFormat.stringifyProfile(recipe));
    }
  }

  useEffect(() => {
    setProfileString(HPGFormat.stringifyProfile(recipe));
  }, [recipe]);

  return (
    <div className="flex flex-col">
      <div>
        {MACRO_ELEMENT_NAMES.map((el) => (
          <RecipeInput
            key={el}
            name={el}
            label={el}
            value={recipe[el]}
            onChange={(val) => onChangeRecipe(el, val)}
            step={0.1}
          />
        ))}
        <RecipeInput name={"EC"} label={"EC"} value={EC} onChange={onChangeEC} />
      </div>
      <div className="flex justify-around">
        <StyledBalanceCell
          name="ΔΣ I"
          value={recipeInfo.ion_balance}
          title={"Ионный баланс, должен быть около нуля"}
        />
        <StyledBalanceCell name="EC" value={recipeInfo.EC} title={"мСм/см"} />
        <RecipeInput
          name={"NH4:NO3"}
          label={"%NH4"}
          value={round(ratio.NH4.NO3 * 100, 1)}
          step={0.1}
          onChange={(v) => onChangeRatio("NH4", "NO3", v / 100)}
        />
        <StyledBalanceCell name="K:N" value={recipeInfo.ratio.K.N} />
        <StyledBalanceCell name="K:Ca" value={recipeInfo.ratio.K.Ca} />
        <StyledBalanceCell name="K:Mg" value={recipeInfo.ratio.K.Mg} />
        <StyledBalanceCell
          name="K:Ca:Mg"
          value={getMultiElementRatio(recipe, ["K", "Ca", "Mg"]).display}
        />
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th></th>
              {ELEMENT_IN_MATRIX.map((el) => (
                <th key={el}>{el}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ELEMENT_IN_MATRIX.map((el) => (
              <tr key={el}>
                <th>{el}</th>
                {ELEMENT_IN_MATRIX.map((el2) => (
                  <td key={el2} style={{ textAlign: "center" }}>
                    {el === el2 ? (
                      1
                    ) : (
                      <RecipeInput
                        name={`${el}:${el2}`}
                        value={round(ratio?.[el]?.[el2] || 0, 2)}
                        onChange={(value) => onChangeRatio(el, el2, value)}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-around">
        {MICRO_ELEMENT_NAMES.map((el) => (
          <RecipeInput
            key={el}
            name={el}
            label={el}
            value={(recipe[el] || 0) * 1000}
            onChange={(val) => onChangeRecipe(el, val / 1000)}
            step={1}
          />
        ))}
      </div>
      <div className="my-2">
        <StyledInput
          value={profileString}
          onChange={(e) => setProfileString(e.target.value)}
          onBlur={(e) => onChangeProfileString(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <Button type="button" onClick={props.modal.close}>
          Cancel
        </Button>
        <Button type="button" onClick={onSaveHandler}>
          Save
        </Button>
      </div>
    </div>
  );
}

interface RecipeInputProps {
  name: string;
  label?: string;
  onChange?: (value: number) => void;
  value?: number;
  step?: number;
}

export function getOptimalRatioDisplay(name: string): string | null {
  const [el1, el2] = name.split(":");
  let ratio = OPTIMAL_RATIO[name] || OPTIMAL_RATIO[`${el2}:${el1}`];
  if (ratio) {
    if (!OPTIMAL_RATIO[name]) {
      ratio = ratio.map((n) => round(1 / n, 1)).reverse();
    }
    return `Оптимальный диапазон: ${ratio.join(" — ")}`;
  }
  return null;
}

function RecipeInput(props: RecipeInputProps) {
  const { name, label, onChange, value = 0, step = 0.01 } = props;

  const onChangeHandler = (e: NumberInputChangeEvent) => {
    if (e.target.value) {
      const val = decimal(String(e.target.value)) as number;
      onChange && onChange(val);
    }
  };

  const isImportant = IMPORTANT_CELLS.includes(name);
  const isBlocking = BLOCKING_CELLS.includes(name);
  let title: string | undefined;
  if (isImportant) {
    title = "Основные соотношения.";
  }
  if (isBlocking) {
    title = "Блокирующие соотношения.";
  }
  const ratio = getOptimalRatioDisplay(name);
  if (ratio) {
    title = `${title || ""} ${ratio}`;
  }

  return (
    <div className="flex max-w-24 flex-col items-center justify-center">
      {label ? <div style={{ textAlign: "center" }}>{label}</div> : null}
      <NumberInput
        onChange={onChangeHandler}
        name={name}
        value={value}
        title={title}
        type="number"
        step={step.toString()}
        min="0"
        max="9999"
        autoComplete="off"
        maxWidth="6rem"
        lang="en-US"
        style={{
          textAlign: "center",
          backgroundColor: isImportant ? "#b3f7b8" : undefined,
          color: isBlocking ? "red" : undefined,
          borderColor: "black",
        }}
      />
    </div>
  );
}
