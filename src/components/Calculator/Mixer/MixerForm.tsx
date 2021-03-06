import React from "react";
import {Flex} from "rebass";

import {Form, reduxForm} from 'redux-form'
import {ReduxFormType} from "@/components/ui/ReduxForm/types";
import {Input} from "@/components/ui/ReduxForm/Input";
import {FertilizerInfo, MixerOptions} from "@/components/Calculator/types";

interface AddEditProps {
}

export interface MixerFormType extends MixerOptions {
  fertilizers: FertilizerInfo[]
}


const AddEditForm: ReduxFormType<AddEditProps, MixerFormType> = (props) => {

  return (
    <Form>
      <Flex flexDirection='column'>
        <Input name="url" title="URL" label="URL"/>
      </Flex>
    </Form>
  )
}


export const MixerOptionsForm = reduxForm<MixerFormType>({
  form: 'mixerOptions',
  enableReinitialize: true
})(AddEditForm)
