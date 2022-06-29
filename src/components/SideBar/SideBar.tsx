import React from 'react'
import Form, {
  FormHeader,
  FormSection,
  FormFooter,
  Field,
  ErrorMessage,
  OnSubmitHandler,
} from '@atlaskit/form'
import SettingsIcon from '@atlaskit/icon/glyph/settings'
import DownloadIcon from '@atlaskit/icon/glyph/download'
import DrawerComponent from '@atlaskit/drawer'
import Button from '@atlaskit/button'
import TextField from '@atlaskit/textfield'
import Select, { ValueType as Value } from '@atlaskit/select'
import { HorizontalLayout } from 'components'
import { Fractal, Drawer } from 'models'
import { FractalType } from 'enums'
import {
  FractalOption,
  FractalOptions,
  CalculationProviderOption,
  CalculationProviderOptions,
  Optional,
} from 'interfaces'
import { useObserver, useScreenSize } from 'utils'
import { IConfigurationFields } from 'models'
import breakpoints from 'styles/breakpoints.module.scss'
import './styles.scss'

const SideBar: React.FC = () => {
  const screenSize = useScreenSize()
  const isDrawerOpened = useObserver(Drawer.isDrawerOpened)
  const img = useObserver(Fractal.img)

  const onSubmit: OnSubmitHandler<IConfigurationFields> = values => {
    for (const key in values) {
      if (!isNaN(+(values as any)[key])) (values as any)[key] = +(values as any)[key]
    }

    Fractal.setConfiguration(values)
    Fractal.drawFractal()
    Drawer.closeDrawer()
  }

  const validateSize = (value: Optional<string>) => {
    if (!value) return 'Please, enter correct integer'
    if (!/^\d*$/.test(value)) return 'Please, enter correct integer'
    if (+value < 10) return 'Size must be at least 10 pixels'

    return undefined
  }

  const validatePoint = (value: Optional<string>) => {
    if (!value) return 'Please, enter correct integer'
    if (isNaN(+value)) return 'Please, enter correct number'

    return undefined
  }

  const isScreenSmall = screenSize.width <= parseInt(breakpoints.smallScreen)

  return (
    <>
      <div className='drawerButtonWrapper'>
        <Button
          className='drawerButton'
          iconBefore={<SettingsIcon label='settings' />}
          appearance='subtle'
          onClick={Drawer.openDrawer}
        >
          {!isScreenSmall && 'Configuration'}
        </Button>
        {!!img && (
          <>
            <Button
              className='drawerButton'
              iconBefore={<DownloadIcon label='download' />}
              appearance='primary'
              onClick={Fractal.downloadImage}
            >
              {!isScreenSmall && 'Save image'}
            </Button>
          </>
        )}
      </div>
      <DrawerComponent
        width={isScreenSmall ? 'extended' : 'medium'}
        onClose={Drawer.closeDrawer}
        isOpen={isDrawerOpened}
        overrides={{
          Content: {
            component: ({ children }) => <div className='sidebar'>{children}</div>,
          },
        }}
      >
        <div className='drawerContent'>
          <Form onSubmit={onSubmit}>
            {({ formProps, getValues }) => {
              return (
                <form {...formProps} className='form'>
                  <FormHeader title='Configuration' />
                  <div className='settings'>
                    <FormSection title='Image size'>
                      <div className='rangesWrapper'>
                        <Field
                          name='xSize'
                          validate={validateSize}
                          label='Image width'
                          defaultValue={Fractal.configuration.xSize.toString()}
                        >
                          {({ fieldProps, error }) => (
                            <>
                              <TextField {...fieldProps} />
                              {error && <ErrorMessage>{error}</ErrorMessage>}
                            </>
                          )}
                        </Field>
                        <Field
                          name='ySize'
                          validate={validateSize}
                          defaultValue={Fractal.configuration.ySize.toString()}
                          label='Image height'
                        >
                          {({ fieldProps, error }) => (
                            <>
                              <TextField {...fieldProps} />
                              {error && <ErrorMessage>{error}</ErrorMessage>}
                            </>
                          )}
                        </Field>
                      </div>
                    </FormSection>
                    <FormSection title='Fractal settings'>
                      <Field<Value<FractalOption>>
                        defaultValue={Fractal.configuration.fractal}
                        name='fractal'
                        label='Select fractal type'
                      >
                        {({ fieldProps }) => (
                          <Select<FractalOption> {...fieldProps} options={FractalOptions} />
                        )}
                      </Field>
                      {getValues().fractal?.value === FractalType.Julia && (
                        <HorizontalLayout gap='10px'>
                          <Field
                            validate={validatePoint}
                            name='cReal'
                            label='C real'
                            defaultValue={Fractal.configuration.cReal.toString()}
                          >
                            {({ fieldProps, error }) => (
                              <>
                                <TextField {...fieldProps} />
                                {error && <ErrorMessage>{error}</ErrorMessage>}
                              </>
                            )}
                          </Field>
                          <Field
                            validate={validatePoint}
                            name='cImaginary'
                            label='C imaginary'
                            defaultValue={Fractal.configuration.cImaginary.toString()}
                          >
                            {({ fieldProps, error }) => (
                              <>
                                <TextField {...fieldProps} />
                                {error && <ErrorMessage>{error}</ErrorMessage>}
                              </>
                            )}
                          </Field>
                        </HorizontalLayout>
                      )}
                      <Field<Value<CalculationProviderOption>>
                        name='calculationProvider'
                        label='Select calculation provider'
                        defaultValue={Fractal.configuration.calculationProvider}
                      >
                        {({ fieldProps }) => (
                          <Select<CalculationProviderOption>
                            {...fieldProps}
                            options={CalculationProviderOptions}
                          />
                        )}
                      </Field>
                    </FormSection>
                    <FormSection title='Image center'>
                      <div className='rangesWrapper'>
                        <Field
                          name='xCenter'
                          defaultValue={Fractal.configuration.xCenter.toString()}
                          label='X center'
                        >
                          {({ fieldProps, error }) => (
                            <>
                              <TextField {...fieldProps} />
                              {error && <ErrorMessage>{error}</ErrorMessage>}
                            </>
                          )}
                        </Field>
                        <Field
                          name='yCenter'
                          defaultValue={Fractal.configuration.yCenter.toString()}
                          label='Y center'
                        >
                          {({ fieldProps, error }) => (
                            <>
                              <TextField {...fieldProps} />
                              {error && <ErrorMessage>{error}</ErrorMessage>}
                            </>
                          )}
                        </Field>
                      </div>
                    </FormSection>
                    <FormFooter align='start'>
                      <Button appearance='primary' type='submit'>
                        Render fractal
                      </Button>
                    </FormFooter>
                  </div>
                </form>
              )
            }}
          </Form>
        </div>
      </DrawerComponent>
    </>
  )
}

export default SideBar
