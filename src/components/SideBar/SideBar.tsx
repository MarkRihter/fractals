import React, { ChangeEvent, useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import Form, {
  FormHeader,
  FormSection,
  FormFooter,
  Field,
  RangeField,
  ErrorMessage,
} from '@atlaskit/form'
import SettingsIcon from '@atlaskit/icon/glyph/settings'
import DownloadIcon from '@atlaskit/icon/glyph/download'
import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on'
import MediaServicesFullScreenIcon from '@atlaskit/icon/glyph/media-services/full-screen'
import Drawer from '@atlaskit/drawer'
import Button from '@atlaskit/button'
import Range from '@atlaskit/range'
import TextField from '@atlaskit/textfield'
import Select, { ValueType as Value } from '@atlaskit/select'
import { HorizontalLayout } from 'components'
import {
  $fractalConfig,
  $sidePanelSettings,
  $isImageExists,
  setXSize,
  setYSize,
  setXCenter,
  setYCenter,
  setCReal,
  setCImaginary,
  drawFractal,
  openDrawer,
  closeDrawer,
  setFractalType,
  setCalculationProvider,
  downloadImage,
} from 'models'
import { Fractal } from 'enums'
import {
  FractalOption,
  FractalOptions,
  CalculationProviderOption,
  CalculationProviderOptions,
} from 'interfaces'
import { useScreenSize } from 'utils'
import breakpoints from 'styles/breakpoints.module.scss'
import './styles.scss'

const SideBar: React.FC = () => {
  const { xSize, ySize, xCenter, yCenter, cReal, cImaginary, fractal, calculationProvider } =
    useStore($fractalConfig)
  const isImageExists = useStore($isImageExists)
  const { isDrawerOpened } = useStore($sidePanelSettings)
  const screenSize = useScreenSize()

  const onDrawerClose = () => closeDrawer()
  const onDrawerOpen = () => openDrawer()
  const onImageDownload = () => downloadImage()
  const onFractalTypeChange = (fractalType: FractalOption | null) =>
    fractalType && setFractalType(fractalType)
  const onCalculationProviderChange = (calculationProvider: CalculationProviderOption | null) =>
    calculationProvider && setCalculationProvider(calculationProvider)
  const onCRealChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (value !== '') setCReal(parseFloat(value))
  }
  const onCImaginaryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (value !== '') setCImaginary(parseFloat(value))
  }

  const onSubmit = () => {
    onDrawerClose()
    drawFractal()
  }

  const isScreenSmall = screenSize.width <= parseInt(breakpoints.smallScreen)

  return (
    <>
      <div className='drawerButtonWrapper'>
        <Button
          className='drawerButton'
          iconBefore={<SettingsIcon label='settings' />}
          appearance='subtle'
          onClick={onDrawerOpen}
        >
          {!isScreenSmall && 'Configuration'}
        </Button>
        {isImageExists && (
          <>
            <Button
              className='drawerButton'
              iconBefore={<DownloadIcon label='download' />}
              appearance='primary'
              onClick={onImageDownload}
            >
              {!isScreenSmall && 'Save image'}
            </Button>
          </>
        )}
      </div>
      <Drawer
        width={isScreenSmall ? 'extended' : 'medium'}
        onClose={onDrawerClose}
        isOpen={isDrawerOpened}
        overrides={{
          Content: {
            component: ({ children }) => <div className='sidebar'>{children}</div>,
          },
        }}
      >
        <div className='drawerContent'>
          <Form onSubmit={onSubmit}>
            {({ formProps }) => (
              <form {...formProps} className='form'>
                <FormHeader title='Configuration' />
                <div className='settings'>
                  <FormSection title='Image size'>
                    <div className='rangesWrapper'>
                      <RangeField name='xSize' defaultValue={xSize} label={`X size: ${xSize}`}>
                        {({ fieldProps }) => (
                          <Range
                            {...fieldProps}
                            step={100}
                            min={100}
                            max={5000}
                            value={xSize}
                            onChange={setXSize}
                          />
                        )}
                      </RangeField>
                      <RangeField name='ySize' defaultValue={ySize} label={`Y size: ${ySize}`}>
                        {({ fieldProps }) => (
                          <Range
                            {...fieldProps}
                            step={100}
                            min={100}
                            max={5000}
                            value={ySize}
                            onChange={setYSize}
                          />
                        )}
                      </RangeField>
                    </div>
                  </FormSection>
                  <FormSection title='Fractal settings'>
                    <Field<Value<FractalOption>> name='fractal' label='Select fractal type'>
                      {({ fieldProps }) => (
                        <Select<FractalOption>
                          {...fieldProps}
                          value={fractal}
                          onChange={onFractalTypeChange}
                          options={FractalOptions}
                        />
                      )}
                    </Field>
                    {fractal.value === Fractal.Julia && (
                      <HorizontalLayout gap='10px'>
                        <Field name='cReal' label='C real' isRequired>
                          {({ fieldProps, error, valid }) => (
                            <>
                              <TextField
                                {...fieldProps}
                                type='number'
                                value={cReal}
                                onChange={onCRealChange}
                              />
                              {!valid && error && <ErrorMessage>{error}</ErrorMessage>}
                            </>
                          )}
                        </Field>
                        <Field name='cImaginary' label='C imaginary' isRequired>
                          {({ fieldProps, error, valid }) => (
                            <>
                              <TextField
                                {...fieldProps}
                                type='number'
                                value={cImaginary}
                                onChange={onCImaginaryChange}
                              />
                              {!valid && error && <ErrorMessage>{error}</ErrorMessage>}
                            </>
                          )}
                        </Field>
                      </HorizontalLayout>
                    )}
                    <Field<Value<CalculationProviderOption>>
                      name='calculationProvider'
                      label='Select calculation provider'
                    >
                      {({ fieldProps }) => (
                        <Select<CalculationProviderOption>
                          {...fieldProps}
                          value={calculationProvider}
                          onChange={onCalculationProviderChange}
                          options={CalculationProviderOptions}
                        />
                      )}
                    </Field>
                  </FormSection>
                  <FormSection title='Image center'>
                    <div className='rangesWrapper'>
                      <RangeField
                        name='xCenter'
                        defaultValue={xCenter}
                        label={`X center: ${xCenter}`}
                      >
                        {({ fieldProps }) => (
                          <Range
                            {...fieldProps}
                            step={0.01}
                            min={-2}
                            max={2}
                            value={xCenter}
                            onChange={setXCenter}
                          />
                        )}
                      </RangeField>
                      <RangeField
                        name='yCenter'
                        defaultValue={yCenter}
                        label={`Y center: ${yCenter}`}
                      >
                        {({ fieldProps }) => (
                          <Range
                            {...fieldProps}
                            step={0.01}
                            min={-2}
                            max={2}
                            value={yCenter}
                            onChange={setYCenter}
                          />
                        )}
                      </RangeField>
                    </div>
                  </FormSection>

                  <FormFooter align='start'>
                    <Button appearance='primary' type='submit'>
                      Render fractal
                    </Button>
                  </FormFooter>
                </div>
              </form>
            )}
          </Form>
        </div>
      </Drawer>
    </>
  )
}

export default SideBar
