import type { FunctionComponent } from 'react';
import { Suspense } from 'react'
import Loading from '../components/Loading/Loading'

const Loadable = (Component: FunctionComponent<any>) => (props: any) => {
  return (
      <Suspense fallback={<Loading />}>
        <Component {...props} />
      </Suspense>
  )
}

export default Loadable
