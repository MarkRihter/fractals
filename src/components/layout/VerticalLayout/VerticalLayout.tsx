import React from 'react'
import clsx from 'clsx'
import { BasicFlexLayout } from 'components'
import { IFlexLayoutProps } from 'interfaces'
import styles from './VerticalLayout.module.scss'

const VerticalLayout: React.FC<IFlexLayoutProps> = ({
  children,
  justifyContent,
  alignItems,
  className,
  ...rest
}) => {
  return (
    <BasicFlexLayout
      alignItems={alignItems}
      justifyContent={justifyContent}
      className={clsx(styles.verticalLayout, className)}
      {...rest}
    >
      {children}
    </BasicFlexLayout>
  )
}

export default VerticalLayout
