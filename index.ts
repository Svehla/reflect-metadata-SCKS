import * as yup from 'yup'

// Data transformations utils
export const mapEntries = <Key extends string | number, V, RetKey extends string | number, RV>(
  fn: (a: [Key, V]) => [RetKey, RV],
  obj: Record<Key, V>
) => Object.fromEntries(Object.entries(obj).map(fn as any)) as Record<RetKey, RV>


// type-utils 
export type SchemaArr = {
  type: 'array'
  required?: boolean
  items: Schema
}

export type SchemaObject = {
  type: 'object'
  required?: boolean
  properties: Record<string, Schema>
  // what about to add required fields?
  // what about to add nullable as can be null? (not undefined) & required is equal for `undefined`
  // > https://stackoverflow.com/a/40113571
  // TODO: rename to required? to be consistent with OPEN-API spec?
  requiredKeys?: string[]
}

type SchemaBoolean = {
  type: 'boolean'
  required?: boolean
}
type SchemaString = {
  type: 'string'
  required?: boolean
}
type SchemaNumber = {
  type: 'number'
  required?: boolean
}

export type Schema = SchemaArr | SchemaObject | SchemaString | SchemaNumber | SchemaBoolean

type NiceMerge<T, U, T0 = T & U, T1 = { [K in keyof T0]: T0[K] }> = T1

type MakeOptional<T, Required extends boolean> = Required extends true ? T | undefined : T

export type InferSchemaType<T extends Schema> = T extends {
  type: 'object'
  properties: infer U
  requiredKeys?: any
}
  ? T['requiredKeys'] extends string[]
    ? NiceMerge<
        // @ts-expect-error
        { [K in keyof Omit<U, T['requiredKeys'][number]>]?: InferSchemaType<U[K]> },
        // @ts-expect-error
        { [K in T['requiredKeys'][number]]: InferSchemaType<U[K]> }
      >
    : // @ts-expect-error
      { [K in keyof U]: InferSchemaType<U[K]> }
  : T extends { type: 'array'; items: any }
  ? // @ts-expect-error
    MakeOptional<InferSchemaType<T['items']>[], T['required']>
  : T extends { type: 'boolean' }
  ? // @ts-expect-error
    MakeOptional<boolean, T['required']>
  : T extends { type: 'string' }
  ? // @ts-expect-error
    MakeOptional<string, T['required']>
  : T extends { type: 'number' }
  ? // @ts-expect-error
    MakeOptional<number, T['required']>
  : never



// define schema

const mySchema = {
  type: 'object' as const,
  properties: {
    key1: {
      type: 'number' as const,
      required: true as const,
    },
    key2: {
      type: 'string' as const,
      required: false,
    },
  },
  requiredKeys: [],
  required: false,
}


type MySchemaType = InferSchemaType<typeof mySchema>

// Runtime validation against the schema

export const convertSchemaToYupValidationObject = (schema: Schema): any => {
  switch (schema?.type) {
    case 'array': {
      const yupArr = yup.array().of(convertSchemaToYupValidationObject(schema.items))
      return schema.required ? yupArr.required() : yupArr
    }
    case 'object': {
      // TODO: possible infinite TS recursion while inferring return type
      const yupObj: any = yup.object(
        mapEntries(([k, v]) => [k, convertSchemaToYupValidationObject(v) as any], schema.properties)
      )
      return schema.required ? yupObj.required() : yupObj
    }
    case 'boolean':
      return schema.required ? yup.boolean().required() : yup.boolean()
    case 'number':
      return schema.required ? yup.number().required() : yup.number()
    case 'string':
      return schema.required ? yup.string().required() : yup.string()
    default:
      throw new Error(`unsupported type ${(schema as any)?.type}`)
  }
}

export const validateBySchema = (schema: Schema, value: any) => {
  return convertSchemaToYupValidationObject(schema).isValidSync(value)
}


const isValid = validateBySchema(
  mySchema,
  {
    key1: 'value1',
    key2: 'value2'
  }
)