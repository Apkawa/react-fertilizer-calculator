/**
 * Unit-тесты zustand-стора: паритет с логикой reducer/saga (расчёт, guard, topping-up,
 * менеджер, импорт) + persistence (запись при изменении, чтение, миграция со старого ключа).
 * Стор проверяется напрямую (без DOM и без компонентов) — шов test-utils/state.ts ещё на redux.
 */
import { calculate_v4 } from "@fertilizer/calculator";
import { normalizeFertilizer } from "@fertilizer/calculator/fertilizer";
import type { ExportStateType } from "@fertilizer/calculator/format/types";
import {
  calculateToppingUp,
  getEmptyElements,
  getNPKDetailInfo,
} from "@fertilizer/calculator/helpers";
import type { FertilizerInfo } from "@fertilizer/calculator/types";
import { defaultFertilizers } from "@/components/Calculator/constants/fertilizers";
import { getInitialFormValues } from "@/components/Calculator/constants/form";
import { DEFAULT_RECIPES } from "@/components/Calculator/constants/recipes";
import type { FertilizerInfo as AppFertilizerInfo } from "@/components/Calculator/types";
import { createAppStore } from "./index";

let store: ReturnType<typeof createAppStore>;

beforeEach(() => {
  localStorage.clear();
  store = createAppStore();
});

describe("store: calculate", () => {
  test("guard: пустая выборка → ошибка, нет результата", () => {
    store.getState().setFieldValue("fertilizers", []);
    store.getState().calculate();
    const s = store.getState().calculator;
    expect(s.error).toBe(true);
    expect(s.process).toBe(false);
    expect(s.result).toBeNull();
    expect(store.getState().fertilizersError).toBeTruthy();
  });

  test("базовый расчёт → результат (calculate_v4)", () => {
    const selection = defaultFertilizers.slice(0, 2);
    store.getState().setFieldValue("fertilizers", selection);
    store.getState().calculate();
    const s = store.getState().calculator;
    const form = s.calculationForm;
    expect(form).not.toBeNull();
    expect(form?.fertilizers).toEqual(selection);
    const expected = calculate_v4(form!.recipe, form!.fertilizers, {
      ignore: { ...form!.ignore },
      accuracy: form!.accuracy,
      solution_volume: form!.solution_volume,
      solution_concentration: form!.solution_concentration,
    });
    expect(s.result).not.toBeNull();
    expect(s.result!.fertilizers).toEqual(expected.fertilizers);
    expect(s.result!.elements).toEqual(expected.elements);
    expect(s.result!.deltaElements).toEqual(expected.deltaElements);
  });

  test("topping-up: объём/концентрация доводятся до расчёта, пересчёт", () => {
    store.getState().setFieldValue("fertilizers", defaultFertilizers.slice(0, 2));
    store.getState().setFieldValue("topping_up_enabled", true);
    store.getState().setFieldValue("topping_up.currentSolution.volume", 5);
    store.getState().setFieldValue("topping_up.currentSolution.EC", 2);
    store.getState().setFieldValue("topping_up.currentSolution.profileEC", 2);
    store.getState().setFieldValue("topping_up.currentSolution.profileSaltsConcentration", 2);
    store.getState().setFieldValue("topping_up.newSolution.volume", 10);

    const form = store.getState().calculator.calculationForm;
    expect(form).not.toBeNull();
    const tu = form!.topping_up;
    expect(tu).not.toBeNull();
    const tRes = calculateToppingUp({
      currentSolution: tu!.currentSolution,
      newSolution: {
        ...tu!.newSolution,
        EC: getNPKDetailInfo({ ...getEmptyElements(), ...form!.recipe }).EC,
      },
    });

    store.getState().calculate();

    const s = store.getState().calculator;
    expect(s.calculationForm?.solution_volume).toBe(tRes.volume);
    expect(s.calculationForm?.solution_concentration).toBe(tRes.concentration);
    expect(s.toppingUpResult).toEqual(tRes);
    const expected = calculate_v4(form!.recipe, form!.fertilizers, {
      ignore: { ...form!.ignore },
      accuracy: form!.accuracy,
      solution_volume: tRes.volume,
      solution_concentration: tRes.concentration,
    });
    expect(s.result).not.toBeNull();
    expect(s.result!.fertilizers).toEqual(expected.fertilizers);
  });
});

