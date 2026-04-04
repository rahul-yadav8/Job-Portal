import { format as formatDate, parseISO, parse, isValid } from 'date-fns'

/**
 * Omits properties from a type
 * @template T Object
 * @template K Union of T keys
 */
export type Omit<T, U> = T extends any ? Pick<T, Exclude<keyof T, U>> : never

/**
 * Merge two types into a new type. Keys of the second type overrides keys of the first type.
 *
 * @template FirstType - The first type
 * @template SecondType - The second type
 */
export type Merge<FirstType, SecondType> = Omit<FirstType, keyof SecondType> & SecondType

/**
 * Changes a type's properties to all be mutable
 * @template T - Class, type, or interface to make mutable
 */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] }

/**
 * Converts a class (or other object types) to a normal TS type.
 *
 * This is useful for utilizing Nest DTOs and Typegoose classes in frontend
 * code. The resulting type should not be compiled, whereas classes would.
 * @template T - Class to convert
 */
export type ClassToType<T> = Mutable<{ [P in keyof T]: T[P] }>

/**
 * Makes all of properties of a type definition required except for the
 * properties specified that are optional
 *
 * @template T - Class, type, or interface
 * @template K - Property names to make partial
 */
export type RequiredWithPartial<T, K extends keyof T> = Required<Pick<T, Exclude<keyof T, K>>> &
  Partial<Pick<T, Extract<keyof T, K>>>

/**
 * Makes all of properties of a type definition optional except for the
 * properties specified that are required
 *
 * @template T - Class, type, or interface
 * @template K - Property names to make required
 */
export type PartialWithRequired<T, K extends keyof T> = Partial<Pick<T, Exclude<keyof T, K>>> &
  Required<Pick<T, Extract<keyof T, K>>>

/**
 * Allows overriding the return type of a function type
 *
 * @template Fn - Function type to override
 * @template R - The new return type
 */
export type OverrideReturn<Fn, R> = Fn extends (...a: infer A) => any ? (...a: A) => R : never

/**
 * Dynamically adds a field to an object type
 *
 * @template FieldName - Name of the field to add
 * @template ValueType - The value type that the field supports
 *
 * @example
 * type User = { id: number, name: string };
 * type UserWithAge = Merge<User, DynamicField<"age", number>>;
 *
 * @example
 * function addField<Document, FieldName extends string, FieldValue>(
 *   document: Document,
 *   field: FieldName,
 *   value: FieldValue
 * ): Merge<Document, DynamicField<FieldName, FieldValue>> {
 *   return { ...document, [field]: value };
 * }
 *
 * const user: User = { id: 1, name: "Sam" };
 *
 * addField(user, "age", 1); // Produces Merge<User, { age: number }>
 * addField(user, "address", "123 Sesame St") // Produces Merge<User, { address: string }>
 */
export type DynamicField<FieldName extends string, ValueType> = {
  [f in FieldName]: ValueType
}

/**
 * Make a type and all of its sub-properties optional
 *
 * @template T - The type to apply Partial deeply to
 */
export type DeepPartial<T> = T extends any[]
  ? DeepPartialArray<T[number]>
  : T extends object
  ? DeepPartialObject<T>
  : T

interface DeepPartialArray<T> extends Array<DeepPartial<T>> { }

type DeepPartialObject<T> = { [P in keyof T]+?: DeepPartial<T[P]> }

/**
 * Matches standard JS falsey values
 */
export type FalseyValue = undefined | null | false

/**
 * Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).
 */
export type Primitive = null | undefined | string | number | boolean | symbol

/**
  Allows creating a union type by combining primitive types and literal types without sacrificing auto-completion in IDEs for the literal type part of the union.
  Currently, when a union type of a primitive type is combined with literal types, TypeScript loses all information about the combined literals. Thus, when such type is used in an IDE with autocompletion, no suggestions are made for the declared literals.
  This type is a workaround for [Microsoft/TypeScript#29729](https://github.com/Microsoft/TypeScript/issues/29729). It will be removed as soon as it's not needed anymore.
  @example
  ```
  // Before
  type Pet = 'dog' | 'cat' | string;
  const pet: Pet = '';
  // Start typing in your TypeScript-enabled IDE.
  // You **will not** get auto-completion for `dog` and `cat` literals.
  // After
  type Pet2 = LiteralUnion<'dog' | 'cat', string>;
  const pet: Pet2 = '';
  // You **will** get auto-completion for `dog` and `cat` literals.
  ```
   */
