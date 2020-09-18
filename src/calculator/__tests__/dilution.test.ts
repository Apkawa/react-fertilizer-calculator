import {dilution_solution} from "../dilution";

describe("Test dilution", () => {
  test("A 1:1 (100%) to 1:30 (30%)", () => {
    const res = dilution_solution({id: 'target', concentration: 0.3, volume: 1},
      [
        {id: 'A', concentration: 1, }
      ])
    expect(res).toEqual([
      {id: 'A', volume: 0.3}
    ])
  })
  test("A,B 100:1 to A+B 1:1", () => {
    const res = dilution_solution({id: 'target', concentration: 1, volume: 25},
      [
        {id: 'A', concentration: 100, },
        {id: 'B', concentration: 100, }
      ])
    expect(res).toEqual([
      {id: 'A', volume: 0.25},
      {id: 'B', volume: 0.25},
    ])
  })
})