describe("store: менеджер удобрений", () => {
  test("push/set/reset + синхронизация выборки по id", () => {
    const f: FertilizerInfo = { id: "Тестовое удобрение", npk: { NO3: 10 } };

    store.getState().pushFertilizer(f);
    expect(store.getState().calculator.fertilizers).toEqual([...defaultFertilizers, f]);

    // Синхронизация: если fertilizer уже в выборке (по id) — обновляем в выборке
    store.getState().setFieldValue("fertilizers", [f]);
    expect(store.getState().calculator.calculationForm?.fertilizers).toEqual([f]);
    const updated: FertilizerInfo = { ...f, npk: { NO3: 20 } };
    store.getState().pushFertilizer(updated);
    const len = store.getState().calculator.fertilizers.length;
    expect(store.getState().calculator.fertilizers[len - 1]).toEqual(updated);
    expect(store.getState().calculator.calculationForm?.fertilizers).toEqual([updated]);

    const reordered = [...defaultFertilizers].reverse();
    store.getState().setFertilizers(reordered);
    expect(store.getState().calculator.fertilizers).toEqual(reordered);
    store.getState().resetFertilizers();
    expect(store.getState().calculator.fertilizers).toEqual(defaultFertilizers);
  });
});

describe("store: toggleFertilizer (selection checkbox)", () => {
  // Реальные записи из LIBRARY — выборка хранит их копии (тот же id)
  const ammoniumNitrate = defaultFertilizers.find((f) => f.id === "Нитрат аммония (NH4NO3)")!;
  const potassiumNitrate = defaultFertilizers.find((f) => f.id === "Нитрат калия (KNO3)")!;

  test("checked=true with calculationForm null materializes the form and adds a copy", () => {
    expect(store.getState().calculator.calculationForm).toBeNull();

    store.getState().toggleFertilizer(ammoniumNitrate, true);

    const form = store.getState().calculator.calculationForm;
    expect(form).not.toBeNull();
    expect(form!.fertilizers).toEqual([ammoniumNitrate]);
    // Форма материализуется из дефолтов (как в setFieldValue)
    const init = getInitialFormValues();
    expect(form!.accuracy).toBe(init.accuracy);
    expect(form!.solution_volume).toBe(init.solution_volume);
    // LIBRARY не меняется при переключении выборки
    expect(store.getState().calculator.fertilizers).toEqual(defaultFertilizers);
  });

  test("checked=true on an already selected id updates instead of duplicating", () => {
    store.getState().setFieldValue("fertilizers", [ammoniumNitrate]);

    const updated: AppFertilizerInfo = { ...ammoniumNitrate, pump_number: 2 };
    store.getState().toggleFertilizer(updated, true);

    const selection = store.getState().calculator.calculationForm!.fertilizers;
    expect(selection).toHaveLength(1);
    expect(selection[0]).toEqual(updated);
  });

  test("checked=false removes the copy by id and leaves other selections untouched", () => {
    store.getState().setFieldValue("fertilizers", [ammoniumNitrate, potassiumNitrate]);

    store.getState().toggleFertilizer(ammoniumNitrate, false);

    expect(store.getState().calculator.calculationForm!.fertilizers).toEqual([potassiumNitrate]);
    expect(store.getState().calculator.fertilizers).toEqual(defaultFertilizers);
  });

  test("toggle does not recalculate: result, process and fertilizersError stay unchanged", () => {
    store.getState().setFieldValue("fertilizers", defaultFertilizers.slice(0, 2));
    store.getState().calculate();
    const before = store.getState().calculator;
    const beforeError = store.getState().fertilizersError;
    expect(before.result).not.toBeNull();

    store.getState().toggleFertilizer(defaultFertilizers[2], true);
    store.getState().toggleFertilizer(defaultFertilizers[0], false);

    const after = store.getState().calculator;
    expect(after.result).toEqual(before.result);
    expect(after.process).toBe(before.process);
    expect(store.getState().fertilizersError).toBe(beforeError);
  });
});

