import React, {ComponentType, useState} from "react";

interface LazyPromiseProps<T> {
  lazy: () => Promise<T>
  component: ComponentType<{ result: T }>
  loading?: ComponentType
  fallback?: ComponentType
}

export function LazyPromise<T>(props: LazyPromiseProps<T>) {
  const {lazy, component: Component, loading: Loading = (<></>)} = props
  const [result, setResult] = useState<T | undefined>(undefined)

  lazy().then(result => setResult(result))

  return (
    <>
      {result? <Component result={result} />: Loading}
    </>
  )
}
