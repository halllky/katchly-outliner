import { useCallback } from 'react'
import { useHttpRequest } from './Http'
import { ItemKey } from './LocalRepository'
import * as AggregateType from '../autogenerated-types'

export const useDummyDataGenerator = () => {
  const { get, post } = useHttpRequest()

  return useCallback(async () => {

    const data72624326 = AggregateType.createRowType()
    
    data72624326.RowTypeName = 'TTTTTTTTTT'
    
    data72624326.CreatedOn = '2004-08-01'
    data72624326.CreateUser = 'FFFFFFFFFF'
    data72624326.UpdatedOn = '2004-08-03'
    data72624326.UpdateUser = 'XXXXXXXXXX'
    
    data72624326.Columns = [AggregateType.createColumns()]
    
    data72624326.Columns[0].ColumnName = 'LLLLLLLLLL'
    data72624326.Columns[0].ValueType = 'RefMultiple'
    data72624326.Columns[0].CanReferOnly = 'HHHHHHHHHH'
    
    const response81732535 = await post<AggregateType.RowTypeSaveCommand>(`/api/RowType/create`, data72624326)
    if (!response81732535.ok) return false
    
    const data29190628 = AggregateType.createRowType()
    
    data29190628.RowTypeName = 'QQQQQQQQQQ'
    
    data29190628.CreatedOn = '2003-11-09'
    data29190628.CreateUser = 'ZZZZZZZZZZ'
    data29190628.UpdatedOn = '2000-04-01'
    data29190628.UpdateUser = 'WWWWWWWWWW'
    
    data29190628.Columns = [AggregateType.createColumns()]
    
    data29190628.Columns[0].ColumnName = 'ZZZZZZZZZZ'
    data29190628.Columns[0].ValueType = 'RefMultiple'
    data29190628.Columns[0].CanReferOnly = 'IIIIIIIIII'
    
    const response46731469 = await post<AggregateType.RowTypeSaveCommand>(`/api/RowType/create`, data29190628)
    if (!response46731469.ok) return false
    
    const data81690790 = AggregateType.createRowType()
    
    data81690790.RowTypeName = 'ZZZZZZZZZZ'
    
    data81690790.CreatedOn = '2000-04-07'
    data81690790.CreateUser = 'SSSSSSSSSS'
    data81690790.UpdatedOn = '2004-04-27'
    data81690790.UpdateUser = 'YYYYYYYYYY'
    
    data81690790.Columns = [AggregateType.createColumns()]
    
    data81690790.Columns[0].ColumnName = 'RRRRRRRRRR'
    data81690790.Columns[0].ValueType = 'RefSingle'
    data81690790.Columns[0].CanReferOnly = 'CCCCCCCCCC'
    
    const response84805177 = await post<AggregateType.RowTypeSaveCommand>(`/api/RowType/create`, data81690790)
    if (!response84805177.ok) return false
    
    const data18712457 = AggregateType.createRowType()
    
    data18712457.RowTypeName = 'HHHHHHHHHH'
    
    data18712457.CreatedOn = '2008-02-13'
    data18712457.CreateUser = 'QQQQQQQQQQ'
    data18712457.UpdatedOn = '2006-04-07'
    data18712457.UpdateUser = 'AAAAAAAAAA'
    
    data18712457.Columns = [AggregateType.createColumns()]
    
    data18712457.Columns[0].ColumnName = 'JJJJJJJJJJ'
    data18712457.Columns[0].ValueType = 'RefSingle'
    data18712457.Columns[0].CanReferOnly = 'YYYYYYYYYY'
    
    const response45332718 = await post<AggregateType.RowTypeSaveCommand>(`/api/RowType/create`, data18712457)
    if (!response45332718.ok) return false
    
    const data50512920 = AggregateType.createRow()
    
    data50512920.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    const response11895772 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data50512920.RowType = response11895772.ok ? response11895772.data[0].__instanceKey : undefined
    
    data50512920.Indent = 273451
    data50512920.CreatedOn = '2007-06-14'
    data50512920.CreateUser = 'UUUUUUUUUU'
    data50512920.UpdatedOn = '2002-10-08'
    data50512920.UpdateUser = 'LLLLLLLLLL'
    
    data50512920.Attrs = [AggregateType.createAttrs()]
    const response14682503 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data50512920.Attrs[0].ColType = response14682503.ok ? response14682503.data[0].__instanceKey : undefined
    data50512920.Attrs[0].Value = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data50512920.Attrs[0].UpdatedOn = '2001-10-25'
    
    data50512920.Attrs[0].RowAttrsRefs = [AggregateType.createRowAttrsRefs()]
    data50512920.Attrs[0].RowAttrsRefs[0].RefToRow = 'KKKKKKKKKK'
    
    const response71597250 = await post<AggregateType.RowSaveCommand>(`/api/Row/create`, data50512920)
    if (!response71597250.ok) return false
    
    const data71872682 = AggregateType.createRow()
    
    data71872682.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    const response48796804 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data71872682.RowType = response48796804.ok ? response48796804.data[1].__instanceKey : undefined
    
    data71872682.Indent = 194913
    data71872682.CreatedOn = '2007-03-19'
    data71872682.CreateUser = 'VVVVVVVVVV'
    data71872682.UpdatedOn = '2006-01-15'
    data71872682.UpdateUser = 'WWWWWWWWWW'
    
    data71872682.Attrs = [AggregateType.createAttrs()]
    const response67974900 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data71872682.Attrs[0].ColType = response67974900.ok ? response67974900.data[1].__instanceKey : undefined
    data71872682.Attrs[0].Value = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data71872682.Attrs[0].UpdatedOn = '2005-02-17'
    
    data71872682.Attrs[0].RowAttrsRefs = [AggregateType.createRowAttrsRefs()]
    data71872682.Attrs[0].RowAttrsRefs[0].RefToRow = 'FFFFFFFFFF'
    
    const response61983027 = await post<AggregateType.RowSaveCommand>(`/api/Row/create`, data71872682)
    if (!response61983027.ok) return false
    
    const data89536243 = AggregateType.createRow()
    
    data89536243.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    const response08657988 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data89536243.RowType = response08657988.ok ? response08657988.data[2].__instanceKey : undefined
    
    data89536243.Indent = 838578
    data89536243.CreatedOn = '2001-05-25'
    data89536243.CreateUser = 'QQQQQQQQQQ'
    data89536243.UpdatedOn = '2006-10-16'
    data89536243.UpdateUser = 'FFFFFFFFFF'
    
    data89536243.Attrs = [AggregateType.createAttrs()]
    const response99997268 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data89536243.Attrs[0].ColType = response99997268.ok ? response99997268.data[2].__instanceKey : undefined
    data89536243.Attrs[0].Value = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data89536243.Attrs[0].UpdatedOn = '2003-12-15'
    
    data89536243.Attrs[0].RowAttrsRefs = [AggregateType.createRowAttrsRefs()]
    data89536243.Attrs[0].RowAttrsRefs[0].RefToRow = 'QQQQQQQQQQ'
    
    const response89643979 = await post<AggregateType.RowSaveCommand>(`/api/Row/create`, data89536243)
    if (!response89643979.ok) return false
    
    const data71972597 = AggregateType.createRow()
    
    data71972597.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    const response10093539 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data71972597.RowType = response10093539.ok ? response10093539.data[3].__instanceKey : undefined
    
    data71972597.Indent = 729093
    data71972597.CreatedOn = '2005-11-25'
    data71972597.CreateUser = 'DDDDDDDDDD'
    data71972597.UpdatedOn = '2007-06-08'
    data71972597.UpdateUser = 'EEEEEEEEEE'
    
    data71972597.Attrs = [AggregateType.createAttrs()]
    const response47680986 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data71972597.Attrs[0].ColType = response47680986.ok ? response47680986.data[3].__instanceKey : undefined
    data71972597.Attrs[0].Value = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data71972597.Attrs[0].UpdatedOn = '2004-06-10'
    
    data71972597.Attrs[0].RowAttrsRefs = [AggregateType.createRowAttrsRefs()]
    data71972597.Attrs[0].RowAttrsRefs[0].RefToRow = 'IIIIIIIIII'
    
    const response80946257 = await post<AggregateType.RowSaveCommand>(`/api/Row/create`, data71972597)
    if (!response80946257.ok) return false
    
    const data67103666 = AggregateType.createRowOrder()
    const response83349689 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data67103666.Row = response83349689.ok ? response83349689.data[0].__instanceKey : undefined
    data67103666.Order = 809203.78
    
    
    const response46839773 = await post<AggregateType.RowOrderSaveCommand>(`/api/RowOrder/create`, data67103666)
    if (!response46839773.ok) return false
    
    const data76450597 = AggregateType.createRowOrder()
    const response29499679 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data76450597.Row = response29499679.ok ? response29499679.data[1].__instanceKey : undefined
    data76450597.Order = 522784.65
    
    
    const response93754039 = await post<AggregateType.RowOrderSaveCommand>(`/api/RowOrder/create`, data76450597)
    if (!response93754039.ok) return false
    
    const data33258902 = AggregateType.createRowOrder()
    const response82061006 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data33258902.Row = response82061006.ok ? response82061006.data[2].__instanceKey : undefined
    data33258902.Order = 222517.18
    
    
    const response28672242 = await post<AggregateType.RowOrderSaveCommand>(`/api/RowOrder/create`, data33258902)
    if (!response28672242.ok) return false
    
    const data06851884 = AggregateType.createRowOrder()
    const response69304503 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data06851884.Row = response69304503.ok ? response69304503.data[3].__instanceKey : undefined
    data06851884.Order = 630393.91
    
    
    const response62462275 = await post<AggregateType.RowOrderSaveCommand>(`/api/RowOrder/create`, data06851884)
    if (!response62462275.ok) return false
    
    const data22134203 = AggregateType.createComment()
    
    data22134203.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data22134203.Author = 'BBBBBBBBBB'
    data22134203.Indent = 900103
    data22134203.Order = 678504
    data22134203.CreatedOn = '2000-10-08'
    data22134203.UpdatedOn = '2001-03-23'
    const response10697249 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data22134203.TargetRow = response10697249.ok ? response10697249.data[0].__instanceKey : undefined
    const response60987023 = await get<AggregateType.AttrsRefInfo[]>(`/api/Row/list-by-keyword-x218859120e2951a46aa6ad9fb9e627cc`, {})
    data22134203.TargetCell = response60987023.ok ? response60987023.data[0].__instanceKey : undefined
    const response95304280 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data22134203.TargetRowType = response95304280.ok ? response95304280.data[0].__instanceKey : undefined
    const response49062520 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data22134203.TargetColumn = response49062520.ok ? response49062520.data[0].__instanceKey : undefined
    
    
    const response92870762 = await post<AggregateType.CommentSaveCommand>(`/api/Comment/create`, data22134203)
    if (!response92870762.ok) return false
    
    const data14805626 = AggregateType.createComment()
    
    data14805626.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data14805626.Author = 'OOOOOOOOOO'
    data14805626.Indent = 225402
    data14805626.Order = 618181
    data14805626.CreatedOn = '2000-01-16'
    data14805626.UpdatedOn = '2002-12-18'
    const response85048494 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data14805626.TargetRow = response85048494.ok ? response85048494.data[1].__instanceKey : undefined
    const response06230841 = await get<AggregateType.AttrsRefInfo[]>(`/api/Row/list-by-keyword-x218859120e2951a46aa6ad9fb9e627cc`, {})
    data14805626.TargetCell = response06230841.ok ? response06230841.data[1].__instanceKey : undefined
    const response28164725 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data14805626.TargetRowType = response28164725.ok ? response28164725.data[1].__instanceKey : undefined
    const response70497588 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data14805626.TargetColumn = response70497588.ok ? response70497588.data[1].__instanceKey : undefined
    
    
    const response67761153 = await post<AggregateType.CommentSaveCommand>(`/api/Comment/create`, data14805626)
    if (!response67761153.ok) return false
    
    const data95858033 = AggregateType.createComment()
    
    data95858033.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data95858033.Author = 'KKKKKKKKKK'
    data95858033.Indent = 522739
    data95858033.Order = 280325
    data95858033.CreatedOn = '2004-02-28'
    data95858033.UpdatedOn = '2004-05-13'
    const response05700839 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data95858033.TargetRow = response05700839.ok ? response05700839.data[2].__instanceKey : undefined
    const response28055362 = await get<AggregateType.AttrsRefInfo[]>(`/api/Row/list-by-keyword-x218859120e2951a46aa6ad9fb9e627cc`, {})
    data95858033.TargetCell = response28055362.ok ? response28055362.data[2].__instanceKey : undefined
    const response49607875 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data95858033.TargetRowType = response49607875.ok ? response49607875.data[2].__instanceKey : undefined
    const response84641548 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data95858033.TargetColumn = response84641548.ok ? response84641548.data[2].__instanceKey : undefined
    
    
    const response98881239 = await post<AggregateType.CommentSaveCommand>(`/api/Comment/create`, data95858033)
    if (!response98881239.ok) return false
    
    const data61315786 = AggregateType.createComment()
    
    data61315786.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data61315786.Author = 'TTTTTTTTTT'
    data61315786.Indent = 401875
    data61315786.Order = 933391
    data61315786.CreatedOn = '2001-01-27'
    data61315786.UpdatedOn = '2005-09-29'
    const response61540854 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data61315786.TargetRow = response61540854.ok ? response61540854.data[3].__instanceKey : undefined
    const response83056790 = await get<AggregateType.AttrsRefInfo[]>(`/api/Row/list-by-keyword-x218859120e2951a46aa6ad9fb9e627cc`, {})
    data61315786.TargetCell = response83056790.ok ? response83056790.data[3].__instanceKey : undefined
    const response68512655 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data61315786.TargetRowType = response68512655.ok ? response68512655.data[3].__instanceKey : undefined
    const response56974247 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data61315786.TargetColumn = response56974247.ok ? response56974247.data[3].__instanceKey : undefined
    
    
    const response10415865 = await post<AggregateType.CommentSaveCommand>(`/api/Comment/create`, data61315786)
    if (!response10415865.ok) return false
    
    const data17276762 = AggregateType.createLog()
    
    data17276762.LogTime = '2005-01-01'
    data17276762.UpdatedObject = 'GGGGGGGGGG'
    data17276762.UpdateType = 'ZZZZZZZZZZ'
    data17276762.RowIdOrRowTypeId = 'OOOOOOOOOO'
    data17276762.Content = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    
    
    const response18453276 = await post<AggregateType.LogSaveCommand>(`/api/Log/create`, data17276762)
    if (!response18453276.ok) return false
    
    const data06343665 = AggregateType.createLog()
    
    data06343665.LogTime = '2006-12-02'
    data06343665.UpdatedObject = 'OOOOOOOOOO'
    data06343665.UpdateType = 'QQQQQQQQQQ'
    data06343665.RowIdOrRowTypeId = 'NNNNNNNNNN'
    data06343665.Content = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    
    
    const response26368373 = await post<AggregateType.LogSaveCommand>(`/api/Log/create`, data06343665)
    if (!response26368373.ok) return false
    
    const data97012727 = AggregateType.createLog()
    
    data97012727.LogTime = '2004-03-18'
    data97012727.UpdatedObject = 'EEEEEEEEEE'
    data97012727.UpdateType = 'VVVVVVVVVV'
    data97012727.RowIdOrRowTypeId = 'QQQQQQQQQQ'
    data97012727.Content = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    
    
    const response07770919 = await post<AggregateType.LogSaveCommand>(`/api/Log/create`, data97012727)
    if (!response07770919.ok) return false
    
    const data57539339 = AggregateType.createLog()
    
    data57539339.LogTime = '2005-07-10'
    data57539339.UpdatedObject = 'ZZZZZZZZZZ'
    data57539339.UpdateType = 'HHHHHHHHHH'
    data57539339.RowIdOrRowTypeId = 'BBBBBBBBBB'
    data57539339.Content = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    
    
    const response55286183 = await post<AggregateType.LogSaveCommand>(`/api/Log/create`, data57539339)
    if (!response55286183.ok) return false
    

    return true
  }, [post])
}
