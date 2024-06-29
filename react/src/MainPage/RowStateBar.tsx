import * as Util from '../__autoGenerated/util'

export const RowStateBar = ({ state }: {
  state: Util.LocalRepositoryState
}) => {
  if (state === '+') {
    return <div className="w-2 self-stretch bg-lime-500"></div>
  } else if (state === '*') {
    return <div className="w-2 self-stretch bg-sky-500"></div>
  } else if (state === '-') {
    return <div className="w-2 self-stretch bg-rose-500"></div>
  } else {
    return <div className="w-2 self-stretch"></div>
  }
}