describe("store: fertilizer selection sync (remove/reorder/reset)", () => {
  // Копии записей LIBRARY с маркером pump_number — чтобы отличать объект-копию
  // выборки от объекта библиотеки (у дефолтов pump_number нет).
  const magnesiumSulfate = defaultFertilizers.find((f) => f.id === "Сульфат магния (MgSO4*7H2O)")!;
  const ammoniumNitrate = defaultFertilizers.find((f) => f.id === "Нитрат аммония (NH4NO3)")!;
  const potassiumNitrate = defaultFertilizers.find((f) => f.id === "Нитрат калия (KNO3)")!;

  const copyWithMarker = (f: AppFertilizerInfo, marker: number): AppFertilizerInfo => ({
    ...f,
    pump_number: marker,
  });

  test("removeFertilizer drops the selection copy with the same id and keeps other selections", () => {
    store
      .getState()
      .setFieldValue("fertilizers", [
        copyWithMarker(ammoniumNitrate, 10),
        copyWithMarker(potassiumNitrate, 20),
      ]);

    store.getState().removeFertilizer(ammoniumNitrate);

    const s = store.getState().calculator;
    // LIBRARY: запись удалена
    expect(s.fertilizers.map((f) => f.id)).not.toContain("Нитрат аммония (NH4NO3)");
    expect(s.fertilizers).toHaveLength(defaultFertilizers.length - 1);
    // Выборка: копия с тем же id удалена, остальные сохранены verbatim (маркер цел)
    expect(s.calculationForm!.fertilizers.map((f) => f.id)).toEqual(["Нитрат калия (KNO3)"]);
    expect(s.calculationForm!.fertilizers[0]).toEqual(copyWithMarker(potassiumNitrate, 20));
  });

  test("setFertilizers reorders selection to follow the new library order, preserving copies", () => {
    store.getState().setFertilizers([magnesiumSulfate, ammoniumNitrate, potassiumNitrate]);
    const copyA = copyWithMarker(ammoniumNitrate, 10);
    const copyC = copyWithMarker(potassiumNitrate, 30);
    // Выборка в старом порядке библиотеки: A затем C
    store.getState().setFieldValue("fertilizers", [copyA, copyC]);

    // Drag-reorder библиотеки: C,B,A
    store.getState().setFertilizers([potassiumNitrate, magnesiumSulfate, ammoniumNitrate]);

    const selection = store.getState().calculator.calculationForm!.fertilizers;
    // Порядок выборки follows порядок LIBRARY: C затем A (B не выбрана)
    expect(selection.map((f) => f.id)).toEqual(["Нитрат калия (KNO3)", "Нитрат аммония (NH4NO3)"]);
    // Копии сохранены verbatim (маркерные pump_number из выборки, не объекты библиотеки)
    expect(selection[0]).toEqual(copyC);
    expect(selection[1]).toEqual(copyA);
    expect(store.getState().calculator.fertilizers).toEqual([
      potassiumNitrate,
      magnesiumSulfate,
      ammoniumNitrate,
    ]);
  });

  test("setFertilizers drops selection copies whose id is no longer in the library", () => {
    store.getState().setFertilizers([magnesiumSulfate, ammoniumNitrate, potassiumNitrate]);
    const copyA = copyWithMarker(ammoniumNitrate, 10);
    const copyB = copyWithMarker(potassiumNitrate, 20);
    store.getState().setFieldValue("fertilizers", [copyA, copyB]);

    store.getState().setFertilizers([potassiumNitrate]);

    const selection = store.getState().calculator.calculationForm!.fertilizers;
    expect(selection).toEqual([copyB]);
  });

  test("resetFertilizers filters selection to the default library ids and follows library order", () => {
    const custom: AppFertilizerInfo = { id: "custom", npk: { NO3: 5 } };
    store.getState().pushFertilizer(custom);
    store
      .getState()
      .setFieldValue("fertilizers", [
        copyWithMarker(custom, 90),
        copyWithMarker(potassiumNitrate, 20),
        copyWithMarker(ammoniumNitrate, 10),
      ]);

    store.getState().resetFertilizers();

    const s = store.getState().calculator;
    expect(s.fertilizers).toEqual(defaultFertilizers);
    const selection = s.calculationForm!.fertilizers;
    // Кастомный id вне дефолтов исчезает из выборки; дефолтные копии — в порядке LIBRARY
    expect(selection.map((f) => f.id)).toEqual(["Нитрат аммония (NH4NO3)", "Нитрат калия (KNO3)"]);
    expect(selection[0]).toEqual(copyWithMarker(ammoniumNitrate, 10));
    expect(selection[1]).toEqual(copyWithMarker(potassiumNitrate, 20));
  });
});

