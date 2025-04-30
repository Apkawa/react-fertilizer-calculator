import React, {FunctionComponent} from "react";
import {Card, Flex, Heading, Text} from "rebass";
import {Label} from "@rebass/forms";
import {Input} from "../../ui/ReduxForm/Input";
import {decimal} from "../../ui/ReduxForm/normalizers";
import {useDispatch, useSelector} from "react-redux";
import {change, getFormValues} from "redux-form";
import {REDUX_FORM_NAME} from "@/components/Calculator/constants";
import {CalculatorFormValues} from "@/components/Calculator/types";
import {Concentration, normalizeConcentration} from "@/calculator/dilution";


interface SolutionVolumeProps {
}

export const Solution: FunctionComponent<SolutionVolumeProps> = () => {
    const {
        topping_up_enabled, solution_concentration,
    } = useSelector(getFormValues(REDUX_FORM_NAME)) as CalculatorFormValues
    const dispatch = useDispatch();

    const onChange = (field: string) => (event: any) => {
        if (!event.target.value) {
            return
        }
        let k = parseFloat(event.target.value)

        let newCon: Partial<Concentration> = {}
        if (field === 'k') {
            newCon.k = k
        } else {
            newCon = {...solution_concentration, [field]: k}
            delete newCon.k
        }
        const newConcentration = normalizeConcentration(newCon)
        dispatch(change(REDUX_FORM_NAME, 'solution_concentration', newConcentration))
    }
    return (
        <Card>
            <Heading fontSize={2}>Раствор</Heading>
            <Flex flexDirection="column">
                <Flex alignItems="center" justifyContent="space-between">
                    <Label htmlFor="solution_volume">Объем, л</Label>
                    <Input
                        disabled={topping_up_enabled}
                        name="solution_volume"
                        width="4rem"
                        type="number"
                        step="0.05"
                        min="0.1"
                        max="100"
                        normalize={decimal}
                        style={{
                            textAlign: "center"
                        }}
                        autoComplete="off"
                    />
                </Flex>
                <Flex alignItems="center" justifyContent="space-between" paddingTop={2}>
                    <Label htmlFor="solution_concentration.k">Концентрация</Label>
                </Flex>
                <Flex alignItems="center" paddingTop={2}>

                    <Text fontSize={"2rem"}>1:</Text>
                        <Input
                            disabled={topping_up_enabled}
                            name="solution_concentration.k"
                            type="number"
                            step="0.01"
                            width={"auto"}
                            min="1"
                            max="1000"
                            normalize={decimal}
                            style={{
                                textAlign: "center"
                            }}
                            autoComplete="off"
                            onChange={onChange('k')}
                        />
                </Flex>
                <Flex alignItems={"center"} paddingTop={2}>
                    Или
                    <Input
                        disabled={topping_up_enabled}
                        name="solution_concentration.v_1"
                        width="4rem"
                        type="number"
                        step="0.01"
                        min="1"
                        normalize={decimal}
                        style={{
                            textAlign: "center"
                        }}
                        autoComplete="off"
                        onChange={onChange('v_1')}
                    /> мл
                    на
                    <Input
                        disabled={topping_up_enabled}
                        name="solution_concentration.v_2"
                        width="4rem"
                        type="number"
                        step="0.01"
                        min="0"
                        normalize={decimal}
                        style={{
                            textAlign: "center"
                        }}
                        autoComplete="off"
                        onChange={onChange('v_2')}
                    /> мл рабочего раствора
                </Flex>
                <Flex alignItems="center" justifyContent="space-between" paddingTop={2}>
                </Flex>

            </Flex>
        </Card>
    )
}
