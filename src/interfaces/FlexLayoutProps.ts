export interface IFlexLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'normal'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'
  alignItems?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'start'
    | 'end'
    | 'normal'
    | 'stretch'
    | 'baseline'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'
  className?: string
  gap?: `${number}px` | `${number}%`
}
