import React, { HTMLAttributes, useCallback, useImperativeHandle, useRef } from 'react'
import SimpleMDE, { GetMdeInstance } from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import { defineCustomComponent } from './InputBase'

export const TextareaBase = defineCustomComponent<string, {}, HTMLAttributes<HTMLDivElement>>((props, ref) => {

  const {
    onChange,
    value,
    readOnly,
    onFocus,
    className,
    ...rest
  } = props

  const mdeInstance = useRef<Parameters<GetMdeInstance>[0]>()
  const getMdeInstanceCallback: GetMdeInstance = useCallback(mde => {
    mdeInstance.current = mde
  }, [])

  useImperativeHandle(ref, () => ({
    getValue: () => value,
    focus: () => {
      // focusが呼ばれるタイミングの方が早いのでsetTimeoutで待つ
      const waitForInstanceReady = () => setTimeout(() => {
        if (mdeInstance.current) {
          mdeInstance.current.codemirror.focus()
        } else {
          waitForInstanceReady()
        }
      }, 10)
      waitForInstanceReady()
    },
  }), [mdeInstance, value])

  const handleFocus: React.FocusEventHandler<HTMLDivElement> = useCallback(e => {
    onFocus?.(e)
  }, [onFocus, readOnly])
  const onTextChange = useCallback((value: string) => {
    onChange?.(value)
  }, [onChange])

  // TODO: ver0.1.1現在はreadonlyになることは無いので適当に実装している
  if (readOnly) return (
    <span>
      {value}
    </span>
  )

  return (
    <SimpleMDE
      getMdeInstance={getMdeInstanceCallback}
      value={value ?? ''}
      onChange={onTextChange}
      className={`w-full ${className}`}
      onFocus={handleFocus}
      spellCheck="false"
      options={OPTIONS}
      {...rest}
    />
  )
})

const OPTIONS: EasyMDE.Options = {
  spellChecker: false, // trueだと日本語の部分が全部チェックに引っかかってしまう
  toolbar: [], // ツールバー全部非表示
  minHeight: '3rem',
}
