"use client"

import TimeAgo, {ReactTimeagoProps} from "react-timeago";

export function CustomTimeAgo(props: ReactTimeagoProps<any>) {
  return <TimeAgo {...props}/>
}
