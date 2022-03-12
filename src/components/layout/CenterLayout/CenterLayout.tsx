import React from 'react'
import { BasicFlexLayout } from 'components'
import { IFlexLayoutProps } from 'interfaces'

const CenterLayout: React.FC<IFlexLayoutProps> = ({ children, className, ...rest }) => {
  return (
    <BasicFlexLayout className={className} alignItems='center' justifyContent='center' {...rest}>
      {children}
    </BasicFlexLayout>
  )
}

export default CenterLayout
