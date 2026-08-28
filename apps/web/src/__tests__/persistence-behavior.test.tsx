/**
 * Поведенный тест персистентности: состояние пишется в хранилище
 * и восстанавливается «свежим» экземпляром приложения (аналог перезагрузки страницы).
 * Зависит только от тестового шва (test-utils/state.ts).
 */
import React from "react";
import Calculator from "@/components/Calculator";
import { defaultFertilizers } from "@/components/Calculator/constants/fertilizers";
import { renderApp } from "@/test-utils/render";
import {
  calculateNow,
  getFreshSnapshot,
  getState,
  readPersistence,
  resetStore,
  setFormField,
} from "@/test-utils/state";

beforeEach(resetStore);

describe("Персистентность", () => {
  test("состояние сохраняется и восстанавливается", async () => {
    renderApp(<Calculator />);
    const selection = defaultFertilizers.slice(0, 2);
    setFormField("fertilizers", selection);
    calculateNow();

    const state = getState();
    expect(state.result).not.toBeNull();

    // В хранилище лежит актуальный калькулятор
    const persisted = readPersistence();
    expect(persisted).not.toBeNull();
    expect(persisted!.calculator.fertilizers).toEqual(state.fertilizers);
    expect(persisted!.calculator.result).toEqual(state.result);
    expect(persisted!.calculator.calculationForm?.fertilizers).toEqual(selection);

    // «Перезагрузка»: свежий экземпляр стора читает хранилище
    const fresh = await getFreshSnapshot();
    expect(fresh.fertilizers).toEqual(state.fertilizers);
    expect(fresh.result).toEqual(state.result);
    expect(fresh.calculationForm?.fertilizers).toEqual(selection);
  }, 20000);
});
