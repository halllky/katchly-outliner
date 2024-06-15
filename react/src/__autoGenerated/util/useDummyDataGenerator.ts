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
    
    const response81732535 = await post<AggregateType.RowTypeSaveCommand>(`/api/RowType/create`, data72624326)
    if (!response81732535.ok) return false
    
    const data97754974 = AggregateType.createRowType()
    
    data97754974.RowTypeName = 'HHHHHHHHHH'
    
    data97754974.CreatedOn = '2003-11-02'
    data97754974.CreateUser = 'QQQQQQQQQQ'
    data97754974.UpdatedOn = '2003-11-09'
    data97754974.UpdateUser = 'ZZZZZZZZZZ'
    
    data97754974.Columns = [AggregateType.createColumns()]
    
    data97754974.Columns[0].ColumnName = 'AAAAAAAAAA'
    
    const response27370445 = await post<AggregateType.RowTypeSaveCommand>(`/api/RowType/create`, data97754974)
    if (!response27370445.ok) return false
    
    const data86237014 = AggregateType.createRowType()
    
    data86237014.RowTypeName = 'RRRRRRRRRR'
    
    data86237014.CreatedOn = '2002-08-01'
    data86237014.CreateUser = 'VVVVVVVVVV'
    data86237014.UpdatedOn = '2006-12-19'
    data86237014.UpdateUser = 'ZZZZZZZZZZ'
    
    data86237014.Columns = [AggregateType.createColumns()]
    
    data86237014.Columns[0].ColumnName = 'AAAAAAAAAA'
    
    const response99534707 = await post<AggregateType.RowTypeSaveCommand>(`/api/RowType/create`, data86237014)
    if (!response99534707.ok) return false
    
    const data69994197 = AggregateType.createRowType()
    
    data69994197.RowTypeName = 'YYYYYYYYYY'
    
    data69994197.CreatedOn = '2005-08-24'
    data69994197.CreateUser = 'OOOOOOOOOO'
    data69994197.UpdatedOn = '2000-08-31'
    data69994197.UpdateUser = 'EEEEEEEEEE'
    
    data69994197.Columns = [AggregateType.createColumns()]
    
    data69994197.Columns[0].ColumnName = 'LLLLLLLLLL'
    
    const response52628413 = await post<AggregateType.RowTypeSaveCommand>(`/api/RowType/create`, data69994197)
    if (!response52628413.ok) return false
    
    const data29717186 = AggregateType.createRow()
    
    data29717186.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    const response64269746 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data29717186.RowType = response64269746.ok ? response64269746.data[0].__instanceKey : undefined
    
    data29717186.Indent = 762962
    data29717186.CreatedOn = '2000-04-01'
    data29717186.CreateUser = 'JJJJJJJJJJ'
    data29717186.UpdatedOn = '2002-10-26'
    data29717186.UpdateUser = 'YYYYYYYYYY'
    
    data29717186.Attrs = [AggregateType.createAttrs()]
    const response50512920 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data29717186.Attrs[0].ColType = response50512920.ok ? response50512920.data[0].__instanceKey : undefined
    data29717186.Attrs[0].Value = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data29717186.Attrs[0].UpdatedOn = '2005-11-17'
    
    const response98854376 = await post<AggregateType.RowSaveCommand>(`/api/Row/create`, data29717186)
    if (!response98854376.ok) return false
    
    const data11895772 = AggregateType.createRow()
    
    data11895772.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    const response90709794 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data11895772.RowType = response90709794.ok ? response90709794.data[1].__instanceKey : undefined
    
    data11895772.Indent = 794764
    data11895772.CreatedOn = '2002-10-08'
    data11895772.CreateUser = 'LLLLLLLLLL'
    data11895772.UpdatedOn = '2001-03-16'
    data11895772.UpdateUser = 'FFFFFFFFFF'
    
    data11895772.Attrs = [AggregateType.createAttrs()]
    const response41007327 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data11895772.Attrs[0].ColType = response41007327.ok ? response41007327.data[1].__instanceKey : undefined
    data11895772.Attrs[0].Value = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data11895772.Attrs[0].UpdatedOn = '2005-11-26'
    
    const response27345148 = await post<AggregateType.RowSaveCommand>(`/api/Row/create`, data11895772)
    if (!response27345148.ok) return false
    
    const data61983027 = AggregateType.createRow()
    
    data61983027.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    const response19491343 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data61983027.RowType = response19491343.ok ? response19491343.data[2].__instanceKey : undefined
    
    data61983027.Indent = 878190
    data61983027.CreatedOn = '2006-10-12'
    data61983027.CreateUser = 'TTTTTTTTTT'
    data61983027.UpdatedOn = '2007-01-18'
    data61983027.UpdateUser = 'RRRRRRRRRR'
    
    data61983027.Attrs = [AggregateType.createAttrs()]
    const response62486612 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data61983027.Attrs[0].ColType = response62486612.ok ? response62486612.data[2].__instanceKey : undefined
    data61983027.Attrs[0].Value = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data61983027.Attrs[0].UpdatedOn = '2001-10-17'
    
    const response48796804 = await post<AggregateType.RowSaveCommand>(`/api/Row/create`, data61983027)
    if (!response48796804.ok) return false
    
    const data89536243 = AggregateType.createRow()
    
    data89536243.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    const response08657988 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data89536243.RowType = response08657988.ok ? response08657988.data[3].__instanceKey : undefined
    
    data89536243.Indent = 838578
    data89536243.CreatedOn = '2001-05-25'
    data89536243.CreateUser = 'QQQQQQQQQQ'
    data89536243.UpdatedOn = '2006-10-16'
    data89536243.UpdateUser = 'FFFFFFFFFF'
    
    data89536243.Attrs = [AggregateType.createAttrs()]
    const response99997268 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data89536243.Attrs[0].ColType = response99997268.ok ? response99997268.data[3].__instanceKey : undefined
    data89536243.Attrs[0].Value = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data89536243.Attrs[0].UpdatedOn = '2003-12-15'
    
    const response89643979 = await post<AggregateType.RowSaveCommand>(`/api/Row/create`, data89536243)
    if (!response89643979.ok) return false
    
    const data65220523 = AggregateType.createRowOrder()
    const response80946257 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data65220523.Row = response80946257.ok ? response80946257.data[0].__instanceKey : undefined
    data65220523.Order = 100935.72
    
    
    const response71972597 = await post<AggregateType.RowOrderSaveCommand>(`/api/RowOrder/create`, data65220523)
    if (!response71972597.ok) return false
    
    const data71845068 = AggregateType.createRowOrder()
    const response90517638 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data71845068.Row = response90517638.ok ? response90517638.data[1].__instanceKey : undefined
    data71845068.Order = 189123.47
    
    
    const response12552724 = await post<AggregateType.RowOrderSaveCommand>(`/api/RowOrder/create`, data71845068)
    if (!response12552724.ok) return false
    
    const data54079523 = AggregateType.createRowOrder()
    const response67103666 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data54079523.Row = response67103666.ok ? response67103666.data[2].__instanceKey : undefined
    data54079523.Order = 468397.82
    
    
    const response32550069 = await post<AggregateType.RowOrderSaveCommand>(`/api/RowOrder/create`, data54079523)
    if (!response32550069.ok) return false
    
    const data80920380 = AggregateType.createRowOrder()
    const response76450597 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data80920380.Row = response76450597.ok ? response76450597.data[3].__instanceKey : undefined
    data80920380.Order = 937539.29
    
    
    const response79363033 = await post<AggregateType.RowOrderSaveCommand>(`/api/RowOrder/create`, data80920380)
    if (!response79363033.ok) return false
    
    const data52278529 = AggregateType.createComment()
    
    data52278529.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data52278529.Author = 'IIIIIIIIII'
    data52278529.Indent = 286722
    data52278529.Order = 820609
    data52278529.CreatedOn = '2001-10-29'
    data52278529.UpdatedOn = '2001-07-14'
    data52278529.Target = 'CommentTargetRow'
    
    
    
    
    
    data52278529.CommentTargetRow = AggregateType.createCommentTargetRow()
    const response62462275 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data52278529.CommentTargetRow.Row = response62462275.ok ? response62462275.data[0].__instanceKey : undefined
    data52278529.CommentTargetCell = AggregateType.createCommentTargetCell()
    const response69304503 = await get<AggregateType.AttrsRefInfo[]>(`/api/Row/list-by-keyword-x218859120e2951a46aa6ad9fb9e627cc`, {})
    data52278529.CommentTargetCell.Cell = response69304503.ok ? response69304503.data[0].__instanceKey : undefined
    data52278529.CommentTargetRowType = AggregateType.createCommentTargetRowType()
    const response63039437 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data52278529.CommentTargetRowType.RowType = response63039437.ok ? response63039437.data[0].__instanceKey : undefined
    data52278529.CommentTargetColumn = AggregateType.createCommentTargetColumn()
    const response92763736 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data52278529.CommentTargetColumn.Column = response92763736.ok ? response92763736.data[0].__instanceKey : undefined
    
    const response66339282 = await post<AggregateType.CommentSaveCommand>(`/api/Comment/create`, data52278529)
    if (!response66339282.ok) return false
    
    const data22134203 = AggregateType.createComment()
    
    data22134203.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data22134203.Author = 'BBBBBBBBBB'
    data22134203.Indent = 900103
    data22134203.Order = 678504
    data22134203.CreatedOn = '2000-10-08'
    data22134203.UpdatedOn = '2001-03-23'
    data22134203.Target = 'CommentTargetRow'
    
    
    
    
    
    data22134203.CommentTargetRow = AggregateType.createCommentTargetRow()
    const response60987023 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data22134203.CommentTargetRow.Row = response60987023.ok ? response60987023.data[1].__instanceKey : undefined
    data22134203.CommentTargetCell = AggregateType.createCommentTargetCell()
    const response95304280 = await get<AggregateType.AttrsRefInfo[]>(`/api/Row/list-by-keyword-x218859120e2951a46aa6ad9fb9e627cc`, {})
    data22134203.CommentTargetCell.Cell = response95304280.ok ? response95304280.data[1].__instanceKey : undefined
    data22134203.CommentTargetRowType = AggregateType.createCommentTargetRowType()
    const response49062520 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data22134203.CommentTargetRowType.RowType = response49062520.ok ? response49062520.data[1].__instanceKey : undefined
    data22134203.CommentTargetColumn = AggregateType.createCommentTargetColumn()
    const response14805626 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data22134203.CommentTargetColumn.Column = response14805626.ok ? response14805626.data[1].__instanceKey : undefined
    
    const response92870762 = await post<AggregateType.CommentSaveCommand>(`/api/Comment/create`, data22134203)
    if (!response92870762.ok) return false
    
    const data67761153 = AggregateType.createComment()
    
    data67761153.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data67761153.Author = 'FFFFFFFFFF'
    data67761153.Indent = 618181
    data67761153.Order = 5082
    data67761153.CreatedOn = '2002-12-18'
    data67761153.UpdatedOn = '2006-12-26'
    data67761153.Target = 'CommentTargetRow'
    
    
    
    
    
    data67761153.CommentTargetRow = AggregateType.createCommentTargetRow()
    const response28164725 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data67761153.CommentTargetRow.Row = response28164725.ok ? response28164725.data[2].__instanceKey : undefined
    data67761153.CommentTargetCell = AggregateType.createCommentTargetCell()
    const response70497588 = await get<AggregateType.AttrsRefInfo[]>(`/api/Row/list-by-keyword-x218859120e2951a46aa6ad9fb9e627cc`, {})
    data67761153.CommentTargetCell.Cell = response70497588.ok ? response70497588.data[2].__instanceKey : undefined
    data67761153.CommentTargetRowType = AggregateType.createCommentTargetRowType()
    const response95858033 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data67761153.CommentTargetRowType.RowType = response95858033.ok ? response95858033.data[2].__instanceKey : undefined
    data67761153.CommentTargetColumn = AggregateType.createCommentTargetColumn()
    const response98881239 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data67761153.CommentTargetColumn.Column = response98881239.ok ? response98881239.data[2].__instanceKey : undefined
    
    const response56986173 = await post<AggregateType.CommentSaveCommand>(`/api/Comment/create`, data67761153)
    if (!response56986173.ok) return false
    
    const data38713694 = AggregateType.createComment()
    
    data38713694.Text = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    data38713694.Author = 'HHHHHHHHHH'
    data38713694.Indent = 506575
    data38713694.Order = 531578
    data38713694.CreatedOn = '2000-06-20'
    data38713694.UpdatedOn = '2002-04-21'
    data38713694.Target = 'CommentTargetCell'
    
    
    
    
    
    data38713694.CommentTargetRow = AggregateType.createCommentTargetRow()
    const response84641548 = await get<AggregateType.RowRefInfo[]>(`/api/Row/list-by-keyword`, {})
    data38713694.CommentTargetRow.Row = response84641548.ok ? response84641548.data[3].__instanceKey : undefined
    data38713694.CommentTargetCell = AggregateType.createCommentTargetCell()
    const response61315786 = await get<AggregateType.AttrsRefInfo[]>(`/api/Row/list-by-keyword-x218859120e2951a46aa6ad9fb9e627cc`, {})
    data38713694.CommentTargetCell.Cell = response61315786.ok ? response61315786.data[3].__instanceKey : undefined
    data38713694.CommentTargetRowType = AggregateType.createCommentTargetRowType()
    const response10415865 = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, {})
    data38713694.CommentTargetRowType.RowType = response10415865.ok ? response10415865.data[3].__instanceKey : undefined
    data38713694.CommentTargetColumn = AggregateType.createCommentTargetColumn()
    const response74232903 = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, {})
    data38713694.CommentTargetColumn.Column = response74232903.ok ? response74232903.data[3].__instanceKey : undefined
    
    const response52274014 = await post<AggregateType.CommentSaveCommand>(`/api/Comment/create`, data38713694)
    if (!response52274014.ok) return false
    
    const data40187614 = AggregateType.createLog()
    
    data40187614.LogTime = '2001-01-27'
    data40187614.UpdatedObject = 'SSSSSSSSSS'
    data40187614.UpdateType = 'QQQQQQQQQQ'
    data40187614.RowIdOrRowTypeId = 'VVVVVVVVVV'
    data40187614.Content = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    
    
    const response93339259 = await post<AggregateType.LogSaveCommand>(`/api/Log/create`, data40187614)
    if (!response93339259.ok) return false
    
    const data68512655 = AggregateType.createLog()
    
    data68512655.LogTime = '2001-06-02'
    data68512655.UpdatedObject = 'EEEEEEEEEE'
    data68512655.UpdateType = 'PPPPPPPPPP'
    data68512655.RowIdOrRowTypeId = 'GGGGGGGGGG'
    data68512655.Content = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    
    
    const response56974247 = await post<AggregateType.LogSaveCommand>(`/api/Log/create`, data68512655)
    if (!response56974247.ok) return false
    
    const data99711478 = AggregateType.createLog()
    
    data99711478.LogTime = '2000-07-09'
    data99711478.UpdatedObject = 'GGGGGGGGGG'
    data99711478.UpdateType = 'VVVVVVVVVV'
    data99711478.RowIdOrRowTypeId = 'OOOOOOOOOO'
    data99711478.Content = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    
    
    const response56868945 = await post<AggregateType.LogSaveCommand>(`/api/Log/create`, data99711478)
    if (!response56868945.ok) return false
    
    const data64599010 = AggregateType.createLog()
    
    data64599010.LogTime = '2007-12-20'
    data64599010.UpdatedObject = 'CCCCCCCCCC'
    data64599010.UpdateType = 'NNNNNNNNNN'
    data64599010.RowIdOrRowTypeId = 'EEEEEEEEEE'
    data64599010.Content = 'XXXXXXXXXXXXXX\nXXXXXXXXXXXXXX'
    
    
    const response51636614 = await post<AggregateType.LogSaveCommand>(`/api/Log/create`, data64599010)
    if (!response51636614.ok) return false
    

    return true
  }, [post])
}
