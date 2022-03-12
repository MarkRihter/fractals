import React from 'react'
import clsx from 'clsx'
import { IFlexLayoutProps } from 'interfaces'
import styles from './BasicFlexLayout.module.scss'

const BasicFlexLayout: React.FC<IFlexLayoutProps> = ({
  children,
  className,
  justifyContent = 'flex-start',
  alignItems = 'center',
  gap,
  ...rest
}) => {
  return (
    <div
      style={{ justifyContent, alignItems, gap }}
      className={clsx(styles.basicFlexLayout, className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export default BasicFlexLayout
