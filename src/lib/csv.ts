export interface IColumn {
  displayName?: string
  id: string
}

type ProperColumns = Array<string | IColumn>
export type Columns = ProperColumns | undefined | false
type Data = string[] | { [key: string]: string }
export type Datas = Data[]

const newLine = '\r\n'

const getColumnIdsFromColumns = (columns: ProperColumns) =>
  columns.map((v) => typeof v === 'string' ? v : v.id)

const getColumnIdsFromDatas = (datas: Datas) =>
  datas
    .filter((row): row is Exclude<Data, any[]> => !Array.isArray(row))
    .reduce((acc: string[], row) => acc.concat(Object.keys(row)), [])
    .filter((value, index, self) => self.indexOf(value) === index)

const getHeadersFromColumns = (columns: ProperColumns) =>
  columns.map((v) => {
    if (typeof v === 'string') {
      return v
    } else if (typeof v.displayName !== 'undefined') {
      return v.displayName
    }
    return v.id
  })

export default function csv(
  columns: Columns,
  datas: Datas,
  separator = ',',
  noHeader = false,
) {
  const columnOrder = columns
    ? getColumnIdsFromColumns(columns)
    : getColumnIdsFromDatas(datas)

  const content = []

  if (!noHeader && columnOrder.length > 0) {
    const headers = columns
      ? getHeadersFromColumns(columns)
      : columnOrder
    content.push(headers.join(separator))
  }

  if (Array.isArray(datas)) {
    datas
      .map((v) => Array.isArray(v)
        ? v
        : columnOrder.map((k) => typeof v[k] === 'undefined' ? '' : v[k]),
      )
      .forEach((v) => {
        content.push(v.join(separator))
      })
  }

  return content.join(newLine)
}
