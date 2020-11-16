import React, {useEffect, useState} from "react";
import {Box, Flex, Heading, Text} from "rebass";
import {Input, Label} from "@rebass/forms";
import {useHistory, useParams} from "react-router-dom";
import {DATA_KEYS} from "@/calculator/density-calculator/constants";
import {Dropdown} from "@/components/ui/Dropdown/Dropdown";
import {getConcentrationFromDensity, getDensityFromConcentration} from '../../calculator/density-calculator';
import {round} from "@/utils";


interface RouterParams {
  formula?: string,
  density?: string,
  concentration?: string,
}

export default () => {
  const history = useHistory()
  const params = useParams<RouterParams>();
  const [value, setValue] = useState<string | null>(params.formula || null)
  const [density, setDensity] = useState<number | null>(params.density ? parseFloat(params.density) : null)
  const [concentration, setConcentration] = useState<number | null>(params.concentration ? parseFloat(params.concentration) : null)

  const onChangeFormula = (v: string|null) => {

    setValue(v)
    if (v && DATA_KEYS.includes(v as DATA_KEYS) && density) {
      const c = round(getConcentrationFromDensity(value as DATA_KEYS, density), 1)
      if (c !== concentration) {
        setConcentration(c)
      }
    }

  }

  const onChangeConcentration = (v: string) => {
    const c = parseFloat(v)
    setConcentration(c)
    if (value && DATA_KEYS.includes(value as DATA_KEYS) && c) {
      const d = round(getDensityFromConcentration(value as DATA_KEYS, c), 4)
      if (d !== density) {
        setDensity(d)
      }
    }
  }

  const onChangeDensity = (v: string) => {
    const d = parseFloat(v)
    setDensity(d)
    if (value && DATA_KEYS.includes(value as DATA_KEYS) && d) {
      const c = round(getConcentrationFromDensity(value as DATA_KEYS, d), 1)
      if (c !== concentration) {
        setConcentration(c)
      }
    }
  }


  useEffect(() => {
    if (DATA_KEYS.includes(value as DATA_KEYS)) {
      history.replace(`/density/${value}/${concentration}/${density}`)
    } else {
      history.replace(`/density/`)
    }
  }, [history, value, density, concentration])

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
          <Heading>Калькулятор плотности</Heading>
        </Flex>
        <Flex flexDirection="column">
          <Box width="300px">
            <Label flexDirection="column">
              Соль
              <Dropdown items={DATA_KEYS}
                        onChange={onChangeFormula}
                        value={value}
              />
            </Label>
          </Box>
          <Label flexDirection="column">
            Концентрация
            <Input
              type="number"
              step="0.1"
              min={0}
              max={2000}
              value={concentration || 0}
              onChange={event => onChangeConcentration(event.target.value)}
              minWidth="5em"
              width="10em"
            />
            <Text sx={{whiteSpace: 'nowrap'}}>г/л</Text>
          </Label>
          <Label flexDirection="column">
            Плотность
            <Input
              type="number"
              step="0.0001"
              min={0}
              max={2}
              value={density || 0}
              onChange={event => onChangeDensity(event.target.value)}
              minWidth="5em"
              width="10em"
            />
            <Text sx={{whiteSpace: 'nowrap'}}>г/мл</Text>
          </Label>
        </Flex>
      </Box>
    </Flex>
  )
}
