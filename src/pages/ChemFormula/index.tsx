import React, {useEffect, useState} from "react";
import {Box, Flex, Heading} from "rebass";
import {Input} from "@rebass/forms";
import {parseMolecule} from "@/calculator/chem";
import {Elements} from "@/calculator/types";
import {normalizeFertilizer} from "@/calculator/fertilizer";
import {useHistory, useParams} from "react-router-dom";
import {entries, round, sum, values} from "@/utils";
import {ATOMIC_MASS, AtomNameType, FERTILIZER_ELEMENT_NAMES} from "@/calculator/constants";

type DecomposedChemFormula = {
  [Atom in AtomNameType]?: {
    count: number,
    mass: number,
    totalMass: number
  }
}

interface Result {
  formula: string,
  decomposed_formula: DecomposedChemFormula,
  oxide_npk: Elements,
  npk: Elements,
}

function parseFormula(formula: string, percent = 100): Result {
  const f = {id: '', composition: [{formula, percent}]}
  const p = entries(parseMolecule(formula)).map(([a, c]) =>
    [a, {count: c, mass: ATOMIC_MASS[a], totalMass: c * ATOMIC_MASS[a]}]
  )
  return {
    formula,
    decomposed_formula: Object.fromEntries(p),
    oxide_npk: normalizeFertilizer(f, false).elements,
    npk: normalizeFertilizer(f, true).elements,
  }
}

export default () => {
  const history = useHistory()
  const {formula = "", percent: initialPercent = "98"} = useParams<{ formula?: string, percent: string }>();
  const [value, setValue] = useState<string>(formula)
  const [percent, setPercent] = useState<number>(parseFloat(initialPercent))
  const [result, setResult] = useState<Result | null>(null)
  const onChangeHandler = (value: string) => {
    setValue(value)
  }
  const onBlurHandler = (value: string) => {
    onChangeHandler(value)
  }

  useEffect(() => {
    setResult(parseFormula(value, percent))
    history.replace(`/formula/${value}/${percent}`)
  }, [history, percent, value])

  return (
    <Flex sx={
      {
        justifyContent: 'center'
      }
    }>
      <Box width='936px'>
        <Flex sx={{
          justifyContent: "space-between",
          '@media screen and (max-width: 1350px)': {
            justifyContent: "flex-start",
          }
        }}>
          <Heading>Парсер формул</Heading>
        </Flex>
        <Flex>
          <Input
            value={value}
            placeholder={"MgSO4*7H2O"}
            onChange={event => onChangeHandler(event.target.value)}
            onBlur={event => onBlurHandler(event.target.value)}
          />
          <Input
            type="number"
            step="0.1"
            min={0}
            max={100}
            value={percent}
            onChange={event => setPercent(parseFloat(event.target.value))}
            flex={1}
            minWidth="5em"
          />
        </Flex>
        {result ? (
          <Flex flexDirection="column">
            <Box>
              <b>Формула: </b> {result.formula}
            </Box>
            <Box>
              <Heading fontSize={3} marginTop={3}>
                Атомная масса
              </Heading>
              <table>
                <thead>
                <tr>
                  <th>Атом</th>
                  <th>Масса</th>
                  <th>Количество</th>
                  <th>Сумма</th>
                </tr>
                </thead>
                <tbody>
                {entries(result.decomposed_formula).map(([a, c]) => (
                  <tr>
                    <th>{a}</th>
                    <td>{c.mass}</td>
                    <td>{c.count}</td>
                    <td>{round(c.totalMass,2)}</td>
                  </tr>
                ))}
                <tr>
                  <th colSpan={3}>Итого</th>
                  <td>{round(sum(values(result.decomposed_formula).map(c => c.totalMass)), 2)}</td>
                </tr>
                </tbody>
              </table>
            </Box>
            <Box>
              <Heading fontSize={3} marginTop={3}>
                NPK оксидов
              </Heading>
              <table
                style={{
                  textAlign: "center",
                  width: "50%"
                }}
              >
                <thead>
                <tr>
                  {FERTILIZER_ELEMENT_NAMES.map(e => <th>{e}</th>)}
                </tr>
                </thead>
                <tbody>
                <tr>
                  {FERTILIZER_ELEMENT_NAMES.map(e => <td>{result?.oxide_npk[e]}</td>)}
                </tr>
                </tbody>
              </table>

            </Box>
            <Box>
              <Heading fontSize={3} marginTop={3}>
                NPK чистых веществ
              </Heading>
              <table
                style={{
                textAlign: "center",
                width: "50%"
              }}
              >
                <thead>
                <tr>
                  {FERTILIZER_ELEMENT_NAMES.map(e => <th>{e}</th>)}
                </tr>
                </thead>
                <tbody>
                <tr>
                  {FERTILIZER_ELEMENT_NAMES.map(e => <td>{result?.npk[e]}</td>)}
                </tr>
                </tbody>
              </table>

            </Box>
          </Flex>
        ) : null}


      </Box>
    </Flex>
  )
}
