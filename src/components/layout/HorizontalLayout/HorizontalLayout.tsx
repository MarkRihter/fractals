import React from 'react'
import clsx from 'clsx'
import { BasicFlexLayout } from 'components'
import { IFlexLayoutProps } from 'interfaces'
import styles from './HorizontalLayout.module.scss'

const HorizontalLayout: React.FC<IFlexLayoutProps> = ({ children, className, ...rest }) => {
  return (
    <BasicFlexLayout className={clsx(styles.horizontalLayout, className)} {...rest}>
      {children}
    </BasicFlexLayout>
  )
}

export default HorizontalLayout