export type LiteralUnion<LiteralType extends BaseType, BaseType extends Primitive> =
  | LiteralType
  | (BaseType & { _?: never })

export const makeRandomString = (length: number) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

export const returnISODateStringtoRelativeTime = (dateString: string) => {
  if (!dateString) return '--'
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)
  if (diffInHours < 1) {
    return `${Math.floor(diffInHours)} mins ago`
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hrs ago`
  } else if (diffInHours < 24 * 7) {
    return `${Math.floor(diffInHours / 24)} days ago`
  } else if (diffInHours < 24 * 30) {
    return `${Math.floor(diffInHours / (24 * 7))} weeks ago`
  } else {
    return `${Math.floor(diffInHours / (24 * 30))} months ago`
  }
}

// export const returnISODateStringtoDateFormat = (
//   dateString: string,
//   format: string = 'dd MMM yyyy'
// ): string => {
//   if (!dateString) return '--'
//   try {
//     const date = parseISO(dateString)
//     if (isNaN(date.getTime())) return '--'
//     return formatDate(date, format)
//   } catch {
//     return '--'
//   }
// }

// export const returnISODateStringtoDateTimeFormat = (
//   dateString: string,
//   format: string = 'dd MMM yyyy HH:mm'
// ): string => {
//   if (!dateString) return '--'
//   try {
//     const date = parseISO(dateString)
//     if (isNaN(date.getTime())) return '--'
//     return formatDate(date, format)
//   } catch {
//     return '--'
//   }
// }

export const returnISODateStringtoDateFormat = (
  dateString: string,
  format: string = 'dd MMM yyyy'
): string => {
  if (!dateString) return '--'
  try {
    let date = parseISO(dateString)
    if (!isValid(date)) {
      date = parse(dateString, 'dd-MMM-yy', new Date())
      if (!isValid(date)) return '--'
    }
    return formatDate(date, format)
  } catch {
    return '--'
  }
}

export const returnISODateStringtoDateTimeFormat = (
  dateString: string,
  format: string = 'dd MMM yyyy HH:mm'
): string => {
  if (!dateString) return '--'
  try {
    let date = parseISO(dateString)
    if (!isValid(date)) {
      date = parse(dateString, 'dd-MMM-yy', new Date())
      if (!isValid(date)) return '--'
    }
    return formatDate(date, format)
  } catch {
    return '--'
  }
}

export const returnISODateStringtoDateTimeSecFormat = (
  dateString: string,
  format: string = 'dd MMM yyyy HH:mm:ss'
): string => {
  if (!dateString) return '--'
  try {
    let date = parseISO(dateString)
    if (!isValid(date)) {
      date = parse(dateString, 'dd-MMM-yy', new Date())
      if (!isValid(date)) return '--'
    }
    return formatDate(date, format)
  } catch {
    return '--'
  }
}

export function getCriticalityColor(criticality: string): string {
  switch (criticality.toLowerCase()) {
    case 'critical':
      return 'bg-red-100 text-red-700'
    case 'medium':
      return 'bg-yellow-100 text-yellow-700'
    case 'low':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-700'
    case 'inactive':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export const getRelativeTime = (dateString: string) => {
  const now = new Date()
  const past = new Date(dateString)

  const diffMs = now.getTime() - past.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 1) return 'Today'
  if (diffDays < 7) return `${diffDays} Day${diffDays > 1 ? 's' : ''}`

  const weeks = Math.floor(diffDays / 7)
  if (weeks < 4) return `${weeks} Week${weeks > 1 ? 's' : ''}`

  const months = Math.floor(diffDays / 30)
  if (months < 12) return `${months} Month${months > 1 ? 's' : ''}`

  const years = Math.floor(diffDays / 365)
  return `${years} Year${years > 1 ? 's' : ''}`
}
