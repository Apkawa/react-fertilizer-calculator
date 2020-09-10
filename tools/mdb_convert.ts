
// mdb-tables
// mdb-export original/base.mdb T_sostav_udobra |less

import {exec} from "child_process";
import * as path from "path";

const db_path = path.resolve('original/base.mdb')
type Nullable<T> = T | null
type AnyObject = {[key:  string]: Nullable<string>}
type TableInfo<T> = {[key: number]: T}

interface T_element {
  id_element: number,
  Smallname_element: string,
  fullname_element: string,
  id_kof: Nullable<number>,
  kof: number,
}

function parse_csv<T=AnyObject>(csv: string): TableInfo<T> {

  const lines = csv.split("\n");

  const result: TableInfo<T>= {};

  const headers = lines.splice(0, 1)[0].split(",");

  for(let line of lines){
    const current_line = line.split(",");
    const pairs = headers.map((h, i) => {
        let value: Nullable<string> = current_line[i]
        try {
          value = value && JSON.parse(value)
        } catch (e) {
          console.error(e)
        }
        if (value === '') {
          value = null
        }
        return [h, value || null]
      })
    const primaryId = parseInt(pairs[0][1] || "0")
    const obj: T = Object.fromEntries(
      pairs
    ) as any as T
    result[primaryId] = obj
  }
  return result
}

function fetchTableData<T=AnyObject>(tableName: string): Promise<TableInfo<T>> {
  return new  Promise((resolve, reject) => {
    exec(`mdb-export ${db_path} ${tableName}`, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      resolve(parse_csv<T>(stdout))
    })
  })
}


for (let t of 'T_element T_sostav_udobra T_udobra t_kof'.split(' ')) {
  fetchTableData(t).then(result => console.log(JSON.stringify(result)))
}

exec("mdb-tables " + db_path, (err, stdout, stderr) => {
  if (err) {
    console.error(err.message)
    return
  }
  console.log(stdout)
})

export {}
