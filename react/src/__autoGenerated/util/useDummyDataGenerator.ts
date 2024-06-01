import { useCallback } from 'react'
import { useHttpRequest } from './Http'
import { ItemKey } from './LocalRepository'
import * as AggregateType from '../autogenerated-types'

export const useDummyDataGenerator = () => {
  const { get, post } = useHttpRequest()

  return useCallback(async () => {

    const data72624326 = AggregateType.createRowType()
    
    
    
    data72624326.Columns = [AggregateType.createColumns()]
    
    data72624326.Columns[0].ColumnName = 'TTTTTTTTTT'
    
    const response81732535 = await post<AggregateType.RowTypeSaveCommand>(`/api/RowType/create`, data72624326)
    if (!response81732535.ok) return false
    
    const data55816118 = AggregateType.createRowType()
    
    
    
    data55816118.Columns = [AggregateType.createColumns()]
    
    data55816118.Columns[0].ColumnName = 'OOOOOOOOOO'
    
    const response20603315 = await post<AggregateType.RowTypeSaveCommand>(`/api/RowType/create`, data55816118)
    if (!response20603315.ok) return false
    
    const data90602705 = AggregateType.createRowType()
    
    
    
    data90602705.Columns = [AggregateType.createColumns()]
    
    data90602705.Columns[0].ColumnName = 'ZZZZZZZZZZ'
    
    const response44217786 = await post<AggregateType.RowTypeSaveCommand>(`/api/RowType/create`, data90602705)
    if (!response44217786.ok) return false
    
    const data27370445 = AggregateType.createRowType()
    
    
    
    data27370445.Columns = [AggregateType.createColumns()]
    
    data27370445.Columns[0].ColumnName = 'MMMMMMMMMM'
    
    const response29190628 = await post<AggregateType.RowTypeSaveCommand>(`/api/RowType/create`, data27370445)
    if (!response29190628.ok) return false
    
    const data63265906 = AggregateType.createRow()
    
    data63265906.Parent = 'ZZZZZZZZZZ'
    data63265906.Label = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    const response03036699 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data63265906.RowType = response03036699.ok ? response03036699.data[0].__instanceKey : undefined
    
    
    data63265906.Attrs = [AggregateType.createAttrs()]
    const response86237014 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data63265906.Attrs[0].ColType = response86237014.ok ? response86237014.data[0].__instanceKey : undefined
    data63265906.Attrs[0].Value = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    
    const response46951187 = await post<AggregateType.RowSaveCommand>(`/api/Row/create`, data63265906)
    if (!response46951187.ok) return false
    
    const data99534707 = AggregateType.createRow()
    
    data99534707.Parent = 'IIIIIIIIII'
    data99534707.Label = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    const response81690790 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data99534707.RowType = response81690790.ok ? response81690790.data[1].__instanceKey : undefined
    
    
    data99534707.Attrs = [AggregateType.createAttrs()]
    const response84805177 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data99534707.Attrs[0].ColType = response84805177.ok ? response84805177.data[1].__instanceKey : undefined
    data99534707.Attrs[0].Value = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    
    const response67718114 = await post<AggregateType.RowSaveCommand>(`/api/Row/create`, data99534707)
    if (!response67718114.ok) return false
    
    const data99190216 = AggregateType.createRow()
    
    data99190216.Parent = 'SSSSSSSSSS'
    data99190216.Label = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    const response52628413 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data99190216.RowType = response52628413.ok ? response52628413.data[2].__instanceKey : undefined
    
    
    data99190216.Attrs = [AggregateType.createAttrs()]
    const response93401864 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data99190216.Attrs[0].ColType = response93401864.ok ? response93401864.data[2].__instanceKey : undefined
    data99190216.Attrs[0].Value = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    
    const response03262519 = await post<AggregateType.RowSaveCommand>(`/api/Row/create`, data99190216)
    if (!response03262519.ok) return false
    
    const data68762027 = AggregateType.createRow()
    
    data68762027.Parent = 'CCCCCCCCCC'
    data68762027.Label = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    const response18712457 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data68762027.RowType = response18712457.ok ? response18712457.data[3].__instanceKey : undefined
    
    
    data68762027.Attrs = [AggregateType.createAttrs()]
    const response45332718 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data68762027.Attrs[0].ColType = response45332718.ok ? response45332718.data[3].__instanceKey : undefined
    data68762027.Attrs[0].Value = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    
    const response54681542 = await post<AggregateType.RowSaveCommand>(`/api/Row/create`, data68762027)
    if (!response54681542.ok) return false
    

    return true
  }, [post])
}
