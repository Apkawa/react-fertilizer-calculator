import {dilution_solution, normalizeConcentration} from "../dilution";

describe("Test dilution", () => {
    test("A 1:1 (100%) to 1:30 (30%)", () => {
        const res = dilution_solution({id: 'target', concentration: 0.3, volume: 1},
            [
                {id: 'A', concentration: 1,}
            ])
        expect(res).toEqual([
            {id: 'A', volume: 0.3}
        ])
    })
    test("A 1:1000 to 1:1", () => {
        const res = dilution_solution({id: 'target', concentration: 1, volume: 1},
            [
                {id: 'A', concentration: 1000,}
            ])
        expect(res).toEqual([
            {id: 'A', volume: 0.001}
        ])
    })
    test("A 1:500 to 1:1", () => {
        const res = dilution_solution({id: 'target', concentration: 1, volume: 1},
            [
                {id: 'A', concentration: 500,}
            ])
        expect(res).toEqual([
            {id: 'A', volume: 0.002}
        ])
    })
    test("A,B 100:1 to A+B 1:1", () => {
        const res = dilution_solution({id: 'target', concentration: 1, volume: 25},
            [
                {id: 'A', concentration: 100,},
                {id: 'B', concentration: 100,}
            ])
        expect(res).toEqual([
            {id: 'A', volume: 0.25},
            {id: 'B', volume: 0.25},
        ])
    })

    test("A 30мл в 40л для 80л раствора", () => {
        const res = dilution_solution(
            {id: 'target', concentration: 1, volume: 80},
            [
                {id: 'A', concentration: normalizeConcentration({v_1: 30, v_2: 40 * 1000}),}
            ])
        expect(res).toEqual([
            {id: 'A', volume: 0.06}
        ])
    })
})
