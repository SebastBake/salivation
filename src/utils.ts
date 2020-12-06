export type Entry<
  T extends ReadonlyArray<any> | undefined
> = T extends ReadonlyArray<infer U> ? U : never

export type JsonPrimitive = string | number | null | boolean | undefined

export type JsonArr = Array<Json>

export type JsonObj = { [key: string]: Json }

export type Json = JsonArr | JsonObj | JsonPrimitive