describe("store: импорт состояния", () => {
  test("импорт → расчёт с импортированными данными", () => {
    const form = {
      accuracy: 0.2,
      solution_volume: 1,
      solution_concentration: { k: 100, v_1: 10, v_2: 1000 },
      recipe: { ...DEFAULT_RECIPES[0].elements },
      fertilizers: defaultFertilizers.slice(0, 2),
      dilution_concentration: { k: 1, v_1: 1, v_2: 1000 },
      mixerOptions: {},
    };
    const payload: ExportStateType = {
      meta: { version: "1", ref: "test", created: "2024-01-01T00:00:00.000Z" },
      calculator: {
        calculationForm: form,
        result: null,
        fertilizers: defaultFertilizers,
        recipes: DEFAULT_RECIPES,
      },
    };

    store.getState().importState(payload);
    expect(store.getState().calculator.fertilizers).toEqual(defaultFertilizers);
    expect(store.getState().calculator.calculationForm?.fertilizers).toEqual(form.fertilizers);

    store.getState().calculate();
    const expected = calculate_v4(form.recipe, form.fertilizers, {
      ignore: {},
      accuracy: form.accuracy,
      solution_volume: form.solution_volume,
      solution_concentration: form.solution_concentration,
    });
    expect(store.getState().calculator.result).not.toBeNull();
    expect(store.getState().calculator.result!.fertilizers).toEqual(expected.fertilizers);
  });
});

describe("store: setFieldValue (dot-path)", () => {
  test("инициализация из дефолтов + вложенная запись", () => {
    // До первого setFieldValue calculationForm = null
    expect(store.getState().calculator.calculationForm).toBeNull();
    store.getState().setFieldValue("topping_up.currentSolution.volume", 5);
    const form = store.getState().calculator.calculationForm;
    expect(form).not.toBeNull();
    expect(form!.topping_up?.currentSolution?.volume).toBe(5);
    // Инициализирована из дефолтов
    const init = getInitialFormValues();
    expect(form!.accuracy).toBe(init.accuracy);
    expect(form!.solution_volume).toBe(init.solution_volume);
  });
});

describe("store: форма редактора удобрения", () => {
  test("composition → npk пересчитывается", () => {
    const composition = [{ formula: "NH4NO3", percent: 100 }];
    store.getState().setFertilizerEditField("composition", composition);
    store.getState().setFertilizerEditField("composition_enable", true);
    const form = store.getState().fertilizerEdit;
    const expected = normalizeFertilizer({ id: "", composition }, false).elements;
    expect(form.npk).toEqual(expected);
  });
});

describe("store: persistence", () => {
  test("запись при изменении + чтение свежим экземпляром", () => {
    store.getState().setFieldValue("fertilizers", defaultFertilizers.slice(0, 2));
    store.getState().calculate();
    const raw = localStorage.getItem("appState");
    expect(raw).toBeTruthy();
    const persisted = JSON.parse(raw!);
    expect(persisted.calculator.fertilizers).toEqual(store.getState().calculator.fertilizers);

    const fresh = createAppStore();
    expect(fresh.getState().calculator.calculationForm?.fertilizers).toEqual(
      store.getState().calculator.calculationForm?.fertilizers,
    );
    expect(fresh.getState().calculator.result).not.toBeNull();
  });

  test("миграция со старого ключа reduxState (бэкинг + сброс runtime)", () => {
    const old = {
      calculator: {
        calculationForm: null,
        result: null,
        toppingUpResult: null,
        process: true, // runtime — должен сброситься
        error: true, // runtime — должен сброситься
        fertilizers: [{ id: "custom" }] as FertilizerInfo[],
        recipes: DEFAULT_RECIPES,
      },
      form: {},
    };
    localStorage.setItem("reduxState", JSON.stringify(old));

    const migrated = createAppStore();
    const s = migrated.getState().calculator;
    expect(s.fertilizers).toEqual([{ id: "custom" }]);
    expect(s.process).toBe(false);
    expect(s.error).toBe(false);
    // Старый ключ удален, новый создан
    expect(localStorage.getItem("reduxState")).toBeNull();
    expect(localStorage.getItem("appState")).toBeTruthy();
  });

  test("дефолты при отсутствии персистентности", () => {
    const s = store.getState().calculator;
    expect(s.calculationForm).toBeNull();
    expect(s.fertilizers).toEqual(defaultFertilizers);
    expect(s.recipes).toEqual(DEFAULT_RECIPES);
  });
});
