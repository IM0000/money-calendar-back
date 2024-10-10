
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model OauthInfo
 * 
 */
export type OauthInfo = $Result.DefaultSelection<Prisma.$OauthInfoPayload>
/**
 * Model Company
 * 
 */
export type Company = $Result.DefaultSelection<Prisma.$CompanyPayload>
/**
 * Model Earnings
 * 
 */
export type Earnings = $Result.DefaultSelection<Prisma.$EarningsPayload>
/**
 * Model Dividend
 * 
 */
export type Dividend = $Result.DefaultSelection<Prisma.$DividendPayload>
/**
 * Model EconomicIndicator
 * 
 */
export type EconomicIndicator = $Result.DefaultSelection<Prisma.$EconomicIndicatorPayload>
/**
 * Model FavoriteEarnings
 * 
 */
export type FavoriteEarnings = $Result.DefaultSelection<Prisma.$FavoriteEarningsPayload>
/**
 * Model FavoriteDividends
 * 
 */
export type FavoriteDividends = $Result.DefaultSelection<Prisma.$FavoriteDividendsPayload>
/**
 * Model FavoriteIndicator
 * 
 */
export type FavoriteIndicator = $Result.DefaultSelection<Prisma.$FavoriteIndicatorPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.oauthInfo`: Exposes CRUD operations for the **OauthInfo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OauthInfos
    * const oauthInfos = await prisma.oauthInfo.findMany()
    * ```
    */
  get oauthInfo(): Prisma.OauthInfoDelegate<ExtArgs>;

  /**
   * `prisma.company`: Exposes CRUD operations for the **Company** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Companies
    * const companies = await prisma.company.findMany()
    * ```
    */
  get company(): Prisma.CompanyDelegate<ExtArgs>;

  /**
   * `prisma.earnings`: Exposes CRUD operations for the **Earnings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Earnings
    * const earnings = await prisma.earnings.findMany()
    * ```
    */
  get earnings(): Prisma.EarningsDelegate<ExtArgs>;

  /**
   * `prisma.dividend`: Exposes CRUD operations for the **Dividend** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dividends
    * const dividends = await prisma.dividend.findMany()
    * ```
    */
  get dividend(): Prisma.DividendDelegate<ExtArgs>;

  /**
   * `prisma.economicIndicator`: Exposes CRUD operations for the **EconomicIndicator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EconomicIndicators
    * const economicIndicators = await prisma.economicIndicator.findMany()
    * ```
    */
  get economicIndicator(): Prisma.EconomicIndicatorDelegate<ExtArgs>;

  /**
   * `prisma.favoriteEarnings`: Exposes CRUD operations for the **FavoriteEarnings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FavoriteEarnings
    * const favoriteEarnings = await prisma.favoriteEarnings.findMany()
    * ```
    */
  get favoriteEarnings(): Prisma.FavoriteEarningsDelegate<ExtArgs>;

  /**
   * `prisma.favoriteDividends`: Exposes CRUD operations for the **FavoriteDividends** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FavoriteDividends
    * const favoriteDividends = await prisma.favoriteDividends.findMany()
    * ```
    */
  get favoriteDividends(): Prisma.FavoriteDividendsDelegate<ExtArgs>;

  /**
   * `prisma.favoriteIndicator`: Exposes CRUD operations for the **FavoriteIndicator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FavoriteIndicators
    * const favoriteIndicators = await prisma.favoriteIndicator.findMany()
    * ```
    */
  get favoriteIndicator(): Prisma.FavoriteIndicatorDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.19.0
   * Query Engine version: 5fe21811a6ba0b952a3bc71400666511fe3b902f
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    OauthInfo: 'OauthInfo',
    Company: 'Company',
    Earnings: 'Earnings',
    Dividend: 'Dividend',
    EconomicIndicator: 'EconomicIndicator',
    FavoriteEarnings: 'FavoriteEarnings',
    FavoriteDividends: 'FavoriteDividends',
    FavoriteIndicator: 'FavoriteIndicator'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "oauthInfo" | "company" | "earnings" | "dividend" | "economicIndicator" | "favoriteEarnings" | "favoriteDividends" | "favoriteIndicator"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      OauthInfo: {
        payload: Prisma.$OauthInfoPayload<ExtArgs>
        fields: Prisma.OauthInfoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OauthInfoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OauthInfoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OauthInfoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OauthInfoPayload>
          }
          findFirst: {
            args: Prisma.OauthInfoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OauthInfoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OauthInfoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OauthInfoPayload>
          }
          findMany: {
            args: Prisma.OauthInfoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OauthInfoPayload>[]
          }
          create: {
            args: Prisma.OauthInfoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OauthInfoPayload>
          }
          createMany: {
            args: Prisma.OauthInfoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OauthInfoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OauthInfoPayload>[]
          }
          delete: {
            args: Prisma.OauthInfoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OauthInfoPayload>
          }
          update: {
            args: Prisma.OauthInfoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OauthInfoPayload>
          }
          deleteMany: {
            args: Prisma.OauthInfoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OauthInfoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OauthInfoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OauthInfoPayload>
          }
          aggregate: {
            args: Prisma.OauthInfoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOauthInfo>
          }
          groupBy: {
            args: Prisma.OauthInfoGroupByArgs<ExtArgs>
            result: $Utils.Optional<OauthInfoGroupByOutputType>[]
          }
          count: {
            args: Prisma.OauthInfoCountArgs<ExtArgs>
            result: $Utils.Optional<OauthInfoCountAggregateOutputType> | number
          }
        }
      }
      Company: {
        payload: Prisma.$CompanyPayload<ExtArgs>
        fields: Prisma.CompanyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findFirst: {
            args: Prisma.CompanyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findMany: {
            args: Prisma.CompanyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          create: {
            args: Prisma.CompanyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          createMany: {
            args: Prisma.CompanyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompanyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          delete: {
            args: Prisma.CompanyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          update: {
            args: Prisma.CompanyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          deleteMany: {
            args: Prisma.CompanyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CompanyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          aggregate: {
            args: Prisma.CompanyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompany>
          }
          groupBy: {
            args: Prisma.CompanyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanyCountArgs<ExtArgs>
            result: $Utils.Optional<CompanyCountAggregateOutputType> | number
          }
        }
      }
      Earnings: {
        payload: Prisma.$EarningsPayload<ExtArgs>
        fields: Prisma.EarningsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EarningsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EarningsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EarningsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EarningsPayload>
          }
          findFirst: {
            args: Prisma.EarningsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EarningsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EarningsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EarningsPayload>
          }
          findMany: {
            args: Prisma.EarningsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EarningsPayload>[]
          }
          create: {
            args: Prisma.EarningsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EarningsPayload>
          }
          createMany: {
            args: Prisma.EarningsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EarningsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EarningsPayload>[]
          }
          delete: {
            args: Prisma.EarningsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EarningsPayload>
          }
          update: {
            args: Prisma.EarningsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EarningsPayload>
          }
          deleteMany: {
            args: Prisma.EarningsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EarningsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EarningsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EarningsPayload>
          }
          aggregate: {
            args: Prisma.EarningsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEarnings>
          }
          groupBy: {
            args: Prisma.EarningsGroupByArgs<ExtArgs>
            result: $Utils.Optional<EarningsGroupByOutputType>[]
          }
          count: {
            args: Prisma.EarningsCountArgs<ExtArgs>
            result: $Utils.Optional<EarningsCountAggregateOutputType> | number
          }
        }
      }
      Dividend: {
        payload: Prisma.$DividendPayload<ExtArgs>
        fields: Prisma.DividendFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DividendFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DividendPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DividendFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DividendPayload>
          }
          findFirst: {
            args: Prisma.DividendFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DividendPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DividendFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DividendPayload>
          }
          findMany: {
            args: Prisma.DividendFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DividendPayload>[]
          }
          create: {
            args: Prisma.DividendCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DividendPayload>
          }
          createMany: {
            args: Prisma.DividendCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DividendCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DividendPayload>[]
          }
          delete: {
            args: Prisma.DividendDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DividendPayload>
          }
          update: {
            args: Prisma.DividendUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DividendPayload>
          }
          deleteMany: {
            args: Prisma.DividendDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DividendUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DividendUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DividendPayload>
          }
          aggregate: {
            args: Prisma.DividendAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDividend>
          }
          groupBy: {
            args: Prisma.DividendGroupByArgs<ExtArgs>
            result: $Utils.Optional<DividendGroupByOutputType>[]
          }
          count: {
            args: Prisma.DividendCountArgs<ExtArgs>
            result: $Utils.Optional<DividendCountAggregateOutputType> | number
          }
        }
      }
      EconomicIndicator: {
        payload: Prisma.$EconomicIndicatorPayload<ExtArgs>
        fields: Prisma.EconomicIndicatorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EconomicIndicatorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EconomicIndicatorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EconomicIndicatorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EconomicIndicatorPayload>
          }
          findFirst: {
            args: Prisma.EconomicIndicatorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EconomicIndicatorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EconomicIndicatorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EconomicIndicatorPayload>
          }
          findMany: {
            args: Prisma.EconomicIndicatorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EconomicIndicatorPayload>[]
          }
          create: {
            args: Prisma.EconomicIndicatorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EconomicIndicatorPayload>
          }
          createMany: {
            args: Prisma.EconomicIndicatorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EconomicIndicatorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EconomicIndicatorPayload>[]
          }
          delete: {
            args: Prisma.EconomicIndicatorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EconomicIndicatorPayload>
          }
          update: {
            args: Prisma.EconomicIndicatorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EconomicIndicatorPayload>
          }
          deleteMany: {
            args: Prisma.EconomicIndicatorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EconomicIndicatorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EconomicIndicatorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EconomicIndicatorPayload>
          }
          aggregate: {
            args: Prisma.EconomicIndicatorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEconomicIndicator>
          }
          groupBy: {
            args: Prisma.EconomicIndicatorGroupByArgs<ExtArgs>
            result: $Utils.Optional<EconomicIndicatorGroupByOutputType>[]
          }
          count: {
            args: Prisma.EconomicIndicatorCountArgs<ExtArgs>
            result: $Utils.Optional<EconomicIndicatorCountAggregateOutputType> | number
          }
        }
      }
      FavoriteEarnings: {
        payload: Prisma.$FavoriteEarningsPayload<ExtArgs>
        fields: Prisma.FavoriteEarningsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FavoriteEarningsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteEarningsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FavoriteEarningsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteEarningsPayload>
          }
          findFirst: {
            args: Prisma.FavoriteEarningsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteEarningsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FavoriteEarningsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteEarningsPayload>
          }
          findMany: {
            args: Prisma.FavoriteEarningsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteEarningsPayload>[]
          }
          create: {
            args: Prisma.FavoriteEarningsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteEarningsPayload>
          }
          createMany: {
            args: Prisma.FavoriteEarningsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FavoriteEarningsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteEarningsPayload>[]
          }
          delete: {
            args: Prisma.FavoriteEarningsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteEarningsPayload>
          }
          update: {
            args: Prisma.FavoriteEarningsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteEarningsPayload>
          }
          deleteMany: {
            args: Prisma.FavoriteEarningsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FavoriteEarningsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FavoriteEarningsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteEarningsPayload>
          }
          aggregate: {
            args: Prisma.FavoriteEarningsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFavoriteEarnings>
          }
          groupBy: {
            args: Prisma.FavoriteEarningsGroupByArgs<ExtArgs>
            result: $Utils.Optional<FavoriteEarningsGroupByOutputType>[]
          }
          count: {
            args: Prisma.FavoriteEarningsCountArgs<ExtArgs>
            result: $Utils.Optional<FavoriteEarningsCountAggregateOutputType> | number
          }
        }
      }
      FavoriteDividends: {
        payload: Prisma.$FavoriteDividendsPayload<ExtArgs>
        fields: Prisma.FavoriteDividendsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FavoriteDividendsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteDividendsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FavoriteDividendsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteDividendsPayload>
          }
          findFirst: {
            args: Prisma.FavoriteDividendsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteDividendsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FavoriteDividendsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteDividendsPayload>
          }
          findMany: {
            args: Prisma.FavoriteDividendsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteDividendsPayload>[]
          }
          create: {
            args: Prisma.FavoriteDividendsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteDividendsPayload>
          }
          createMany: {
            args: Prisma.FavoriteDividendsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FavoriteDividendsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteDividendsPayload>[]
          }
          delete: {
            args: Prisma.FavoriteDividendsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteDividendsPayload>
          }
          update: {
            args: Prisma.FavoriteDividendsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteDividendsPayload>
          }
          deleteMany: {
            args: Prisma.FavoriteDividendsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FavoriteDividendsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FavoriteDividendsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteDividendsPayload>
          }
          aggregate: {
            args: Prisma.FavoriteDividendsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFavoriteDividends>
          }
          groupBy: {
            args: Prisma.FavoriteDividendsGroupByArgs<ExtArgs>
            result: $Utils.Optional<FavoriteDividendsGroupByOutputType>[]
          }
          count: {
            args: Prisma.FavoriteDividendsCountArgs<ExtArgs>
            result: $Utils.Optional<FavoriteDividendsCountAggregateOutputType> | number
          }
        }
      }
      FavoriteIndicator: {
        payload: Prisma.$FavoriteIndicatorPayload<ExtArgs>
        fields: Prisma.FavoriteIndicatorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FavoriteIndicatorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteIndicatorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FavoriteIndicatorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteIndicatorPayload>
          }
          findFirst: {
            args: Prisma.FavoriteIndicatorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteIndicatorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FavoriteIndicatorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteIndicatorPayload>
          }
          findMany: {
            args: Prisma.FavoriteIndicatorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteIndicatorPayload>[]
          }
          create: {
            args: Prisma.FavoriteIndicatorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteIndicatorPayload>
          }
          createMany: {
            args: Prisma.FavoriteIndicatorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FavoriteIndicatorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteIndicatorPayload>[]
          }
          delete: {
            args: Prisma.FavoriteIndicatorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteIndicatorPayload>
          }
          update: {
            args: Prisma.FavoriteIndicatorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteIndicatorPayload>
          }
          deleteMany: {
            args: Prisma.FavoriteIndicatorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FavoriteIndicatorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FavoriteIndicatorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FavoriteIndicatorPayload>
          }
          aggregate: {
            args: Prisma.FavoriteIndicatorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFavoriteIndicator>
          }
          groupBy: {
            args: Prisma.FavoriteIndicatorGroupByArgs<ExtArgs>
            result: $Utils.Optional<FavoriteIndicatorGroupByOutputType>[]
          }
          count: {
            args: Prisma.FavoriteIndicatorCountArgs<ExtArgs>
            result: $Utils.Optional<FavoriteIndicatorCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    oauthInfo: number
    favoriteEarnings: number
    favoriteDividends: number
    favoriteIndicators: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    oauthInfo?: boolean | UserCountOutputTypeCountOauthInfoArgs
    favoriteEarnings?: boolean | UserCountOutputTypeCountFavoriteEarningsArgs
    favoriteDividends?: boolean | UserCountOutputTypeCountFavoriteDividendsArgs
    favoriteIndicators?: boolean | UserCountOutputTypeCountFavoriteIndicatorsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOauthInfoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OauthInfoWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFavoriteEarningsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FavoriteEarningsWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFavoriteDividendsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FavoriteDividendsWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFavoriteIndicatorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FavoriteIndicatorWhereInput
  }


  /**
   * Count Type CompanyCountOutputType
   */

  export type CompanyCountOutputType = {
    earnings: number
    dividends: number
  }

  export type CompanyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    earnings?: boolean | CompanyCountOutputTypeCountEarningsArgs
    dividends?: boolean | CompanyCountOutputTypeCountDividendsArgs
  }

  // Custom InputTypes
  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyCountOutputType
     */
    select?: CompanyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountEarningsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EarningsWhereInput
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountDividendsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DividendWhereInput
  }


  /**
   * Count Type EarningsCountOutputType
   */

  export type EarningsCountOutputType = {
    favorites: number
  }

  export type EarningsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    favorites?: boolean | EarningsCountOutputTypeCountFavoritesArgs
  }

  // Custom InputTypes
  /**
   * EarningsCountOutputType without action
   */
  export type EarningsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EarningsCountOutputType
     */
    select?: EarningsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EarningsCountOutputType without action
   */
  export type EarningsCountOutputTypeCountFavoritesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FavoriteEarningsWhereInput
  }


  /**
   * Count Type DividendCountOutputType
   */

  export type DividendCountOutputType = {
    favorites: number
  }

  export type DividendCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    favorites?: boolean | DividendCountOutputTypeCountFavoritesArgs
  }

  // Custom InputTypes
  /**
   * DividendCountOutputType without action
   */
  export type DividendCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DividendCountOutputType
     */
    select?: DividendCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DividendCountOutputType without action
   */
  export type DividendCountOutputTypeCountFavoritesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FavoriteDividendsWhereInput
  }


  /**
   * Count Type EconomicIndicatorCountOutputType
   */

  export type EconomicIndicatorCountOutputType = {
    favorites: number
  }

  export type EconomicIndicatorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    favorites?: boolean | EconomicIndicatorCountOutputTypeCountFavoritesArgs
  }

  // Custom InputTypes
  /**
   * EconomicIndicatorCountOutputType without action
   */
  export type EconomicIndicatorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EconomicIndicatorCountOutputType
     */
    select?: EconomicIndicatorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EconomicIndicatorCountOutputType without action
   */
  export type EconomicIndicatorCountOutputTypeCountFavoritesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FavoriteIndicatorWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    nickname: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    nickname: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    nickname: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    nickname?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    nickname?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    nickname?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    email: string
    password: string
    nickname: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    nickname?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    oauthInfo?: boolean | User$oauthInfoArgs<ExtArgs>
    favoriteEarnings?: boolean | User$favoriteEarningsArgs<ExtArgs>
    favoriteDividends?: boolean | User$favoriteDividendsArgs<ExtArgs>
    favoriteIndicators?: boolean | User$favoriteIndicatorsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    nickname?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    nickname?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    oauthInfo?: boolean | User$oauthInfoArgs<ExtArgs>
    favoriteEarnings?: boolean | User$favoriteEarningsArgs<ExtArgs>
    favoriteDividends?: boolean | User$favoriteDividendsArgs<ExtArgs>
    favoriteIndicators?: boolean | User$favoriteIndicatorsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      oauthInfo: Prisma.$OauthInfoPayload<ExtArgs>[]
      favoriteEarnings: Prisma.$FavoriteEarningsPayload<ExtArgs>[]
      favoriteDividends: Prisma.$FavoriteDividendsPayload<ExtArgs>[]
      favoriteIndicators: Prisma.$FavoriteIndicatorPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      password: string
      nickname: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    oauthInfo<T extends User$oauthInfoArgs<ExtArgs> = {}>(args?: Subset<T, User$oauthInfoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OauthInfoPayload<ExtArgs>, T, "findMany"> | Null>
    favoriteEarnings<T extends User$favoriteEarningsArgs<ExtArgs> = {}>(args?: Subset<T, User$favoriteEarningsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FavoriteEarningsPayload<ExtArgs>, T, "findMany"> | Null>
    favoriteDividends<T extends User$favoriteDividendsArgs<ExtArgs> = {}>(args?: Subset<T, User$favoriteDividendsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FavoriteDividendsPayload<ExtArgs>, T, "findMany"> | Null>
    favoriteIndicators<T extends User$favoriteIndicatorsArgs<ExtArgs> = {}>(args?: Subset<T, User$favoriteIndicatorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FavoriteIndicatorPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly nickname: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.oauthInfo
   */
  export type User$oauthInfoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OauthInfo
     */
    select?: OauthInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OauthInfoInclude<ExtArgs> | null
    where?: OauthInfoWhereInput
    orderBy?: OauthInfoOrderByWithRelationInput | OauthInfoOrderByWithRelationInput[]
    cursor?: OauthInfoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OauthInfoScalarFieldEnum | OauthInfoScalarFieldEnum[]
  }

  /**
   * User.favoriteEarnings
   */
  export type User$favoriteEarningsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsInclude<ExtArgs> | null
    where?: FavoriteEarningsWhereInput
    orderBy?: FavoriteEarningsOrderByWithRelationInput | FavoriteEarningsOrderByWithRelationInput[]
    cursor?: FavoriteEarningsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FavoriteEarningsScalarFieldEnum | FavoriteEarningsScalarFieldEnum[]
  }

  /**
   * User.favoriteDividends
   */
  export type User$favoriteDividendsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsInclude<ExtArgs> | null
    where?: FavoriteDividendsWhereInput
    orderBy?: FavoriteDividendsOrderByWithRelationInput | FavoriteDividendsOrderByWithRelationInput[]
    cursor?: FavoriteDividendsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FavoriteDividendsScalarFieldEnum | FavoriteDividendsScalarFieldEnum[]
  }

  /**
   * User.favoriteIndicators
   */
  export type User$favoriteIndicatorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorInclude<ExtArgs> | null
    where?: FavoriteIndicatorWhereInput
    orderBy?: FavoriteIndicatorOrderByWithRelationInput | FavoriteIndicatorOrderByWithRelationInput[]
    cursor?: FavoriteIndicatorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FavoriteIndicatorScalarFieldEnum | FavoriteIndicatorScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model OauthInfo
   */

  export type AggregateOauthInfo = {
    _count: OauthInfoCountAggregateOutputType | null
    _avg: OauthInfoAvgAggregateOutputType | null
    _sum: OauthInfoSumAggregateOutputType | null
    _min: OauthInfoMinAggregateOutputType | null
    _max: OauthInfoMaxAggregateOutputType | null
  }

  export type OauthInfoAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type OauthInfoSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type OauthInfoMinAggregateOutputType = {
    id: number | null
    provider: string | null
    providerId: string | null
    accessToken: string | null
    refreshToken: string | null
    tokenExpiry: Date | null
    userId: number | null
  }

  export type OauthInfoMaxAggregateOutputType = {
    id: number | null
    provider: string | null
    providerId: string | null
    accessToken: string | null
    refreshToken: string | null
    tokenExpiry: Date | null
    userId: number | null
  }

  export type OauthInfoCountAggregateOutputType = {
    id: number
    provider: number
    providerId: number
    accessToken: number
    refreshToken: number
    tokenExpiry: number
    userId: number
    _all: number
  }


  export type OauthInfoAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type OauthInfoSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type OauthInfoMinAggregateInputType = {
    id?: true
    provider?: true
    providerId?: true
    accessToken?: true
    refreshToken?: true
    tokenExpiry?: true
    userId?: true
  }

  export type OauthInfoMaxAggregateInputType = {
    id?: true
    provider?: true
    providerId?: true
    accessToken?: true
    refreshToken?: true
    tokenExpiry?: true
    userId?: true
  }

  export type OauthInfoCountAggregateInputType = {
    id?: true
    provider?: true
    providerId?: true
    accessToken?: true
    refreshToken?: true
    tokenExpiry?: true
    userId?: true
    _all?: true
  }

  export type OauthInfoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OauthInfo to aggregate.
     */
    where?: OauthInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OauthInfos to fetch.
     */
    orderBy?: OauthInfoOrderByWithRelationInput | OauthInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OauthInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OauthInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OauthInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OauthInfos
    **/
    _count?: true | OauthInfoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OauthInfoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OauthInfoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OauthInfoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OauthInfoMaxAggregateInputType
  }

  export type GetOauthInfoAggregateType<T extends OauthInfoAggregateArgs> = {
        [P in keyof T & keyof AggregateOauthInfo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOauthInfo[P]>
      : GetScalarType<T[P], AggregateOauthInfo[P]>
  }




  export type OauthInfoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OauthInfoWhereInput
    orderBy?: OauthInfoOrderByWithAggregationInput | OauthInfoOrderByWithAggregationInput[]
    by: OauthInfoScalarFieldEnum[] | OauthInfoScalarFieldEnum
    having?: OauthInfoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OauthInfoCountAggregateInputType | true
    _avg?: OauthInfoAvgAggregateInputType
    _sum?: OauthInfoSumAggregateInputType
    _min?: OauthInfoMinAggregateInputType
    _max?: OauthInfoMaxAggregateInputType
  }

  export type OauthInfoGroupByOutputType = {
    id: number
    provider: string
    providerId: string
    accessToken: string | null
    refreshToken: string | null
    tokenExpiry: Date | null
    userId: number
    _count: OauthInfoCountAggregateOutputType | null
    _avg: OauthInfoAvgAggregateOutputType | null
    _sum: OauthInfoSumAggregateOutputType | null
    _min: OauthInfoMinAggregateOutputType | null
    _max: OauthInfoMaxAggregateOutputType | null
  }

  type GetOauthInfoGroupByPayload<T extends OauthInfoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OauthInfoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OauthInfoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OauthInfoGroupByOutputType[P]>
            : GetScalarType<T[P], OauthInfoGroupByOutputType[P]>
        }
      >
    >


  export type OauthInfoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    providerId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    tokenExpiry?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oauthInfo"]>

  export type OauthInfoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    providerId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    tokenExpiry?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oauthInfo"]>

  export type OauthInfoSelectScalar = {
    id?: boolean
    provider?: boolean
    providerId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    tokenExpiry?: boolean
    userId?: boolean
  }

  export type OauthInfoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OauthInfoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $OauthInfoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OauthInfo"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      provider: string
      providerId: string
      accessToken: string | null
      refreshToken: string | null
      tokenExpiry: Date | null
      userId: number
    }, ExtArgs["result"]["oauthInfo"]>
    composites: {}
  }

  type OauthInfoGetPayload<S extends boolean | null | undefined | OauthInfoDefaultArgs> = $Result.GetResult<Prisma.$OauthInfoPayload, S>

  type OauthInfoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OauthInfoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OauthInfoCountAggregateInputType | true
    }

  export interface OauthInfoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OauthInfo'], meta: { name: 'OauthInfo' } }
    /**
     * Find zero or one OauthInfo that matches the filter.
     * @param {OauthInfoFindUniqueArgs} args - Arguments to find a OauthInfo
     * @example
     * // Get one OauthInfo
     * const oauthInfo = await prisma.oauthInfo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OauthInfoFindUniqueArgs>(args: SelectSubset<T, OauthInfoFindUniqueArgs<ExtArgs>>): Prisma__OauthInfoClient<$Result.GetResult<Prisma.$OauthInfoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one OauthInfo that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OauthInfoFindUniqueOrThrowArgs} args - Arguments to find a OauthInfo
     * @example
     * // Get one OauthInfo
     * const oauthInfo = await prisma.oauthInfo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OauthInfoFindUniqueOrThrowArgs>(args: SelectSubset<T, OauthInfoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OauthInfoClient<$Result.GetResult<Prisma.$OauthInfoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first OauthInfo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OauthInfoFindFirstArgs} args - Arguments to find a OauthInfo
     * @example
     * // Get one OauthInfo
     * const oauthInfo = await prisma.oauthInfo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OauthInfoFindFirstArgs>(args?: SelectSubset<T, OauthInfoFindFirstArgs<ExtArgs>>): Prisma__OauthInfoClient<$Result.GetResult<Prisma.$OauthInfoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first OauthInfo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OauthInfoFindFirstOrThrowArgs} args - Arguments to find a OauthInfo
     * @example
     * // Get one OauthInfo
     * const oauthInfo = await prisma.oauthInfo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OauthInfoFindFirstOrThrowArgs>(args?: SelectSubset<T, OauthInfoFindFirstOrThrowArgs<ExtArgs>>): Prisma__OauthInfoClient<$Result.GetResult<Prisma.$OauthInfoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more OauthInfos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OauthInfoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OauthInfos
     * const oauthInfos = await prisma.oauthInfo.findMany()
     * 
     * // Get first 10 OauthInfos
     * const oauthInfos = await prisma.oauthInfo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oauthInfoWithIdOnly = await prisma.oauthInfo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OauthInfoFindManyArgs>(args?: SelectSubset<T, OauthInfoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OauthInfoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a OauthInfo.
     * @param {OauthInfoCreateArgs} args - Arguments to create a OauthInfo.
     * @example
     * // Create one OauthInfo
     * const OauthInfo = await prisma.oauthInfo.create({
     *   data: {
     *     // ... data to create a OauthInfo
     *   }
     * })
     * 
     */
    create<T extends OauthInfoCreateArgs>(args: SelectSubset<T, OauthInfoCreateArgs<ExtArgs>>): Prisma__OauthInfoClient<$Result.GetResult<Prisma.$OauthInfoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many OauthInfos.
     * @param {OauthInfoCreateManyArgs} args - Arguments to create many OauthInfos.
     * @example
     * // Create many OauthInfos
     * const oauthInfo = await prisma.oauthInfo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OauthInfoCreateManyArgs>(args?: SelectSubset<T, OauthInfoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OauthInfos and returns the data saved in the database.
     * @param {OauthInfoCreateManyAndReturnArgs} args - Arguments to create many OauthInfos.
     * @example
     * // Create many OauthInfos
     * const oauthInfo = await prisma.oauthInfo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OauthInfos and only return the `id`
     * const oauthInfoWithIdOnly = await prisma.oauthInfo.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OauthInfoCreateManyAndReturnArgs>(args?: SelectSubset<T, OauthInfoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OauthInfoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a OauthInfo.
     * @param {OauthInfoDeleteArgs} args - Arguments to delete one OauthInfo.
     * @example
     * // Delete one OauthInfo
     * const OauthInfo = await prisma.oauthInfo.delete({
     *   where: {
     *     // ... filter to delete one OauthInfo
     *   }
     * })
     * 
     */
    delete<T extends OauthInfoDeleteArgs>(args: SelectSubset<T, OauthInfoDeleteArgs<ExtArgs>>): Prisma__OauthInfoClient<$Result.GetResult<Prisma.$OauthInfoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one OauthInfo.
     * @param {OauthInfoUpdateArgs} args - Arguments to update one OauthInfo.
     * @example
     * // Update one OauthInfo
     * const oauthInfo = await prisma.oauthInfo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OauthInfoUpdateArgs>(args: SelectSubset<T, OauthInfoUpdateArgs<ExtArgs>>): Prisma__OauthInfoClient<$Result.GetResult<Prisma.$OauthInfoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more OauthInfos.
     * @param {OauthInfoDeleteManyArgs} args - Arguments to filter OauthInfos to delete.
     * @example
     * // Delete a few OauthInfos
     * const { count } = await prisma.oauthInfo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OauthInfoDeleteManyArgs>(args?: SelectSubset<T, OauthInfoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OauthInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OauthInfoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OauthInfos
     * const oauthInfo = await prisma.oauthInfo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OauthInfoUpdateManyArgs>(args: SelectSubset<T, OauthInfoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OauthInfo.
     * @param {OauthInfoUpsertArgs} args - Arguments to update or create a OauthInfo.
     * @example
     * // Update or create a OauthInfo
     * const oauthInfo = await prisma.oauthInfo.upsert({
     *   create: {
     *     // ... data to create a OauthInfo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OauthInfo we want to update
     *   }
     * })
     */
    upsert<T extends OauthInfoUpsertArgs>(args: SelectSubset<T, OauthInfoUpsertArgs<ExtArgs>>): Prisma__OauthInfoClient<$Result.GetResult<Prisma.$OauthInfoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of OauthInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OauthInfoCountArgs} args - Arguments to filter OauthInfos to count.
     * @example
     * // Count the number of OauthInfos
     * const count = await prisma.oauthInfo.count({
     *   where: {
     *     // ... the filter for the OauthInfos we want to count
     *   }
     * })
    **/
    count<T extends OauthInfoCountArgs>(
      args?: Subset<T, OauthInfoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OauthInfoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OauthInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OauthInfoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OauthInfoAggregateArgs>(args: Subset<T, OauthInfoAggregateArgs>): Prisma.PrismaPromise<GetOauthInfoAggregateType<T>>

    /**
     * Group by OauthInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OauthInfoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OauthInfoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OauthInfoGroupByArgs['orderBy'] }
        : { orderBy?: OauthInfoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OauthInfoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOauthInfoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OauthInfo model
   */
  readonly fields: OauthInfoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OauthInfo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OauthInfoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OauthInfo model
   */ 
  interface OauthInfoFieldRefs {
    readonly id: FieldRef<"OauthInfo", 'Int'>
    readonly provider: FieldRef<"OauthInfo", 'String'>
    readonly providerId: FieldRef<"OauthInfo", 'String'>
    readonly accessToken: FieldRef<"OauthInfo", 'String'>
    readonly refreshToken: FieldRef<"OauthInfo", 'String'>
    readonly tokenExpiry: FieldRef<"OauthInfo", 'DateTime'>
    readonly userId: FieldRef<"OauthInfo", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * OauthInfo findUnique
   */
  export type OauthInfoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OauthInfo
     */
    select?: OauthInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OauthInfoInclude<ExtArgs> | null
    /**
     * Filter, which OauthInfo to fetch.
     */
    where: OauthInfoWhereUniqueInput
  }

  /**
   * OauthInfo findUniqueOrThrow
   */
  export type OauthInfoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OauthInfo
     */
    select?: OauthInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OauthInfoInclude<ExtArgs> | null
    /**
     * Filter, which OauthInfo to fetch.
     */
    where: OauthInfoWhereUniqueInput
  }

  /**
   * OauthInfo findFirst
   */
  export type OauthInfoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OauthInfo
     */
    select?: OauthInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OauthInfoInclude<ExtArgs> | null
    /**
     * Filter, which OauthInfo to fetch.
     */
    where?: OauthInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OauthInfos to fetch.
     */
    orderBy?: OauthInfoOrderByWithRelationInput | OauthInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OauthInfos.
     */
    cursor?: OauthInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OauthInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OauthInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OauthInfos.
     */
    distinct?: OauthInfoScalarFieldEnum | OauthInfoScalarFieldEnum[]
  }

  /**
   * OauthInfo findFirstOrThrow
   */
  export type OauthInfoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OauthInfo
     */
    select?: OauthInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OauthInfoInclude<ExtArgs> | null
    /**
     * Filter, which OauthInfo to fetch.
     */
    where?: OauthInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OauthInfos to fetch.
     */
    orderBy?: OauthInfoOrderByWithRelationInput | OauthInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OauthInfos.
     */
    cursor?: OauthInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OauthInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OauthInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OauthInfos.
     */
    distinct?: OauthInfoScalarFieldEnum | OauthInfoScalarFieldEnum[]
  }

  /**
   * OauthInfo findMany
   */
  export type OauthInfoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OauthInfo
     */
    select?: OauthInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OauthInfoInclude<ExtArgs> | null
    /**
     * Filter, which OauthInfos to fetch.
     */
    where?: OauthInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OauthInfos to fetch.
     */
    orderBy?: OauthInfoOrderByWithRelationInput | OauthInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OauthInfos.
     */
    cursor?: OauthInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OauthInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OauthInfos.
     */
    skip?: number
    distinct?: OauthInfoScalarFieldEnum | OauthInfoScalarFieldEnum[]
  }

  /**
   * OauthInfo create
   */
  export type OauthInfoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OauthInfo
     */
    select?: OauthInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OauthInfoInclude<ExtArgs> | null
    /**
     * The data needed to create a OauthInfo.
     */
    data: XOR<OauthInfoCreateInput, OauthInfoUncheckedCreateInput>
  }

  /**
   * OauthInfo createMany
   */
  export type OauthInfoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OauthInfos.
     */
    data: OauthInfoCreateManyInput | OauthInfoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OauthInfo createManyAndReturn
   */
  export type OauthInfoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OauthInfo
     */
    select?: OauthInfoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many OauthInfos.
     */
    data: OauthInfoCreateManyInput | OauthInfoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OauthInfoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OauthInfo update
   */
  export type OauthInfoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OauthInfo
     */
    select?: OauthInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OauthInfoInclude<ExtArgs> | null
    /**
     * The data needed to update a OauthInfo.
     */
    data: XOR<OauthInfoUpdateInput, OauthInfoUncheckedUpdateInput>
    /**
     * Choose, which OauthInfo to update.
     */
    where: OauthInfoWhereUniqueInput
  }

  /**
   * OauthInfo updateMany
   */
  export type OauthInfoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OauthInfos.
     */
    data: XOR<OauthInfoUpdateManyMutationInput, OauthInfoUncheckedUpdateManyInput>
    /**
     * Filter which OauthInfos to update
     */
    where?: OauthInfoWhereInput
  }

  /**
   * OauthInfo upsert
   */
  export type OauthInfoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OauthInfo
     */
    select?: OauthInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OauthInfoInclude<ExtArgs> | null
    /**
     * The filter to search for the OauthInfo to update in case it exists.
     */
    where: OauthInfoWhereUniqueInput
    /**
     * In case the OauthInfo found by the `where` argument doesn't exist, create a new OauthInfo with this data.
     */
    create: XOR<OauthInfoCreateInput, OauthInfoUncheckedCreateInput>
    /**
     * In case the OauthInfo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OauthInfoUpdateInput, OauthInfoUncheckedUpdateInput>
  }

  /**
   * OauthInfo delete
   */
  export type OauthInfoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OauthInfo
     */
    select?: OauthInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OauthInfoInclude<ExtArgs> | null
    /**
     * Filter which OauthInfo to delete.
     */
    where: OauthInfoWhereUniqueInput
  }

  /**
   * OauthInfo deleteMany
   */
  export type OauthInfoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OauthInfos to delete
     */
    where?: OauthInfoWhereInput
  }

  /**
   * OauthInfo without action
   */
  export type OauthInfoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OauthInfo
     */
    select?: OauthInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OauthInfoInclude<ExtArgs> | null
  }


  /**
   * Model Company
   */

  export type AggregateCompany = {
    _count: CompanyCountAggregateOutputType | null
    _avg: CompanyAvgAggregateOutputType | null
    _sum: CompanySumAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  export type CompanyAvgAggregateOutputType = {
    id: number | null
  }

  export type CompanySumAggregateOutputType = {
    id: number | null
  }

  export type CompanyMinAggregateOutputType = {
    id: number | null
    ticker: string | null
    name: string | null
    country: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompanyMaxAggregateOutputType = {
    id: number | null
    ticker: string | null
    name: string | null
    country: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompanyCountAggregateOutputType = {
    id: number
    ticker: number
    name: number
    country: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CompanyAvgAggregateInputType = {
    id?: true
  }

  export type CompanySumAggregateInputType = {
    id?: true
  }

  export type CompanyMinAggregateInputType = {
    id?: true
    ticker?: true
    name?: true
    country?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompanyMaxAggregateInputType = {
    id?: true
    ticker?: true
    name?: true
    country?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompanyCountAggregateInputType = {
    id?: true
    ticker?: true
    name?: true
    country?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Company to aggregate.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Companies
    **/
    _count?: true | CompanyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CompanyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CompanySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanyMaxAggregateInputType
  }

  export type GetCompanyAggregateType<T extends CompanyAggregateArgs> = {
        [P in keyof T & keyof AggregateCompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompany[P]>
      : GetScalarType<T[P], AggregateCompany[P]>
  }




  export type CompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyWhereInput
    orderBy?: CompanyOrderByWithAggregationInput | CompanyOrderByWithAggregationInput[]
    by: CompanyScalarFieldEnum[] | CompanyScalarFieldEnum
    having?: CompanyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanyCountAggregateInputType | true
    _avg?: CompanyAvgAggregateInputType
    _sum?: CompanySumAggregateInputType
    _min?: CompanyMinAggregateInputType
    _max?: CompanyMaxAggregateInputType
  }

  export type CompanyGroupByOutputType = {
    id: number
    ticker: string
    name: string
    country: string
    createdAt: Date
    updatedAt: Date
    _count: CompanyCountAggregateOutputType | null
    _avg: CompanyAvgAggregateOutputType | null
    _sum: CompanySumAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  type GetCompanyGroupByPayload<T extends CompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanyGroupByOutputType[P]>
            : GetScalarType<T[P], CompanyGroupByOutputType[P]>
        }
      >
    >


  export type CompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticker?: boolean
    name?: boolean
    country?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    earnings?: boolean | Company$earningsArgs<ExtArgs>
    dividends?: boolean | Company$dividendsArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company"]>

  export type CompanySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticker?: boolean
    name?: boolean
    country?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["company"]>

  export type CompanySelectScalar = {
    id?: boolean
    ticker?: boolean
    name?: boolean
    country?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    earnings?: boolean | Company$earningsArgs<ExtArgs>
    dividends?: boolean | Company$dividendsArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CompanyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Company"
    objects: {
      earnings: Prisma.$EarningsPayload<ExtArgs>[]
      dividends: Prisma.$DividendPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      ticker: string
      name: string
      country: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["company"]>
    composites: {}
  }

  type CompanyGetPayload<S extends boolean | null | undefined | CompanyDefaultArgs> = $Result.GetResult<Prisma.$CompanyPayload, S>

  type CompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CompanyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CompanyCountAggregateInputType | true
    }

  export interface CompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Company'], meta: { name: 'Company' } }
    /**
     * Find zero or one Company that matches the filter.
     * @param {CompanyFindUniqueArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanyFindUniqueArgs>(args: SelectSubset<T, CompanyFindUniqueArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Company that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CompanyFindUniqueOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanyFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Company that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanyFindFirstArgs>(args?: SelectSubset<T, CompanyFindFirstArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Company that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanyFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Companies
     * const companies = await prisma.company.findMany()
     * 
     * // Get first 10 Companies
     * const companies = await prisma.company.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companyWithIdOnly = await prisma.company.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanyFindManyArgs>(args?: SelectSubset<T, CompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Company.
     * @param {CompanyCreateArgs} args - Arguments to create a Company.
     * @example
     * // Create one Company
     * const Company = await prisma.company.create({
     *   data: {
     *     // ... data to create a Company
     *   }
     * })
     * 
     */
    create<T extends CompanyCreateArgs>(args: SelectSubset<T, CompanyCreateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Companies.
     * @param {CompanyCreateManyArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanyCreateManyArgs>(args?: SelectSubset<T, CompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Companies and returns the data saved in the database.
     * @param {CompanyCreateManyAndReturnArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Companies and only return the `id`
     * const companyWithIdOnly = await prisma.company.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompanyCreateManyAndReturnArgs>(args?: SelectSubset<T, CompanyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Company.
     * @param {CompanyDeleteArgs} args - Arguments to delete one Company.
     * @example
     * // Delete one Company
     * const Company = await prisma.company.delete({
     *   where: {
     *     // ... filter to delete one Company
     *   }
     * })
     * 
     */
    delete<T extends CompanyDeleteArgs>(args: SelectSubset<T, CompanyDeleteArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Company.
     * @param {CompanyUpdateArgs} args - Arguments to update one Company.
     * @example
     * // Update one Company
     * const company = await prisma.company.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanyUpdateArgs>(args: SelectSubset<T, CompanyUpdateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Companies.
     * @param {CompanyDeleteManyArgs} args - Arguments to filter Companies to delete.
     * @example
     * // Delete a few Companies
     * const { count } = await prisma.company.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanyDeleteManyArgs>(args?: SelectSubset<T, CompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanyUpdateManyArgs>(args: SelectSubset<T, CompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Company.
     * @param {CompanyUpsertArgs} args - Arguments to update or create a Company.
     * @example
     * // Update or create a Company
     * const company = await prisma.company.upsert({
     *   create: {
     *     // ... data to create a Company
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Company we want to update
     *   }
     * })
     */
    upsert<T extends CompanyUpsertArgs>(args: SelectSubset<T, CompanyUpsertArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyCountArgs} args - Arguments to filter Companies to count.
     * @example
     * // Count the number of Companies
     * const count = await prisma.company.count({
     *   where: {
     *     // ... the filter for the Companies we want to count
     *   }
     * })
    **/
    count<T extends CompanyCountArgs>(
      args?: Subset<T, CompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompanyAggregateArgs>(args: Subset<T, CompanyAggregateArgs>): Prisma.PrismaPromise<GetCompanyAggregateType<T>>

    /**
     * Group by Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompanyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanyGroupByArgs['orderBy'] }
        : { orderBy?: CompanyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Company model
   */
  readonly fields: CompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Company.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    earnings<T extends Company$earningsArgs<ExtArgs> = {}>(args?: Subset<T, Company$earningsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EarningsPayload<ExtArgs>, T, "findMany"> | Null>
    dividends<T extends Company$dividendsArgs<ExtArgs> = {}>(args?: Subset<T, Company$dividendsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DividendPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Company model
   */ 
  interface CompanyFieldRefs {
    readonly id: FieldRef<"Company", 'Int'>
    readonly ticker: FieldRef<"Company", 'String'>
    readonly name: FieldRef<"Company", 'String'>
    readonly country: FieldRef<"Company", 'String'>
    readonly createdAt: FieldRef<"Company", 'DateTime'>
    readonly updatedAt: FieldRef<"Company", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Company findUnique
   */
  export type CompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findUniqueOrThrow
   */
  export type CompanyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findFirst
   */
  export type CompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findFirstOrThrow
   */
  export type CompanyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findMany
   */
  export type CompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Companies to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company create
   */
  export type CompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to create a Company.
     */
    data: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
  }

  /**
   * Company createMany
   */
  export type CompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company createManyAndReturn
   */
  export type CompanyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company update
   */
  export type CompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to update a Company.
     */
    data: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
    /**
     * Choose, which Company to update.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company updateMany
   */
  export type CompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
  }

  /**
   * Company upsert
   */
  export type CompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The filter to search for the Company to update in case it exists.
     */
    where: CompanyWhereUniqueInput
    /**
     * In case the Company found by the `where` argument doesn't exist, create a new Company with this data.
     */
    create: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
    /**
     * In case the Company was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
  }

  /**
   * Company delete
   */
  export type CompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter which Company to delete.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company deleteMany
   */
  export type CompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Companies to delete
     */
    where?: CompanyWhereInput
  }

  /**
   * Company.earnings
   */
  export type Company$earningsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Earnings
     */
    select?: EarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EarningsInclude<ExtArgs> | null
    where?: EarningsWhereInput
    orderBy?: EarningsOrderByWithRelationInput | EarningsOrderByWithRelationInput[]
    cursor?: EarningsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EarningsScalarFieldEnum | EarningsScalarFieldEnum[]
  }

  /**
   * Company.dividends
   */
  export type Company$dividendsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dividend
     */
    select?: DividendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DividendInclude<ExtArgs> | null
    where?: DividendWhereInput
    orderBy?: DividendOrderByWithRelationInput | DividendOrderByWithRelationInput[]
    cursor?: DividendWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DividendScalarFieldEnum | DividendScalarFieldEnum[]
  }

  /**
   * Company without action
   */
  export type CompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
  }


  /**
   * Model Earnings
   */

  export type AggregateEarnings = {
    _count: EarningsCountAggregateOutputType | null
    _avg: EarningsAvgAggregateOutputType | null
    _sum: EarningsSumAggregateOutputType | null
    _min: EarningsMinAggregateOutputType | null
    _max: EarningsMaxAggregateOutputType | null
  }

  export type EarningsAvgAggregateOutputType = {
    id: number | null
    releaseDate: number | null
    companyId: number | null
  }

  export type EarningsSumAggregateOutputType = {
    id: number | null
    releaseDate: bigint | null
    companyId: number | null
  }

  export type EarningsMinAggregateOutputType = {
    id: number | null
    country: string | null
    releaseDate: bigint | null
    actualEPS: string | null
    forecastEPS: string | null
    previousEPS: string | null
    actualRevenue: string | null
    forecastRevenue: string | null
    previousRevenue: string | null
    companyId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EarningsMaxAggregateOutputType = {
    id: number | null
    country: string | null
    releaseDate: bigint | null
    actualEPS: string | null
    forecastEPS: string | null
    previousEPS: string | null
    actualRevenue: string | null
    forecastRevenue: string | null
    previousRevenue: string | null
    companyId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EarningsCountAggregateOutputType = {
    id: number
    country: number
    releaseDate: number
    actualEPS: number
    forecastEPS: number
    previousEPS: number
    actualRevenue: number
    forecastRevenue: number
    previousRevenue: number
    companyId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EarningsAvgAggregateInputType = {
    id?: true
    releaseDate?: true
    companyId?: true
  }

  export type EarningsSumAggregateInputType = {
    id?: true
    releaseDate?: true
    companyId?: true
  }

  export type EarningsMinAggregateInputType = {
    id?: true
    country?: true
    releaseDate?: true
    actualEPS?: true
    forecastEPS?: true
    previousEPS?: true
    actualRevenue?: true
    forecastRevenue?: true
    previousRevenue?: true
    companyId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EarningsMaxAggregateInputType = {
    id?: true
    country?: true
    releaseDate?: true
    actualEPS?: true
    forecastEPS?: true
    previousEPS?: true
    actualRevenue?: true
    forecastRevenue?: true
    previousRevenue?: true
    companyId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EarningsCountAggregateInputType = {
    id?: true
    country?: true
    releaseDate?: true
    actualEPS?: true
    forecastEPS?: true
    previousEPS?: true
    actualRevenue?: true
    forecastRevenue?: true
    previousRevenue?: true
    companyId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EarningsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Earnings to aggregate.
     */
    where?: EarningsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Earnings to fetch.
     */
    orderBy?: EarningsOrderByWithRelationInput | EarningsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EarningsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Earnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Earnings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Earnings
    **/
    _count?: true | EarningsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EarningsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EarningsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EarningsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EarningsMaxAggregateInputType
  }

  export type GetEarningsAggregateType<T extends EarningsAggregateArgs> = {
        [P in keyof T & keyof AggregateEarnings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEarnings[P]>
      : GetScalarType<T[P], AggregateEarnings[P]>
  }




  export type EarningsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EarningsWhereInput
    orderBy?: EarningsOrderByWithAggregationInput | EarningsOrderByWithAggregationInput[]
    by: EarningsScalarFieldEnum[] | EarningsScalarFieldEnum
    having?: EarningsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EarningsCountAggregateInputType | true
    _avg?: EarningsAvgAggregateInputType
    _sum?: EarningsSumAggregateInputType
    _min?: EarningsMinAggregateInputType
    _max?: EarningsMaxAggregateInputType
  }

  export type EarningsGroupByOutputType = {
    id: number
    country: string
    releaseDate: bigint
    actualEPS: string
    forecastEPS: string
    previousEPS: string
    actualRevenue: string
    forecastRevenue: string
    previousRevenue: string
    companyId: number
    createdAt: Date
    updatedAt: Date
    _count: EarningsCountAggregateOutputType | null
    _avg: EarningsAvgAggregateOutputType | null
    _sum: EarningsSumAggregateOutputType | null
    _min: EarningsMinAggregateOutputType | null
    _max: EarningsMaxAggregateOutputType | null
  }

  type GetEarningsGroupByPayload<T extends EarningsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EarningsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EarningsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EarningsGroupByOutputType[P]>
            : GetScalarType<T[P], EarningsGroupByOutputType[P]>
        }
      >
    >


  export type EarningsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    country?: boolean
    releaseDate?: boolean
    actualEPS?: boolean
    forecastEPS?: boolean
    previousEPS?: boolean
    actualRevenue?: boolean
    forecastRevenue?: boolean
    previousRevenue?: boolean
    companyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    favorites?: boolean | Earnings$favoritesArgs<ExtArgs>
    _count?: boolean | EarningsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["earnings"]>

  export type EarningsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    country?: boolean
    releaseDate?: boolean
    actualEPS?: boolean
    forecastEPS?: boolean
    previousEPS?: boolean
    actualRevenue?: boolean
    forecastRevenue?: boolean
    previousRevenue?: boolean
    companyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["earnings"]>

  export type EarningsSelectScalar = {
    id?: boolean
    country?: boolean
    releaseDate?: boolean
    actualEPS?: boolean
    forecastEPS?: boolean
    previousEPS?: boolean
    actualRevenue?: boolean
    forecastRevenue?: boolean
    previousRevenue?: boolean
    companyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EarningsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    favorites?: boolean | Earnings$favoritesArgs<ExtArgs>
    _count?: boolean | EarningsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EarningsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }

  export type $EarningsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Earnings"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs>
      favorites: Prisma.$FavoriteEarningsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      country: string
      releaseDate: bigint
      actualEPS: string
      forecastEPS: string
      previousEPS: string
      actualRevenue: string
      forecastRevenue: string
      previousRevenue: string
      companyId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["earnings"]>
    composites: {}
  }

  type EarningsGetPayload<S extends boolean | null | undefined | EarningsDefaultArgs> = $Result.GetResult<Prisma.$EarningsPayload, S>

  type EarningsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EarningsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EarningsCountAggregateInputType | true
    }

  export interface EarningsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Earnings'], meta: { name: 'Earnings' } }
    /**
     * Find zero or one Earnings that matches the filter.
     * @param {EarningsFindUniqueArgs} args - Arguments to find a Earnings
     * @example
     * // Get one Earnings
     * const earnings = await prisma.earnings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EarningsFindUniqueArgs>(args: SelectSubset<T, EarningsFindUniqueArgs<ExtArgs>>): Prisma__EarningsClient<$Result.GetResult<Prisma.$EarningsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Earnings that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EarningsFindUniqueOrThrowArgs} args - Arguments to find a Earnings
     * @example
     * // Get one Earnings
     * const earnings = await prisma.earnings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EarningsFindUniqueOrThrowArgs>(args: SelectSubset<T, EarningsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EarningsClient<$Result.GetResult<Prisma.$EarningsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Earnings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EarningsFindFirstArgs} args - Arguments to find a Earnings
     * @example
     * // Get one Earnings
     * const earnings = await prisma.earnings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EarningsFindFirstArgs>(args?: SelectSubset<T, EarningsFindFirstArgs<ExtArgs>>): Prisma__EarningsClient<$Result.GetResult<Prisma.$EarningsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Earnings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EarningsFindFirstOrThrowArgs} args - Arguments to find a Earnings
     * @example
     * // Get one Earnings
     * const earnings = await prisma.earnings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EarningsFindFirstOrThrowArgs>(args?: SelectSubset<T, EarningsFindFirstOrThrowArgs<ExtArgs>>): Prisma__EarningsClient<$Result.GetResult<Prisma.$EarningsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Earnings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EarningsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Earnings
     * const earnings = await prisma.earnings.findMany()
     * 
     * // Get first 10 Earnings
     * const earnings = await prisma.earnings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const earningsWithIdOnly = await prisma.earnings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EarningsFindManyArgs>(args?: SelectSubset<T, EarningsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EarningsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Earnings.
     * @param {EarningsCreateArgs} args - Arguments to create a Earnings.
     * @example
     * // Create one Earnings
     * const Earnings = await prisma.earnings.create({
     *   data: {
     *     // ... data to create a Earnings
     *   }
     * })
     * 
     */
    create<T extends EarningsCreateArgs>(args: SelectSubset<T, EarningsCreateArgs<ExtArgs>>): Prisma__EarningsClient<$Result.GetResult<Prisma.$EarningsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Earnings.
     * @param {EarningsCreateManyArgs} args - Arguments to create many Earnings.
     * @example
     * // Create many Earnings
     * const earnings = await prisma.earnings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EarningsCreateManyArgs>(args?: SelectSubset<T, EarningsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Earnings and returns the data saved in the database.
     * @param {EarningsCreateManyAndReturnArgs} args - Arguments to create many Earnings.
     * @example
     * // Create many Earnings
     * const earnings = await prisma.earnings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Earnings and only return the `id`
     * const earningsWithIdOnly = await prisma.earnings.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EarningsCreateManyAndReturnArgs>(args?: SelectSubset<T, EarningsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EarningsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Earnings.
     * @param {EarningsDeleteArgs} args - Arguments to delete one Earnings.
     * @example
     * // Delete one Earnings
     * const Earnings = await prisma.earnings.delete({
     *   where: {
     *     // ... filter to delete one Earnings
     *   }
     * })
     * 
     */
    delete<T extends EarningsDeleteArgs>(args: SelectSubset<T, EarningsDeleteArgs<ExtArgs>>): Prisma__EarningsClient<$Result.GetResult<Prisma.$EarningsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Earnings.
     * @param {EarningsUpdateArgs} args - Arguments to update one Earnings.
     * @example
     * // Update one Earnings
     * const earnings = await prisma.earnings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EarningsUpdateArgs>(args: SelectSubset<T, EarningsUpdateArgs<ExtArgs>>): Prisma__EarningsClient<$Result.GetResult<Prisma.$EarningsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Earnings.
     * @param {EarningsDeleteManyArgs} args - Arguments to filter Earnings to delete.
     * @example
     * // Delete a few Earnings
     * const { count } = await prisma.earnings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EarningsDeleteManyArgs>(args?: SelectSubset<T, EarningsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Earnings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EarningsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Earnings
     * const earnings = await prisma.earnings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EarningsUpdateManyArgs>(args: SelectSubset<T, EarningsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Earnings.
     * @param {EarningsUpsertArgs} args - Arguments to update or create a Earnings.
     * @example
     * // Update or create a Earnings
     * const earnings = await prisma.earnings.upsert({
     *   create: {
     *     // ... data to create a Earnings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Earnings we want to update
     *   }
     * })
     */
    upsert<T extends EarningsUpsertArgs>(args: SelectSubset<T, EarningsUpsertArgs<ExtArgs>>): Prisma__EarningsClient<$Result.GetResult<Prisma.$EarningsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Earnings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EarningsCountArgs} args - Arguments to filter Earnings to count.
     * @example
     * // Count the number of Earnings
     * const count = await prisma.earnings.count({
     *   where: {
     *     // ... the filter for the Earnings we want to count
     *   }
     * })
    **/
    count<T extends EarningsCountArgs>(
      args?: Subset<T, EarningsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EarningsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Earnings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EarningsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EarningsAggregateArgs>(args: Subset<T, EarningsAggregateArgs>): Prisma.PrismaPromise<GetEarningsAggregateType<T>>

    /**
     * Group by Earnings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EarningsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EarningsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EarningsGroupByArgs['orderBy'] }
        : { orderBy?: EarningsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EarningsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEarningsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Earnings model
   */
  readonly fields: EarningsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Earnings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EarningsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    favorites<T extends Earnings$favoritesArgs<ExtArgs> = {}>(args?: Subset<T, Earnings$favoritesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FavoriteEarningsPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Earnings model
   */ 
  interface EarningsFieldRefs {
    readonly id: FieldRef<"Earnings", 'Int'>
    readonly country: FieldRef<"Earnings", 'String'>
    readonly releaseDate: FieldRef<"Earnings", 'BigInt'>
    readonly actualEPS: FieldRef<"Earnings", 'String'>
    readonly forecastEPS: FieldRef<"Earnings", 'String'>
    readonly previousEPS: FieldRef<"Earnings", 'String'>
    readonly actualRevenue: FieldRef<"Earnings", 'String'>
    readonly forecastRevenue: FieldRef<"Earnings", 'String'>
    readonly previousRevenue: FieldRef<"Earnings", 'String'>
    readonly companyId: FieldRef<"Earnings", 'Int'>
    readonly createdAt: FieldRef<"Earnings", 'DateTime'>
    readonly updatedAt: FieldRef<"Earnings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Earnings findUnique
   */
  export type EarningsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Earnings
     */
    select?: EarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EarningsInclude<ExtArgs> | null
    /**
     * Filter, which Earnings to fetch.
     */
    where: EarningsWhereUniqueInput
  }

  /**
   * Earnings findUniqueOrThrow
   */
  export type EarningsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Earnings
     */
    select?: EarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EarningsInclude<ExtArgs> | null
    /**
     * Filter, which Earnings to fetch.
     */
    where: EarningsWhereUniqueInput
  }

  /**
   * Earnings findFirst
   */
  export type EarningsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Earnings
     */
    select?: EarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EarningsInclude<ExtArgs> | null
    /**
     * Filter, which Earnings to fetch.
     */
    where?: EarningsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Earnings to fetch.
     */
    orderBy?: EarningsOrderByWithRelationInput | EarningsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Earnings.
     */
    cursor?: EarningsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Earnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Earnings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Earnings.
     */
    distinct?: EarningsScalarFieldEnum | EarningsScalarFieldEnum[]
  }

  /**
   * Earnings findFirstOrThrow
   */
  export type EarningsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Earnings
     */
    select?: EarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EarningsInclude<ExtArgs> | null
    /**
     * Filter, which Earnings to fetch.
     */
    where?: EarningsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Earnings to fetch.
     */
    orderBy?: EarningsOrderByWithRelationInput | EarningsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Earnings.
     */
    cursor?: EarningsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Earnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Earnings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Earnings.
     */
    distinct?: EarningsScalarFieldEnum | EarningsScalarFieldEnum[]
  }

  /**
   * Earnings findMany
   */
  export type EarningsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Earnings
     */
    select?: EarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EarningsInclude<ExtArgs> | null
    /**
     * Filter, which Earnings to fetch.
     */
    where?: EarningsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Earnings to fetch.
     */
    orderBy?: EarningsOrderByWithRelationInput | EarningsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Earnings.
     */
    cursor?: EarningsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Earnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Earnings.
     */
    skip?: number
    distinct?: EarningsScalarFieldEnum | EarningsScalarFieldEnum[]
  }

  /**
   * Earnings create
   */
  export type EarningsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Earnings
     */
    select?: EarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EarningsInclude<ExtArgs> | null
    /**
     * The data needed to create a Earnings.
     */
    data: XOR<EarningsCreateInput, EarningsUncheckedCreateInput>
  }

  /**
   * Earnings createMany
   */
  export type EarningsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Earnings.
     */
    data: EarningsCreateManyInput | EarningsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Earnings createManyAndReturn
   */
  export type EarningsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Earnings
     */
    select?: EarningsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Earnings.
     */
    data: EarningsCreateManyInput | EarningsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EarningsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Earnings update
   */
  export type EarningsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Earnings
     */
    select?: EarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EarningsInclude<ExtArgs> | null
    /**
     * The data needed to update a Earnings.
     */
    data: XOR<EarningsUpdateInput, EarningsUncheckedUpdateInput>
    /**
     * Choose, which Earnings to update.
     */
    where: EarningsWhereUniqueInput
  }

  /**
   * Earnings updateMany
   */
  export type EarningsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Earnings.
     */
    data: XOR<EarningsUpdateManyMutationInput, EarningsUncheckedUpdateManyInput>
    /**
     * Filter which Earnings to update
     */
    where?: EarningsWhereInput
  }

  /**
   * Earnings upsert
   */
  export type EarningsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Earnings
     */
    select?: EarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EarningsInclude<ExtArgs> | null
    /**
     * The filter to search for the Earnings to update in case it exists.
     */
    where: EarningsWhereUniqueInput
    /**
     * In case the Earnings found by the `where` argument doesn't exist, create a new Earnings with this data.
     */
    create: XOR<EarningsCreateInput, EarningsUncheckedCreateInput>
    /**
     * In case the Earnings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EarningsUpdateInput, EarningsUncheckedUpdateInput>
  }

  /**
   * Earnings delete
   */
  export type EarningsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Earnings
     */
    select?: EarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EarningsInclude<ExtArgs> | null
    /**
     * Filter which Earnings to delete.
     */
    where: EarningsWhereUniqueInput
  }

  /**
   * Earnings deleteMany
   */
  export type EarningsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Earnings to delete
     */
    where?: EarningsWhereInput
  }

  /**
   * Earnings.favorites
   */
  export type Earnings$favoritesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsInclude<ExtArgs> | null
    where?: FavoriteEarningsWhereInput
    orderBy?: FavoriteEarningsOrderByWithRelationInput | FavoriteEarningsOrderByWithRelationInput[]
    cursor?: FavoriteEarningsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FavoriteEarningsScalarFieldEnum | FavoriteEarningsScalarFieldEnum[]
  }

  /**
   * Earnings without action
   */
  export type EarningsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Earnings
     */
    select?: EarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EarningsInclude<ExtArgs> | null
  }


  /**
   * Model Dividend
   */

  export type AggregateDividend = {
    _count: DividendCountAggregateOutputType | null
    _avg: DividendAvgAggregateOutputType | null
    _sum: DividendSumAggregateOutputType | null
    _min: DividendMinAggregateOutputType | null
    _max: DividendMaxAggregateOutputType | null
  }

  export type DividendAvgAggregateOutputType = {
    id: number | null
    exDividendDate: number | null
    paymentDate: number | null
    companyId: number | null
  }

  export type DividendSumAggregateOutputType = {
    id: number | null
    exDividendDate: bigint | null
    paymentDate: bigint | null
    companyId: number | null
  }

  export type DividendMinAggregateOutputType = {
    id: number | null
    country: string | null
    exDividendDate: bigint | null
    dividendAmount: string | null
    previousDividendAmount: string | null
    paymentDate: bigint | null
    companyId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DividendMaxAggregateOutputType = {
    id: number | null
    country: string | null
    exDividendDate: bigint | null
    dividendAmount: string | null
    previousDividendAmount: string | null
    paymentDate: bigint | null
    companyId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DividendCountAggregateOutputType = {
    id: number
    country: number
    exDividendDate: number
    dividendAmount: number
    previousDividendAmount: number
    paymentDate: number
    companyId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DividendAvgAggregateInputType = {
    id?: true
    exDividendDate?: true
    paymentDate?: true
    companyId?: true
  }

  export type DividendSumAggregateInputType = {
    id?: true
    exDividendDate?: true
    paymentDate?: true
    companyId?: true
  }

  export type DividendMinAggregateInputType = {
    id?: true
    country?: true
    exDividendDate?: true
    dividendAmount?: true
    previousDividendAmount?: true
    paymentDate?: true
    companyId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DividendMaxAggregateInputType = {
    id?: true
    country?: true
    exDividendDate?: true
    dividendAmount?: true
    previousDividendAmount?: true
    paymentDate?: true
    companyId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DividendCountAggregateInputType = {
    id?: true
    country?: true
    exDividendDate?: true
    dividendAmount?: true
    previousDividendAmount?: true
    paymentDate?: true
    companyId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DividendAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dividend to aggregate.
     */
    where?: DividendWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dividends to fetch.
     */
    orderBy?: DividendOrderByWithRelationInput | DividendOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DividendWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dividends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dividends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Dividends
    **/
    _count?: true | DividendCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DividendAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DividendSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DividendMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DividendMaxAggregateInputType
  }

  export type GetDividendAggregateType<T extends DividendAggregateArgs> = {
        [P in keyof T & keyof AggregateDividend]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDividend[P]>
      : GetScalarType<T[P], AggregateDividend[P]>
  }




  export type DividendGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DividendWhereInput
    orderBy?: DividendOrderByWithAggregationInput | DividendOrderByWithAggregationInput[]
    by: DividendScalarFieldEnum[] | DividendScalarFieldEnum
    having?: DividendScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DividendCountAggregateInputType | true
    _avg?: DividendAvgAggregateInputType
    _sum?: DividendSumAggregateInputType
    _min?: DividendMinAggregateInputType
    _max?: DividendMaxAggregateInputType
  }

  export type DividendGroupByOutputType = {
    id: number
    country: string
    exDividendDate: bigint
    dividendAmount: string
    previousDividendAmount: string
    paymentDate: bigint
    companyId: number
    createdAt: Date
    updatedAt: Date
    _count: DividendCountAggregateOutputType | null
    _avg: DividendAvgAggregateOutputType | null
    _sum: DividendSumAggregateOutputType | null
    _min: DividendMinAggregateOutputType | null
    _max: DividendMaxAggregateOutputType | null
  }

  type GetDividendGroupByPayload<T extends DividendGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DividendGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DividendGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DividendGroupByOutputType[P]>
            : GetScalarType<T[P], DividendGroupByOutputType[P]>
        }
      >
    >


  export type DividendSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    country?: boolean
    exDividendDate?: boolean
    dividendAmount?: boolean
    previousDividendAmount?: boolean
    paymentDate?: boolean
    companyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    favorites?: boolean | Dividend$favoritesArgs<ExtArgs>
    _count?: boolean | DividendCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dividend"]>

  export type DividendSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    country?: boolean
    exDividendDate?: boolean
    dividendAmount?: boolean
    previousDividendAmount?: boolean
    paymentDate?: boolean
    companyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dividend"]>

  export type DividendSelectScalar = {
    id?: boolean
    country?: boolean
    exDividendDate?: boolean
    dividendAmount?: boolean
    previousDividendAmount?: boolean
    paymentDate?: boolean
    companyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DividendInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    favorites?: boolean | Dividend$favoritesArgs<ExtArgs>
    _count?: boolean | DividendCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DividendIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }

  export type $DividendPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Dividend"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs>
      favorites: Prisma.$FavoriteDividendsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      country: string
      exDividendDate: bigint
      dividendAmount: string
      previousDividendAmount: string
      paymentDate: bigint
      companyId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dividend"]>
    composites: {}
  }

  type DividendGetPayload<S extends boolean | null | undefined | DividendDefaultArgs> = $Result.GetResult<Prisma.$DividendPayload, S>

  type DividendCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DividendFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DividendCountAggregateInputType | true
    }

  export interface DividendDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Dividend'], meta: { name: 'Dividend' } }
    /**
     * Find zero or one Dividend that matches the filter.
     * @param {DividendFindUniqueArgs} args - Arguments to find a Dividend
     * @example
     * // Get one Dividend
     * const dividend = await prisma.dividend.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DividendFindUniqueArgs>(args: SelectSubset<T, DividendFindUniqueArgs<ExtArgs>>): Prisma__DividendClient<$Result.GetResult<Prisma.$DividendPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Dividend that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DividendFindUniqueOrThrowArgs} args - Arguments to find a Dividend
     * @example
     * // Get one Dividend
     * const dividend = await prisma.dividend.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DividendFindUniqueOrThrowArgs>(args: SelectSubset<T, DividendFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DividendClient<$Result.GetResult<Prisma.$DividendPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Dividend that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DividendFindFirstArgs} args - Arguments to find a Dividend
     * @example
     * // Get one Dividend
     * const dividend = await prisma.dividend.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DividendFindFirstArgs>(args?: SelectSubset<T, DividendFindFirstArgs<ExtArgs>>): Prisma__DividendClient<$Result.GetResult<Prisma.$DividendPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Dividend that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DividendFindFirstOrThrowArgs} args - Arguments to find a Dividend
     * @example
     * // Get one Dividend
     * const dividend = await prisma.dividend.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DividendFindFirstOrThrowArgs>(args?: SelectSubset<T, DividendFindFirstOrThrowArgs<ExtArgs>>): Prisma__DividendClient<$Result.GetResult<Prisma.$DividendPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Dividends that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DividendFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dividends
     * const dividends = await prisma.dividend.findMany()
     * 
     * // Get first 10 Dividends
     * const dividends = await prisma.dividend.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dividendWithIdOnly = await prisma.dividend.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DividendFindManyArgs>(args?: SelectSubset<T, DividendFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DividendPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Dividend.
     * @param {DividendCreateArgs} args - Arguments to create a Dividend.
     * @example
     * // Create one Dividend
     * const Dividend = await prisma.dividend.create({
     *   data: {
     *     // ... data to create a Dividend
     *   }
     * })
     * 
     */
    create<T extends DividendCreateArgs>(args: SelectSubset<T, DividendCreateArgs<ExtArgs>>): Prisma__DividendClient<$Result.GetResult<Prisma.$DividendPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Dividends.
     * @param {DividendCreateManyArgs} args - Arguments to create many Dividends.
     * @example
     * // Create many Dividends
     * const dividend = await prisma.dividend.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DividendCreateManyArgs>(args?: SelectSubset<T, DividendCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Dividends and returns the data saved in the database.
     * @param {DividendCreateManyAndReturnArgs} args - Arguments to create many Dividends.
     * @example
     * // Create many Dividends
     * const dividend = await prisma.dividend.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Dividends and only return the `id`
     * const dividendWithIdOnly = await prisma.dividend.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DividendCreateManyAndReturnArgs>(args?: SelectSubset<T, DividendCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DividendPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Dividend.
     * @param {DividendDeleteArgs} args - Arguments to delete one Dividend.
     * @example
     * // Delete one Dividend
     * const Dividend = await prisma.dividend.delete({
     *   where: {
     *     // ... filter to delete one Dividend
     *   }
     * })
     * 
     */
    delete<T extends DividendDeleteArgs>(args: SelectSubset<T, DividendDeleteArgs<ExtArgs>>): Prisma__DividendClient<$Result.GetResult<Prisma.$DividendPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Dividend.
     * @param {DividendUpdateArgs} args - Arguments to update one Dividend.
     * @example
     * // Update one Dividend
     * const dividend = await prisma.dividend.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DividendUpdateArgs>(args: SelectSubset<T, DividendUpdateArgs<ExtArgs>>): Prisma__DividendClient<$Result.GetResult<Prisma.$DividendPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Dividends.
     * @param {DividendDeleteManyArgs} args - Arguments to filter Dividends to delete.
     * @example
     * // Delete a few Dividends
     * const { count } = await prisma.dividend.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DividendDeleteManyArgs>(args?: SelectSubset<T, DividendDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dividends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DividendUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dividends
     * const dividend = await prisma.dividend.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DividendUpdateManyArgs>(args: SelectSubset<T, DividendUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Dividend.
     * @param {DividendUpsertArgs} args - Arguments to update or create a Dividend.
     * @example
     * // Update or create a Dividend
     * const dividend = await prisma.dividend.upsert({
     *   create: {
     *     // ... data to create a Dividend
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dividend we want to update
     *   }
     * })
     */
    upsert<T extends DividendUpsertArgs>(args: SelectSubset<T, DividendUpsertArgs<ExtArgs>>): Prisma__DividendClient<$Result.GetResult<Prisma.$DividendPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Dividends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DividendCountArgs} args - Arguments to filter Dividends to count.
     * @example
     * // Count the number of Dividends
     * const count = await prisma.dividend.count({
     *   where: {
     *     // ... the filter for the Dividends we want to count
     *   }
     * })
    **/
    count<T extends DividendCountArgs>(
      args?: Subset<T, DividendCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DividendCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dividend.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DividendAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DividendAggregateArgs>(args: Subset<T, DividendAggregateArgs>): Prisma.PrismaPromise<GetDividendAggregateType<T>>

    /**
     * Group by Dividend.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DividendGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DividendGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DividendGroupByArgs['orderBy'] }
        : { orderBy?: DividendGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DividendGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDividendGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Dividend model
   */
  readonly fields: DividendFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Dividend.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DividendClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    favorites<T extends Dividend$favoritesArgs<ExtArgs> = {}>(args?: Subset<T, Dividend$favoritesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FavoriteDividendsPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Dividend model
   */ 
  interface DividendFieldRefs {
    readonly id: FieldRef<"Dividend", 'Int'>
    readonly country: FieldRef<"Dividend", 'String'>
    readonly exDividendDate: FieldRef<"Dividend", 'BigInt'>
    readonly dividendAmount: FieldRef<"Dividend", 'String'>
    readonly previousDividendAmount: FieldRef<"Dividend", 'String'>
    readonly paymentDate: FieldRef<"Dividend", 'BigInt'>
    readonly companyId: FieldRef<"Dividend", 'Int'>
    readonly createdAt: FieldRef<"Dividend", 'DateTime'>
    readonly updatedAt: FieldRef<"Dividend", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Dividend findUnique
   */
  export type DividendFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dividend
     */
    select?: DividendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DividendInclude<ExtArgs> | null
    /**
     * Filter, which Dividend to fetch.
     */
    where: DividendWhereUniqueInput
  }

  /**
   * Dividend findUniqueOrThrow
   */
  export type DividendFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dividend
     */
    select?: DividendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DividendInclude<ExtArgs> | null
    /**
     * Filter, which Dividend to fetch.
     */
    where: DividendWhereUniqueInput
  }

  /**
   * Dividend findFirst
   */
  export type DividendFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dividend
     */
    select?: DividendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DividendInclude<ExtArgs> | null
    /**
     * Filter, which Dividend to fetch.
     */
    where?: DividendWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dividends to fetch.
     */
    orderBy?: DividendOrderByWithRelationInput | DividendOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dividends.
     */
    cursor?: DividendWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dividends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dividends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dividends.
     */
    distinct?: DividendScalarFieldEnum | DividendScalarFieldEnum[]
  }

  /**
   * Dividend findFirstOrThrow
   */
  export type DividendFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dividend
     */
    select?: DividendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DividendInclude<ExtArgs> | null
    /**
     * Filter, which Dividend to fetch.
     */
    where?: DividendWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dividends to fetch.
     */
    orderBy?: DividendOrderByWithRelationInput | DividendOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dividends.
     */
    cursor?: DividendWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dividends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dividends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dividends.
     */
    distinct?: DividendScalarFieldEnum | DividendScalarFieldEnum[]
  }

  /**
   * Dividend findMany
   */
  export type DividendFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dividend
     */
    select?: DividendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DividendInclude<ExtArgs> | null
    /**
     * Filter, which Dividends to fetch.
     */
    where?: DividendWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dividends to fetch.
     */
    orderBy?: DividendOrderByWithRelationInput | DividendOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Dividends.
     */
    cursor?: DividendWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dividends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dividends.
     */
    skip?: number
    distinct?: DividendScalarFieldEnum | DividendScalarFieldEnum[]
  }

  /**
   * Dividend create
   */
  export type DividendCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dividend
     */
    select?: DividendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DividendInclude<ExtArgs> | null
    /**
     * The data needed to create a Dividend.
     */
    data: XOR<DividendCreateInput, DividendUncheckedCreateInput>
  }

  /**
   * Dividend createMany
   */
  export type DividendCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Dividends.
     */
    data: DividendCreateManyInput | DividendCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Dividend createManyAndReturn
   */
  export type DividendCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dividend
     */
    select?: DividendSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Dividends.
     */
    data: DividendCreateManyInput | DividendCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DividendIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Dividend update
   */
  export type DividendUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dividend
     */
    select?: DividendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DividendInclude<ExtArgs> | null
    /**
     * The data needed to update a Dividend.
     */
    data: XOR<DividendUpdateInput, DividendUncheckedUpdateInput>
    /**
     * Choose, which Dividend to update.
     */
    where: DividendWhereUniqueInput
  }

  /**
   * Dividend updateMany
   */
  export type DividendUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Dividends.
     */
    data: XOR<DividendUpdateManyMutationInput, DividendUncheckedUpdateManyInput>
    /**
     * Filter which Dividends to update
     */
    where?: DividendWhereInput
  }

  /**
   * Dividend upsert
   */
  export type DividendUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dividend
     */
    select?: DividendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DividendInclude<ExtArgs> | null
    /**
     * The filter to search for the Dividend to update in case it exists.
     */
    where: DividendWhereUniqueInput
    /**
     * In case the Dividend found by the `where` argument doesn't exist, create a new Dividend with this data.
     */
    create: XOR<DividendCreateInput, DividendUncheckedCreateInput>
    /**
     * In case the Dividend was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DividendUpdateInput, DividendUncheckedUpdateInput>
  }

  /**
   * Dividend delete
   */
  export type DividendDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dividend
     */
    select?: DividendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DividendInclude<ExtArgs> | null
    /**
     * Filter which Dividend to delete.
     */
    where: DividendWhereUniqueInput
  }

  /**
   * Dividend deleteMany
   */
  export type DividendDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dividends to delete
     */
    where?: DividendWhereInput
  }

  /**
   * Dividend.favorites
   */
  export type Dividend$favoritesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsInclude<ExtArgs> | null
    where?: FavoriteDividendsWhereInput
    orderBy?: FavoriteDividendsOrderByWithRelationInput | FavoriteDividendsOrderByWithRelationInput[]
    cursor?: FavoriteDividendsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FavoriteDividendsScalarFieldEnum | FavoriteDividendsScalarFieldEnum[]
  }

  /**
   * Dividend without action
   */
  export type DividendDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dividend
     */
    select?: DividendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DividendInclude<ExtArgs> | null
  }


  /**
   * Model EconomicIndicator
   */

  export type AggregateEconomicIndicator = {
    _count: EconomicIndicatorCountAggregateOutputType | null
    _avg: EconomicIndicatorAvgAggregateOutputType | null
    _sum: EconomicIndicatorSumAggregateOutputType | null
    _min: EconomicIndicatorMinAggregateOutputType | null
    _max: EconomicIndicatorMaxAggregateOutputType | null
  }

  export type EconomicIndicatorAvgAggregateOutputType = {
    id: number | null
    releaseDate: number | null
    importance: number | null
  }

  export type EconomicIndicatorSumAggregateOutputType = {
    id: number | null
    releaseDate: bigint | null
    importance: number | null
  }

  export type EconomicIndicatorMinAggregateOutputType = {
    id: number | null
    country: string | null
    releaseDate: bigint | null
    name: string | null
    importance: number | null
    actual: string | null
    forecast: string | null
    previous: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EconomicIndicatorMaxAggregateOutputType = {
    id: number | null
    country: string | null
    releaseDate: bigint | null
    name: string | null
    importance: number | null
    actual: string | null
    forecast: string | null
    previous: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EconomicIndicatorCountAggregateOutputType = {
    id: number
    country: number
    releaseDate: number
    name: number
    importance: number
    actual: number
    forecast: number
    previous: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EconomicIndicatorAvgAggregateInputType = {
    id?: true
    releaseDate?: true
    importance?: true
  }

  export type EconomicIndicatorSumAggregateInputType = {
    id?: true
    releaseDate?: true
    importance?: true
  }

  export type EconomicIndicatorMinAggregateInputType = {
    id?: true
    country?: true
    releaseDate?: true
    name?: true
    importance?: true
    actual?: true
    forecast?: true
    previous?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EconomicIndicatorMaxAggregateInputType = {
    id?: true
    country?: true
    releaseDate?: true
    name?: true
    importance?: true
    actual?: true
    forecast?: true
    previous?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EconomicIndicatorCountAggregateInputType = {
    id?: true
    country?: true
    releaseDate?: true
    name?: true
    importance?: true
    actual?: true
    forecast?: true
    previous?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EconomicIndicatorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EconomicIndicator to aggregate.
     */
    where?: EconomicIndicatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EconomicIndicators to fetch.
     */
    orderBy?: EconomicIndicatorOrderByWithRelationInput | EconomicIndicatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EconomicIndicatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EconomicIndicators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EconomicIndicators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EconomicIndicators
    **/
    _count?: true | EconomicIndicatorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EconomicIndicatorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EconomicIndicatorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EconomicIndicatorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EconomicIndicatorMaxAggregateInputType
  }

  export type GetEconomicIndicatorAggregateType<T extends EconomicIndicatorAggregateArgs> = {
        [P in keyof T & keyof AggregateEconomicIndicator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEconomicIndicator[P]>
      : GetScalarType<T[P], AggregateEconomicIndicator[P]>
  }




  export type EconomicIndicatorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EconomicIndicatorWhereInput
    orderBy?: EconomicIndicatorOrderByWithAggregationInput | EconomicIndicatorOrderByWithAggregationInput[]
    by: EconomicIndicatorScalarFieldEnum[] | EconomicIndicatorScalarFieldEnum
    having?: EconomicIndicatorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EconomicIndicatorCountAggregateInputType | true
    _avg?: EconomicIndicatorAvgAggregateInputType
    _sum?: EconomicIndicatorSumAggregateInputType
    _min?: EconomicIndicatorMinAggregateInputType
    _max?: EconomicIndicatorMaxAggregateInputType
  }

  export type EconomicIndicatorGroupByOutputType = {
    id: number
    country: string
    releaseDate: bigint
    name: string
    importance: number
    actual: string
    forecast: string
    previous: string
    createdAt: Date
    updatedAt: Date
    _count: EconomicIndicatorCountAggregateOutputType | null
    _avg: EconomicIndicatorAvgAggregateOutputType | null
    _sum: EconomicIndicatorSumAggregateOutputType | null
    _min: EconomicIndicatorMinAggregateOutputType | null
    _max: EconomicIndicatorMaxAggregateOutputType | null
  }

  type GetEconomicIndicatorGroupByPayload<T extends EconomicIndicatorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EconomicIndicatorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EconomicIndicatorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EconomicIndicatorGroupByOutputType[P]>
            : GetScalarType<T[P], EconomicIndicatorGroupByOutputType[P]>
        }
      >
    >


  export type EconomicIndicatorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    country?: boolean
    releaseDate?: boolean
    name?: boolean
    importance?: boolean
    actual?: boolean
    forecast?: boolean
    previous?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    favorites?: boolean | EconomicIndicator$favoritesArgs<ExtArgs>
    _count?: boolean | EconomicIndicatorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["economicIndicator"]>

  export type EconomicIndicatorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    country?: boolean
    releaseDate?: boolean
    name?: boolean
    importance?: boolean
    actual?: boolean
    forecast?: boolean
    previous?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["economicIndicator"]>

  export type EconomicIndicatorSelectScalar = {
    id?: boolean
    country?: boolean
    releaseDate?: boolean
    name?: boolean
    importance?: boolean
    actual?: boolean
    forecast?: boolean
    previous?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EconomicIndicatorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    favorites?: boolean | EconomicIndicator$favoritesArgs<ExtArgs>
    _count?: boolean | EconomicIndicatorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EconomicIndicatorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EconomicIndicatorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EconomicIndicator"
    objects: {
      favorites: Prisma.$FavoriteIndicatorPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      country: string
      releaseDate: bigint
      name: string
      importance: number
      actual: string
      forecast: string
      previous: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["economicIndicator"]>
    composites: {}
  }

  type EconomicIndicatorGetPayload<S extends boolean | null | undefined | EconomicIndicatorDefaultArgs> = $Result.GetResult<Prisma.$EconomicIndicatorPayload, S>

  type EconomicIndicatorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EconomicIndicatorFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EconomicIndicatorCountAggregateInputType | true
    }

  export interface EconomicIndicatorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EconomicIndicator'], meta: { name: 'EconomicIndicator' } }
    /**
     * Find zero or one EconomicIndicator that matches the filter.
     * @param {EconomicIndicatorFindUniqueArgs} args - Arguments to find a EconomicIndicator
     * @example
     * // Get one EconomicIndicator
     * const economicIndicator = await prisma.economicIndicator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EconomicIndicatorFindUniqueArgs>(args: SelectSubset<T, EconomicIndicatorFindUniqueArgs<ExtArgs>>): Prisma__EconomicIndicatorClient<$Result.GetResult<Prisma.$EconomicIndicatorPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EconomicIndicator that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EconomicIndicatorFindUniqueOrThrowArgs} args - Arguments to find a EconomicIndicator
     * @example
     * // Get one EconomicIndicator
     * const economicIndicator = await prisma.economicIndicator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EconomicIndicatorFindUniqueOrThrowArgs>(args: SelectSubset<T, EconomicIndicatorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EconomicIndicatorClient<$Result.GetResult<Prisma.$EconomicIndicatorPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EconomicIndicator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EconomicIndicatorFindFirstArgs} args - Arguments to find a EconomicIndicator
     * @example
     * // Get one EconomicIndicator
     * const economicIndicator = await prisma.economicIndicator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EconomicIndicatorFindFirstArgs>(args?: SelectSubset<T, EconomicIndicatorFindFirstArgs<ExtArgs>>): Prisma__EconomicIndicatorClient<$Result.GetResult<Prisma.$EconomicIndicatorPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EconomicIndicator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EconomicIndicatorFindFirstOrThrowArgs} args - Arguments to find a EconomicIndicator
     * @example
     * // Get one EconomicIndicator
     * const economicIndicator = await prisma.economicIndicator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EconomicIndicatorFindFirstOrThrowArgs>(args?: SelectSubset<T, EconomicIndicatorFindFirstOrThrowArgs<ExtArgs>>): Prisma__EconomicIndicatorClient<$Result.GetResult<Prisma.$EconomicIndicatorPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EconomicIndicators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EconomicIndicatorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EconomicIndicators
     * const economicIndicators = await prisma.economicIndicator.findMany()
     * 
     * // Get first 10 EconomicIndicators
     * const economicIndicators = await prisma.economicIndicator.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const economicIndicatorWithIdOnly = await prisma.economicIndicator.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EconomicIndicatorFindManyArgs>(args?: SelectSubset<T, EconomicIndicatorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EconomicIndicatorPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EconomicIndicator.
     * @param {EconomicIndicatorCreateArgs} args - Arguments to create a EconomicIndicator.
     * @example
     * // Create one EconomicIndicator
     * const EconomicIndicator = await prisma.economicIndicator.create({
     *   data: {
     *     // ... data to create a EconomicIndicator
     *   }
     * })
     * 
     */
    create<T extends EconomicIndicatorCreateArgs>(args: SelectSubset<T, EconomicIndicatorCreateArgs<ExtArgs>>): Prisma__EconomicIndicatorClient<$Result.GetResult<Prisma.$EconomicIndicatorPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EconomicIndicators.
     * @param {EconomicIndicatorCreateManyArgs} args - Arguments to create many EconomicIndicators.
     * @example
     * // Create many EconomicIndicators
     * const economicIndicator = await prisma.economicIndicator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EconomicIndicatorCreateManyArgs>(args?: SelectSubset<T, EconomicIndicatorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EconomicIndicators and returns the data saved in the database.
     * @param {EconomicIndicatorCreateManyAndReturnArgs} args - Arguments to create many EconomicIndicators.
     * @example
     * // Create many EconomicIndicators
     * const economicIndicator = await prisma.economicIndicator.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EconomicIndicators and only return the `id`
     * const economicIndicatorWithIdOnly = await prisma.economicIndicator.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EconomicIndicatorCreateManyAndReturnArgs>(args?: SelectSubset<T, EconomicIndicatorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EconomicIndicatorPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EconomicIndicator.
     * @param {EconomicIndicatorDeleteArgs} args - Arguments to delete one EconomicIndicator.
     * @example
     * // Delete one EconomicIndicator
     * const EconomicIndicator = await prisma.economicIndicator.delete({
     *   where: {
     *     // ... filter to delete one EconomicIndicator
     *   }
     * })
     * 
     */
    delete<T extends EconomicIndicatorDeleteArgs>(args: SelectSubset<T, EconomicIndicatorDeleteArgs<ExtArgs>>): Prisma__EconomicIndicatorClient<$Result.GetResult<Prisma.$EconomicIndicatorPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EconomicIndicator.
     * @param {EconomicIndicatorUpdateArgs} args - Arguments to update one EconomicIndicator.
     * @example
     * // Update one EconomicIndicator
     * const economicIndicator = await prisma.economicIndicator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EconomicIndicatorUpdateArgs>(args: SelectSubset<T, EconomicIndicatorUpdateArgs<ExtArgs>>): Prisma__EconomicIndicatorClient<$Result.GetResult<Prisma.$EconomicIndicatorPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EconomicIndicators.
     * @param {EconomicIndicatorDeleteManyArgs} args - Arguments to filter EconomicIndicators to delete.
     * @example
     * // Delete a few EconomicIndicators
     * const { count } = await prisma.economicIndicator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EconomicIndicatorDeleteManyArgs>(args?: SelectSubset<T, EconomicIndicatorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EconomicIndicators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EconomicIndicatorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EconomicIndicators
     * const economicIndicator = await prisma.economicIndicator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EconomicIndicatorUpdateManyArgs>(args: SelectSubset<T, EconomicIndicatorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EconomicIndicator.
     * @param {EconomicIndicatorUpsertArgs} args - Arguments to update or create a EconomicIndicator.
     * @example
     * // Update or create a EconomicIndicator
     * const economicIndicator = await prisma.economicIndicator.upsert({
     *   create: {
     *     // ... data to create a EconomicIndicator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EconomicIndicator we want to update
     *   }
     * })
     */
    upsert<T extends EconomicIndicatorUpsertArgs>(args: SelectSubset<T, EconomicIndicatorUpsertArgs<ExtArgs>>): Prisma__EconomicIndicatorClient<$Result.GetResult<Prisma.$EconomicIndicatorPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EconomicIndicators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EconomicIndicatorCountArgs} args - Arguments to filter EconomicIndicators to count.
     * @example
     * // Count the number of EconomicIndicators
     * const count = await prisma.economicIndicator.count({
     *   where: {
     *     // ... the filter for the EconomicIndicators we want to count
     *   }
     * })
    **/
    count<T extends EconomicIndicatorCountArgs>(
      args?: Subset<T, EconomicIndicatorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EconomicIndicatorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EconomicIndicator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EconomicIndicatorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EconomicIndicatorAggregateArgs>(args: Subset<T, EconomicIndicatorAggregateArgs>): Prisma.PrismaPromise<GetEconomicIndicatorAggregateType<T>>

    /**
     * Group by EconomicIndicator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EconomicIndicatorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EconomicIndicatorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EconomicIndicatorGroupByArgs['orderBy'] }
        : { orderBy?: EconomicIndicatorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EconomicIndicatorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEconomicIndicatorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EconomicIndicator model
   */
  readonly fields: EconomicIndicatorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EconomicIndicator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EconomicIndicatorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    favorites<T extends EconomicIndicator$favoritesArgs<ExtArgs> = {}>(args?: Subset<T, EconomicIndicator$favoritesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FavoriteIndicatorPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EconomicIndicator model
   */ 
  interface EconomicIndicatorFieldRefs {
    readonly id: FieldRef<"EconomicIndicator", 'Int'>
    readonly country: FieldRef<"EconomicIndicator", 'String'>
    readonly releaseDate: FieldRef<"EconomicIndicator", 'BigInt'>
    readonly name: FieldRef<"EconomicIndicator", 'String'>
    readonly importance: FieldRef<"EconomicIndicator", 'Int'>
    readonly actual: FieldRef<"EconomicIndicator", 'String'>
    readonly forecast: FieldRef<"EconomicIndicator", 'String'>
    readonly previous: FieldRef<"EconomicIndicator", 'String'>
    readonly createdAt: FieldRef<"EconomicIndicator", 'DateTime'>
    readonly updatedAt: FieldRef<"EconomicIndicator", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EconomicIndicator findUnique
   */
  export type EconomicIndicatorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EconomicIndicator
     */
    select?: EconomicIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EconomicIndicatorInclude<ExtArgs> | null
    /**
     * Filter, which EconomicIndicator to fetch.
     */
    where: EconomicIndicatorWhereUniqueInput
  }

  /**
   * EconomicIndicator findUniqueOrThrow
   */
  export type EconomicIndicatorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EconomicIndicator
     */
    select?: EconomicIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EconomicIndicatorInclude<ExtArgs> | null
    /**
     * Filter, which EconomicIndicator to fetch.
     */
    where: EconomicIndicatorWhereUniqueInput
  }

  /**
   * EconomicIndicator findFirst
   */
  export type EconomicIndicatorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EconomicIndicator
     */
    select?: EconomicIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EconomicIndicatorInclude<ExtArgs> | null
    /**
     * Filter, which EconomicIndicator to fetch.
     */
    where?: EconomicIndicatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EconomicIndicators to fetch.
     */
    orderBy?: EconomicIndicatorOrderByWithRelationInput | EconomicIndicatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EconomicIndicators.
     */
    cursor?: EconomicIndicatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EconomicIndicators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EconomicIndicators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EconomicIndicators.
     */
    distinct?: EconomicIndicatorScalarFieldEnum | EconomicIndicatorScalarFieldEnum[]
  }

  /**
   * EconomicIndicator findFirstOrThrow
   */
  export type EconomicIndicatorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EconomicIndicator
     */
    select?: EconomicIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EconomicIndicatorInclude<ExtArgs> | null
    /**
     * Filter, which EconomicIndicator to fetch.
     */
    where?: EconomicIndicatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EconomicIndicators to fetch.
     */
    orderBy?: EconomicIndicatorOrderByWithRelationInput | EconomicIndicatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EconomicIndicators.
     */
    cursor?: EconomicIndicatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EconomicIndicators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EconomicIndicators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EconomicIndicators.
     */
    distinct?: EconomicIndicatorScalarFieldEnum | EconomicIndicatorScalarFieldEnum[]
  }

  /**
   * EconomicIndicator findMany
   */
  export type EconomicIndicatorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EconomicIndicator
     */
    select?: EconomicIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EconomicIndicatorInclude<ExtArgs> | null
    /**
     * Filter, which EconomicIndicators to fetch.
     */
    where?: EconomicIndicatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EconomicIndicators to fetch.
     */
    orderBy?: EconomicIndicatorOrderByWithRelationInput | EconomicIndicatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EconomicIndicators.
     */
    cursor?: EconomicIndicatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EconomicIndicators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EconomicIndicators.
     */
    skip?: number
    distinct?: EconomicIndicatorScalarFieldEnum | EconomicIndicatorScalarFieldEnum[]
  }

  /**
   * EconomicIndicator create
   */
  export type EconomicIndicatorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EconomicIndicator
     */
    select?: EconomicIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EconomicIndicatorInclude<ExtArgs> | null
    /**
     * The data needed to create a EconomicIndicator.
     */
    data: XOR<EconomicIndicatorCreateInput, EconomicIndicatorUncheckedCreateInput>
  }

  /**
   * EconomicIndicator createMany
   */
  export type EconomicIndicatorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EconomicIndicators.
     */
    data: EconomicIndicatorCreateManyInput | EconomicIndicatorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EconomicIndicator createManyAndReturn
   */
  export type EconomicIndicatorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EconomicIndicator
     */
    select?: EconomicIndicatorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EconomicIndicators.
     */
    data: EconomicIndicatorCreateManyInput | EconomicIndicatorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EconomicIndicator update
   */
  export type EconomicIndicatorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EconomicIndicator
     */
    select?: EconomicIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EconomicIndicatorInclude<ExtArgs> | null
    /**
     * The data needed to update a EconomicIndicator.
     */
    data: XOR<EconomicIndicatorUpdateInput, EconomicIndicatorUncheckedUpdateInput>
    /**
     * Choose, which EconomicIndicator to update.
     */
    where: EconomicIndicatorWhereUniqueInput
  }

  /**
   * EconomicIndicator updateMany
   */
  export type EconomicIndicatorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EconomicIndicators.
     */
    data: XOR<EconomicIndicatorUpdateManyMutationInput, EconomicIndicatorUncheckedUpdateManyInput>
    /**
     * Filter which EconomicIndicators to update
     */
    where?: EconomicIndicatorWhereInput
  }

  /**
   * EconomicIndicator upsert
   */
  export type EconomicIndicatorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EconomicIndicator
     */
    select?: EconomicIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EconomicIndicatorInclude<ExtArgs> | null
    /**
     * The filter to search for the EconomicIndicator to update in case it exists.
     */
    where: EconomicIndicatorWhereUniqueInput
    /**
     * In case the EconomicIndicator found by the `where` argument doesn't exist, create a new EconomicIndicator with this data.
     */
    create: XOR<EconomicIndicatorCreateInput, EconomicIndicatorUncheckedCreateInput>
    /**
     * In case the EconomicIndicator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EconomicIndicatorUpdateInput, EconomicIndicatorUncheckedUpdateInput>
  }

  /**
   * EconomicIndicator delete
   */
  export type EconomicIndicatorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EconomicIndicator
     */
    select?: EconomicIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EconomicIndicatorInclude<ExtArgs> | null
    /**
     * Filter which EconomicIndicator to delete.
     */
    where: EconomicIndicatorWhereUniqueInput
  }

  /**
   * EconomicIndicator deleteMany
   */
  export type EconomicIndicatorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EconomicIndicators to delete
     */
    where?: EconomicIndicatorWhereInput
  }

  /**
   * EconomicIndicator.favorites
   */
  export type EconomicIndicator$favoritesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorInclude<ExtArgs> | null
    where?: FavoriteIndicatorWhereInput
    orderBy?: FavoriteIndicatorOrderByWithRelationInput | FavoriteIndicatorOrderByWithRelationInput[]
    cursor?: FavoriteIndicatorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FavoriteIndicatorScalarFieldEnum | FavoriteIndicatorScalarFieldEnum[]
  }

  /**
   * EconomicIndicator without action
   */
  export type EconomicIndicatorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EconomicIndicator
     */
    select?: EconomicIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EconomicIndicatorInclude<ExtArgs> | null
  }


  /**
   * Model FavoriteEarnings
   */

  export type AggregateFavoriteEarnings = {
    _count: FavoriteEarningsCountAggregateOutputType | null
    _avg: FavoriteEarningsAvgAggregateOutputType | null
    _sum: FavoriteEarningsSumAggregateOutputType | null
    _min: FavoriteEarningsMinAggregateOutputType | null
    _max: FavoriteEarningsMaxAggregateOutputType | null
  }

  export type FavoriteEarningsAvgAggregateOutputType = {
    userId: number | null
    earningsId: number | null
  }

  export type FavoriteEarningsSumAggregateOutputType = {
    userId: number | null
    earningsId: number | null
  }

  export type FavoriteEarningsMinAggregateOutputType = {
    userId: number | null
    earningsId: number | null
  }

  export type FavoriteEarningsMaxAggregateOutputType = {
    userId: number | null
    earningsId: number | null
  }

  export type FavoriteEarningsCountAggregateOutputType = {
    userId: number
    earningsId: number
    _all: number
  }


  export type FavoriteEarningsAvgAggregateInputType = {
    userId?: true
    earningsId?: true
  }

  export type FavoriteEarningsSumAggregateInputType = {
    userId?: true
    earningsId?: true
  }

  export type FavoriteEarningsMinAggregateInputType = {
    userId?: true
    earningsId?: true
  }

  export type FavoriteEarningsMaxAggregateInputType = {
    userId?: true
    earningsId?: true
  }

  export type FavoriteEarningsCountAggregateInputType = {
    userId?: true
    earningsId?: true
    _all?: true
  }

  export type FavoriteEarningsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FavoriteEarnings to aggregate.
     */
    where?: FavoriteEarningsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FavoriteEarnings to fetch.
     */
    orderBy?: FavoriteEarningsOrderByWithRelationInput | FavoriteEarningsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FavoriteEarningsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FavoriteEarnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FavoriteEarnings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FavoriteEarnings
    **/
    _count?: true | FavoriteEarningsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FavoriteEarningsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FavoriteEarningsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FavoriteEarningsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FavoriteEarningsMaxAggregateInputType
  }

  export type GetFavoriteEarningsAggregateType<T extends FavoriteEarningsAggregateArgs> = {
        [P in keyof T & keyof AggregateFavoriteEarnings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFavoriteEarnings[P]>
      : GetScalarType<T[P], AggregateFavoriteEarnings[P]>
  }




  export type FavoriteEarningsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FavoriteEarningsWhereInput
    orderBy?: FavoriteEarningsOrderByWithAggregationInput | FavoriteEarningsOrderByWithAggregationInput[]
    by: FavoriteEarningsScalarFieldEnum[] | FavoriteEarningsScalarFieldEnum
    having?: FavoriteEarningsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FavoriteEarningsCountAggregateInputType | true
    _avg?: FavoriteEarningsAvgAggregateInputType
    _sum?: FavoriteEarningsSumAggregateInputType
    _min?: FavoriteEarningsMinAggregateInputType
    _max?: FavoriteEarningsMaxAggregateInputType
  }

  export type FavoriteEarningsGroupByOutputType = {
    userId: number
    earningsId: number
    _count: FavoriteEarningsCountAggregateOutputType | null
    _avg: FavoriteEarningsAvgAggregateOutputType | null
    _sum: FavoriteEarningsSumAggregateOutputType | null
    _min: FavoriteEarningsMinAggregateOutputType | null
    _max: FavoriteEarningsMaxAggregateOutputType | null
  }

  type GetFavoriteEarningsGroupByPayload<T extends FavoriteEarningsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FavoriteEarningsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FavoriteEarningsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FavoriteEarningsGroupByOutputType[P]>
            : GetScalarType<T[P], FavoriteEarningsGroupByOutputType[P]>
        }
      >
    >


  export type FavoriteEarningsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    earningsId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    earnings?: boolean | EarningsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["favoriteEarnings"]>

  export type FavoriteEarningsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    earningsId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    earnings?: boolean | EarningsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["favoriteEarnings"]>

  export type FavoriteEarningsSelectScalar = {
    userId?: boolean
    earningsId?: boolean
  }

  export type FavoriteEarningsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    earnings?: boolean | EarningsDefaultArgs<ExtArgs>
  }
  export type FavoriteEarningsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    earnings?: boolean | EarningsDefaultArgs<ExtArgs>
  }

  export type $FavoriteEarningsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FavoriteEarnings"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      earnings: Prisma.$EarningsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: number
      earningsId: number
    }, ExtArgs["result"]["favoriteEarnings"]>
    composites: {}
  }

  type FavoriteEarningsGetPayload<S extends boolean | null | undefined | FavoriteEarningsDefaultArgs> = $Result.GetResult<Prisma.$FavoriteEarningsPayload, S>

  type FavoriteEarningsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FavoriteEarningsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FavoriteEarningsCountAggregateInputType | true
    }

  export interface FavoriteEarningsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FavoriteEarnings'], meta: { name: 'FavoriteEarnings' } }
    /**
     * Find zero or one FavoriteEarnings that matches the filter.
     * @param {FavoriteEarningsFindUniqueArgs} args - Arguments to find a FavoriteEarnings
     * @example
     * // Get one FavoriteEarnings
     * const favoriteEarnings = await prisma.favoriteEarnings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FavoriteEarningsFindUniqueArgs>(args: SelectSubset<T, FavoriteEarningsFindUniqueArgs<ExtArgs>>): Prisma__FavoriteEarningsClient<$Result.GetResult<Prisma.$FavoriteEarningsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FavoriteEarnings that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FavoriteEarningsFindUniqueOrThrowArgs} args - Arguments to find a FavoriteEarnings
     * @example
     * // Get one FavoriteEarnings
     * const favoriteEarnings = await prisma.favoriteEarnings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FavoriteEarningsFindUniqueOrThrowArgs>(args: SelectSubset<T, FavoriteEarningsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FavoriteEarningsClient<$Result.GetResult<Prisma.$FavoriteEarningsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FavoriteEarnings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteEarningsFindFirstArgs} args - Arguments to find a FavoriteEarnings
     * @example
     * // Get one FavoriteEarnings
     * const favoriteEarnings = await prisma.favoriteEarnings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FavoriteEarningsFindFirstArgs>(args?: SelectSubset<T, FavoriteEarningsFindFirstArgs<ExtArgs>>): Prisma__FavoriteEarningsClient<$Result.GetResult<Prisma.$FavoriteEarningsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FavoriteEarnings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteEarningsFindFirstOrThrowArgs} args - Arguments to find a FavoriteEarnings
     * @example
     * // Get one FavoriteEarnings
     * const favoriteEarnings = await prisma.favoriteEarnings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FavoriteEarningsFindFirstOrThrowArgs>(args?: SelectSubset<T, FavoriteEarningsFindFirstOrThrowArgs<ExtArgs>>): Prisma__FavoriteEarningsClient<$Result.GetResult<Prisma.$FavoriteEarningsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FavoriteEarnings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteEarningsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FavoriteEarnings
     * const favoriteEarnings = await prisma.favoriteEarnings.findMany()
     * 
     * // Get first 10 FavoriteEarnings
     * const favoriteEarnings = await prisma.favoriteEarnings.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const favoriteEarningsWithUserIdOnly = await prisma.favoriteEarnings.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends FavoriteEarningsFindManyArgs>(args?: SelectSubset<T, FavoriteEarningsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FavoriteEarningsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FavoriteEarnings.
     * @param {FavoriteEarningsCreateArgs} args - Arguments to create a FavoriteEarnings.
     * @example
     * // Create one FavoriteEarnings
     * const FavoriteEarnings = await prisma.favoriteEarnings.create({
     *   data: {
     *     // ... data to create a FavoriteEarnings
     *   }
     * })
     * 
     */
    create<T extends FavoriteEarningsCreateArgs>(args: SelectSubset<T, FavoriteEarningsCreateArgs<ExtArgs>>): Prisma__FavoriteEarningsClient<$Result.GetResult<Prisma.$FavoriteEarningsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FavoriteEarnings.
     * @param {FavoriteEarningsCreateManyArgs} args - Arguments to create many FavoriteEarnings.
     * @example
     * // Create many FavoriteEarnings
     * const favoriteEarnings = await prisma.favoriteEarnings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FavoriteEarningsCreateManyArgs>(args?: SelectSubset<T, FavoriteEarningsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FavoriteEarnings and returns the data saved in the database.
     * @param {FavoriteEarningsCreateManyAndReturnArgs} args - Arguments to create many FavoriteEarnings.
     * @example
     * // Create many FavoriteEarnings
     * const favoriteEarnings = await prisma.favoriteEarnings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FavoriteEarnings and only return the `userId`
     * const favoriteEarningsWithUserIdOnly = await prisma.favoriteEarnings.createManyAndReturn({ 
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FavoriteEarningsCreateManyAndReturnArgs>(args?: SelectSubset<T, FavoriteEarningsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FavoriteEarningsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FavoriteEarnings.
     * @param {FavoriteEarningsDeleteArgs} args - Arguments to delete one FavoriteEarnings.
     * @example
     * // Delete one FavoriteEarnings
     * const FavoriteEarnings = await prisma.favoriteEarnings.delete({
     *   where: {
     *     // ... filter to delete one FavoriteEarnings
     *   }
     * })
     * 
     */
    delete<T extends FavoriteEarningsDeleteArgs>(args: SelectSubset<T, FavoriteEarningsDeleteArgs<ExtArgs>>): Prisma__FavoriteEarningsClient<$Result.GetResult<Prisma.$FavoriteEarningsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FavoriteEarnings.
     * @param {FavoriteEarningsUpdateArgs} args - Arguments to update one FavoriteEarnings.
     * @example
     * // Update one FavoriteEarnings
     * const favoriteEarnings = await prisma.favoriteEarnings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FavoriteEarningsUpdateArgs>(args: SelectSubset<T, FavoriteEarningsUpdateArgs<ExtArgs>>): Prisma__FavoriteEarningsClient<$Result.GetResult<Prisma.$FavoriteEarningsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FavoriteEarnings.
     * @param {FavoriteEarningsDeleteManyArgs} args - Arguments to filter FavoriteEarnings to delete.
     * @example
     * // Delete a few FavoriteEarnings
     * const { count } = await prisma.favoriteEarnings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FavoriteEarningsDeleteManyArgs>(args?: SelectSubset<T, FavoriteEarningsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FavoriteEarnings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteEarningsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FavoriteEarnings
     * const favoriteEarnings = await prisma.favoriteEarnings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FavoriteEarningsUpdateManyArgs>(args: SelectSubset<T, FavoriteEarningsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FavoriteEarnings.
     * @param {FavoriteEarningsUpsertArgs} args - Arguments to update or create a FavoriteEarnings.
     * @example
     * // Update or create a FavoriteEarnings
     * const favoriteEarnings = await prisma.favoriteEarnings.upsert({
     *   create: {
     *     // ... data to create a FavoriteEarnings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FavoriteEarnings we want to update
     *   }
     * })
     */
    upsert<T extends FavoriteEarningsUpsertArgs>(args: SelectSubset<T, FavoriteEarningsUpsertArgs<ExtArgs>>): Prisma__FavoriteEarningsClient<$Result.GetResult<Prisma.$FavoriteEarningsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FavoriteEarnings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteEarningsCountArgs} args - Arguments to filter FavoriteEarnings to count.
     * @example
     * // Count the number of FavoriteEarnings
     * const count = await prisma.favoriteEarnings.count({
     *   where: {
     *     // ... the filter for the FavoriteEarnings we want to count
     *   }
     * })
    **/
    count<T extends FavoriteEarningsCountArgs>(
      args?: Subset<T, FavoriteEarningsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FavoriteEarningsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FavoriteEarnings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteEarningsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FavoriteEarningsAggregateArgs>(args: Subset<T, FavoriteEarningsAggregateArgs>): Prisma.PrismaPromise<GetFavoriteEarningsAggregateType<T>>

    /**
     * Group by FavoriteEarnings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteEarningsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FavoriteEarningsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FavoriteEarningsGroupByArgs['orderBy'] }
        : { orderBy?: FavoriteEarningsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FavoriteEarningsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFavoriteEarningsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FavoriteEarnings model
   */
  readonly fields: FavoriteEarningsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FavoriteEarnings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FavoriteEarningsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    earnings<T extends EarningsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EarningsDefaultArgs<ExtArgs>>): Prisma__EarningsClient<$Result.GetResult<Prisma.$EarningsPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FavoriteEarnings model
   */ 
  interface FavoriteEarningsFieldRefs {
    readonly userId: FieldRef<"FavoriteEarnings", 'Int'>
    readonly earningsId: FieldRef<"FavoriteEarnings", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * FavoriteEarnings findUnique
   */
  export type FavoriteEarningsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteEarnings to fetch.
     */
    where: FavoriteEarningsWhereUniqueInput
  }

  /**
   * FavoriteEarnings findUniqueOrThrow
   */
  export type FavoriteEarningsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteEarnings to fetch.
     */
    where: FavoriteEarningsWhereUniqueInput
  }

  /**
   * FavoriteEarnings findFirst
   */
  export type FavoriteEarningsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteEarnings to fetch.
     */
    where?: FavoriteEarningsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FavoriteEarnings to fetch.
     */
    orderBy?: FavoriteEarningsOrderByWithRelationInput | FavoriteEarningsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FavoriteEarnings.
     */
    cursor?: FavoriteEarningsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FavoriteEarnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FavoriteEarnings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FavoriteEarnings.
     */
    distinct?: FavoriteEarningsScalarFieldEnum | FavoriteEarningsScalarFieldEnum[]
  }

  /**
   * FavoriteEarnings findFirstOrThrow
   */
  export type FavoriteEarningsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteEarnings to fetch.
     */
    where?: FavoriteEarningsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FavoriteEarnings to fetch.
     */
    orderBy?: FavoriteEarningsOrderByWithRelationInput | FavoriteEarningsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FavoriteEarnings.
     */
    cursor?: FavoriteEarningsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FavoriteEarnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FavoriteEarnings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FavoriteEarnings.
     */
    distinct?: FavoriteEarningsScalarFieldEnum | FavoriteEarningsScalarFieldEnum[]
  }

  /**
   * FavoriteEarnings findMany
   */
  export type FavoriteEarningsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteEarnings to fetch.
     */
    where?: FavoriteEarningsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FavoriteEarnings to fetch.
     */
    orderBy?: FavoriteEarningsOrderByWithRelationInput | FavoriteEarningsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FavoriteEarnings.
     */
    cursor?: FavoriteEarningsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FavoriteEarnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FavoriteEarnings.
     */
    skip?: number
    distinct?: FavoriteEarningsScalarFieldEnum | FavoriteEarningsScalarFieldEnum[]
  }

  /**
   * FavoriteEarnings create
   */
  export type FavoriteEarningsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsInclude<ExtArgs> | null
    /**
     * The data needed to create a FavoriteEarnings.
     */
    data: XOR<FavoriteEarningsCreateInput, FavoriteEarningsUncheckedCreateInput>
  }

  /**
   * FavoriteEarnings createMany
   */
  export type FavoriteEarningsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FavoriteEarnings.
     */
    data: FavoriteEarningsCreateManyInput | FavoriteEarningsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FavoriteEarnings createManyAndReturn
   */
  export type FavoriteEarningsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FavoriteEarnings.
     */
    data: FavoriteEarningsCreateManyInput | FavoriteEarningsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FavoriteEarnings update
   */
  export type FavoriteEarningsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsInclude<ExtArgs> | null
    /**
     * The data needed to update a FavoriteEarnings.
     */
    data: XOR<FavoriteEarningsUpdateInput, FavoriteEarningsUncheckedUpdateInput>
    /**
     * Choose, which FavoriteEarnings to update.
     */
    where: FavoriteEarningsWhereUniqueInput
  }

  /**
   * FavoriteEarnings updateMany
   */
  export type FavoriteEarningsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FavoriteEarnings.
     */
    data: XOR<FavoriteEarningsUpdateManyMutationInput, FavoriteEarningsUncheckedUpdateManyInput>
    /**
     * Filter which FavoriteEarnings to update
     */
    where?: FavoriteEarningsWhereInput
  }

  /**
   * FavoriteEarnings upsert
   */
  export type FavoriteEarningsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsInclude<ExtArgs> | null
    /**
     * The filter to search for the FavoriteEarnings to update in case it exists.
     */
    where: FavoriteEarningsWhereUniqueInput
    /**
     * In case the FavoriteEarnings found by the `where` argument doesn't exist, create a new FavoriteEarnings with this data.
     */
    create: XOR<FavoriteEarningsCreateInput, FavoriteEarningsUncheckedCreateInput>
    /**
     * In case the FavoriteEarnings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FavoriteEarningsUpdateInput, FavoriteEarningsUncheckedUpdateInput>
  }

  /**
   * FavoriteEarnings delete
   */
  export type FavoriteEarningsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsInclude<ExtArgs> | null
    /**
     * Filter which FavoriteEarnings to delete.
     */
    where: FavoriteEarningsWhereUniqueInput
  }

  /**
   * FavoriteEarnings deleteMany
   */
  export type FavoriteEarningsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FavoriteEarnings to delete
     */
    where?: FavoriteEarningsWhereInput
  }

  /**
   * FavoriteEarnings without action
   */
  export type FavoriteEarningsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteEarnings
     */
    select?: FavoriteEarningsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteEarningsInclude<ExtArgs> | null
  }


  /**
   * Model FavoriteDividends
   */

  export type AggregateFavoriteDividends = {
    _count: FavoriteDividendsCountAggregateOutputType | null
    _avg: FavoriteDividendsAvgAggregateOutputType | null
    _sum: FavoriteDividendsSumAggregateOutputType | null
    _min: FavoriteDividendsMinAggregateOutputType | null
    _max: FavoriteDividendsMaxAggregateOutputType | null
  }

  export type FavoriteDividendsAvgAggregateOutputType = {
    userId: number | null
    dividendId: number | null
  }

  export type FavoriteDividendsSumAggregateOutputType = {
    userId: number | null
    dividendId: number | null
  }

  export type FavoriteDividendsMinAggregateOutputType = {
    userId: number | null
    dividendId: number | null
  }

  export type FavoriteDividendsMaxAggregateOutputType = {
    userId: number | null
    dividendId: number | null
  }

  export type FavoriteDividendsCountAggregateOutputType = {
    userId: number
    dividendId: number
    _all: number
  }


  export type FavoriteDividendsAvgAggregateInputType = {
    userId?: true
    dividendId?: true
  }

  export type FavoriteDividendsSumAggregateInputType = {
    userId?: true
    dividendId?: true
  }

  export type FavoriteDividendsMinAggregateInputType = {
    userId?: true
    dividendId?: true
  }

  export type FavoriteDividendsMaxAggregateInputType = {
    userId?: true
    dividendId?: true
  }

  export type FavoriteDividendsCountAggregateInputType = {
    userId?: true
    dividendId?: true
    _all?: true
  }

  export type FavoriteDividendsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FavoriteDividends to aggregate.
     */
    where?: FavoriteDividendsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FavoriteDividends to fetch.
     */
    orderBy?: FavoriteDividendsOrderByWithRelationInput | FavoriteDividendsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FavoriteDividendsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FavoriteDividends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FavoriteDividends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FavoriteDividends
    **/
    _count?: true | FavoriteDividendsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FavoriteDividendsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FavoriteDividendsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FavoriteDividendsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FavoriteDividendsMaxAggregateInputType
  }

  export type GetFavoriteDividendsAggregateType<T extends FavoriteDividendsAggregateArgs> = {
        [P in keyof T & keyof AggregateFavoriteDividends]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFavoriteDividends[P]>
      : GetScalarType<T[P], AggregateFavoriteDividends[P]>
  }




  export type FavoriteDividendsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FavoriteDividendsWhereInput
    orderBy?: FavoriteDividendsOrderByWithAggregationInput | FavoriteDividendsOrderByWithAggregationInput[]
    by: FavoriteDividendsScalarFieldEnum[] | FavoriteDividendsScalarFieldEnum
    having?: FavoriteDividendsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FavoriteDividendsCountAggregateInputType | true
    _avg?: FavoriteDividendsAvgAggregateInputType
    _sum?: FavoriteDividendsSumAggregateInputType
    _min?: FavoriteDividendsMinAggregateInputType
    _max?: FavoriteDividendsMaxAggregateInputType
  }

  export type FavoriteDividendsGroupByOutputType = {
    userId: number
    dividendId: number
    _count: FavoriteDividendsCountAggregateOutputType | null
    _avg: FavoriteDividendsAvgAggregateOutputType | null
    _sum: FavoriteDividendsSumAggregateOutputType | null
    _min: FavoriteDividendsMinAggregateOutputType | null
    _max: FavoriteDividendsMaxAggregateOutputType | null
  }

  type GetFavoriteDividendsGroupByPayload<T extends FavoriteDividendsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FavoriteDividendsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FavoriteDividendsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FavoriteDividendsGroupByOutputType[P]>
            : GetScalarType<T[P], FavoriteDividendsGroupByOutputType[P]>
        }
      >
    >


  export type FavoriteDividendsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    dividendId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    dividend?: boolean | DividendDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["favoriteDividends"]>

  export type FavoriteDividendsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    dividendId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    dividend?: boolean | DividendDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["favoriteDividends"]>

  export type FavoriteDividendsSelectScalar = {
    userId?: boolean
    dividendId?: boolean
  }

  export type FavoriteDividendsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    dividend?: boolean | DividendDefaultArgs<ExtArgs>
  }
  export type FavoriteDividendsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    dividend?: boolean | DividendDefaultArgs<ExtArgs>
  }

  export type $FavoriteDividendsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FavoriteDividends"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      dividend: Prisma.$DividendPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: number
      dividendId: number
    }, ExtArgs["result"]["favoriteDividends"]>
    composites: {}
  }

  type FavoriteDividendsGetPayload<S extends boolean | null | undefined | FavoriteDividendsDefaultArgs> = $Result.GetResult<Prisma.$FavoriteDividendsPayload, S>

  type FavoriteDividendsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FavoriteDividendsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FavoriteDividendsCountAggregateInputType | true
    }

  export interface FavoriteDividendsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FavoriteDividends'], meta: { name: 'FavoriteDividends' } }
    /**
     * Find zero or one FavoriteDividends that matches the filter.
     * @param {FavoriteDividendsFindUniqueArgs} args - Arguments to find a FavoriteDividends
     * @example
     * // Get one FavoriteDividends
     * const favoriteDividends = await prisma.favoriteDividends.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FavoriteDividendsFindUniqueArgs>(args: SelectSubset<T, FavoriteDividendsFindUniqueArgs<ExtArgs>>): Prisma__FavoriteDividendsClient<$Result.GetResult<Prisma.$FavoriteDividendsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FavoriteDividends that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FavoriteDividendsFindUniqueOrThrowArgs} args - Arguments to find a FavoriteDividends
     * @example
     * // Get one FavoriteDividends
     * const favoriteDividends = await prisma.favoriteDividends.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FavoriteDividendsFindUniqueOrThrowArgs>(args: SelectSubset<T, FavoriteDividendsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FavoriteDividendsClient<$Result.GetResult<Prisma.$FavoriteDividendsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FavoriteDividends that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteDividendsFindFirstArgs} args - Arguments to find a FavoriteDividends
     * @example
     * // Get one FavoriteDividends
     * const favoriteDividends = await prisma.favoriteDividends.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FavoriteDividendsFindFirstArgs>(args?: SelectSubset<T, FavoriteDividendsFindFirstArgs<ExtArgs>>): Prisma__FavoriteDividendsClient<$Result.GetResult<Prisma.$FavoriteDividendsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FavoriteDividends that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteDividendsFindFirstOrThrowArgs} args - Arguments to find a FavoriteDividends
     * @example
     * // Get one FavoriteDividends
     * const favoriteDividends = await prisma.favoriteDividends.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FavoriteDividendsFindFirstOrThrowArgs>(args?: SelectSubset<T, FavoriteDividendsFindFirstOrThrowArgs<ExtArgs>>): Prisma__FavoriteDividendsClient<$Result.GetResult<Prisma.$FavoriteDividendsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FavoriteDividends that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteDividendsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FavoriteDividends
     * const favoriteDividends = await prisma.favoriteDividends.findMany()
     * 
     * // Get first 10 FavoriteDividends
     * const favoriteDividends = await prisma.favoriteDividends.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const favoriteDividendsWithUserIdOnly = await prisma.favoriteDividends.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends FavoriteDividendsFindManyArgs>(args?: SelectSubset<T, FavoriteDividendsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FavoriteDividendsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FavoriteDividends.
     * @param {FavoriteDividendsCreateArgs} args - Arguments to create a FavoriteDividends.
     * @example
     * // Create one FavoriteDividends
     * const FavoriteDividends = await prisma.favoriteDividends.create({
     *   data: {
     *     // ... data to create a FavoriteDividends
     *   }
     * })
     * 
     */
    create<T extends FavoriteDividendsCreateArgs>(args: SelectSubset<T, FavoriteDividendsCreateArgs<ExtArgs>>): Prisma__FavoriteDividendsClient<$Result.GetResult<Prisma.$FavoriteDividendsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FavoriteDividends.
     * @param {FavoriteDividendsCreateManyArgs} args - Arguments to create many FavoriteDividends.
     * @example
     * // Create many FavoriteDividends
     * const favoriteDividends = await prisma.favoriteDividends.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FavoriteDividendsCreateManyArgs>(args?: SelectSubset<T, FavoriteDividendsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FavoriteDividends and returns the data saved in the database.
     * @param {FavoriteDividendsCreateManyAndReturnArgs} args - Arguments to create many FavoriteDividends.
     * @example
     * // Create many FavoriteDividends
     * const favoriteDividends = await prisma.favoriteDividends.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FavoriteDividends and only return the `userId`
     * const favoriteDividendsWithUserIdOnly = await prisma.favoriteDividends.createManyAndReturn({ 
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FavoriteDividendsCreateManyAndReturnArgs>(args?: SelectSubset<T, FavoriteDividendsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FavoriteDividendsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FavoriteDividends.
     * @param {FavoriteDividendsDeleteArgs} args - Arguments to delete one FavoriteDividends.
     * @example
     * // Delete one FavoriteDividends
     * const FavoriteDividends = await prisma.favoriteDividends.delete({
     *   where: {
     *     // ... filter to delete one FavoriteDividends
     *   }
     * })
     * 
     */
    delete<T extends FavoriteDividendsDeleteArgs>(args: SelectSubset<T, FavoriteDividendsDeleteArgs<ExtArgs>>): Prisma__FavoriteDividendsClient<$Result.GetResult<Prisma.$FavoriteDividendsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FavoriteDividends.
     * @param {FavoriteDividendsUpdateArgs} args - Arguments to update one FavoriteDividends.
     * @example
     * // Update one FavoriteDividends
     * const favoriteDividends = await prisma.favoriteDividends.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FavoriteDividendsUpdateArgs>(args: SelectSubset<T, FavoriteDividendsUpdateArgs<ExtArgs>>): Prisma__FavoriteDividendsClient<$Result.GetResult<Prisma.$FavoriteDividendsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FavoriteDividends.
     * @param {FavoriteDividendsDeleteManyArgs} args - Arguments to filter FavoriteDividends to delete.
     * @example
     * // Delete a few FavoriteDividends
     * const { count } = await prisma.favoriteDividends.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FavoriteDividendsDeleteManyArgs>(args?: SelectSubset<T, FavoriteDividendsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FavoriteDividends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteDividendsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FavoriteDividends
     * const favoriteDividends = await prisma.favoriteDividends.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FavoriteDividendsUpdateManyArgs>(args: SelectSubset<T, FavoriteDividendsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FavoriteDividends.
     * @param {FavoriteDividendsUpsertArgs} args - Arguments to update or create a FavoriteDividends.
     * @example
     * // Update or create a FavoriteDividends
     * const favoriteDividends = await prisma.favoriteDividends.upsert({
     *   create: {
     *     // ... data to create a FavoriteDividends
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FavoriteDividends we want to update
     *   }
     * })
     */
    upsert<T extends FavoriteDividendsUpsertArgs>(args: SelectSubset<T, FavoriteDividendsUpsertArgs<ExtArgs>>): Prisma__FavoriteDividendsClient<$Result.GetResult<Prisma.$FavoriteDividendsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FavoriteDividends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteDividendsCountArgs} args - Arguments to filter FavoriteDividends to count.
     * @example
     * // Count the number of FavoriteDividends
     * const count = await prisma.favoriteDividends.count({
     *   where: {
     *     // ... the filter for the FavoriteDividends we want to count
     *   }
     * })
    **/
    count<T extends FavoriteDividendsCountArgs>(
      args?: Subset<T, FavoriteDividendsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FavoriteDividendsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FavoriteDividends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteDividendsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FavoriteDividendsAggregateArgs>(args: Subset<T, FavoriteDividendsAggregateArgs>): Prisma.PrismaPromise<GetFavoriteDividendsAggregateType<T>>

    /**
     * Group by FavoriteDividends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteDividendsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FavoriteDividendsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FavoriteDividendsGroupByArgs['orderBy'] }
        : { orderBy?: FavoriteDividendsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FavoriteDividendsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFavoriteDividendsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FavoriteDividends model
   */
  readonly fields: FavoriteDividendsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FavoriteDividends.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FavoriteDividendsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    dividend<T extends DividendDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DividendDefaultArgs<ExtArgs>>): Prisma__DividendClient<$Result.GetResult<Prisma.$DividendPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FavoriteDividends model
   */ 
  interface FavoriteDividendsFieldRefs {
    readonly userId: FieldRef<"FavoriteDividends", 'Int'>
    readonly dividendId: FieldRef<"FavoriteDividends", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * FavoriteDividends findUnique
   */
  export type FavoriteDividendsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteDividends to fetch.
     */
    where: FavoriteDividendsWhereUniqueInput
  }

  /**
   * FavoriteDividends findUniqueOrThrow
   */
  export type FavoriteDividendsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteDividends to fetch.
     */
    where: FavoriteDividendsWhereUniqueInput
  }

  /**
   * FavoriteDividends findFirst
   */
  export type FavoriteDividendsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteDividends to fetch.
     */
    where?: FavoriteDividendsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FavoriteDividends to fetch.
     */
    orderBy?: FavoriteDividendsOrderByWithRelationInput | FavoriteDividendsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FavoriteDividends.
     */
    cursor?: FavoriteDividendsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FavoriteDividends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FavoriteDividends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FavoriteDividends.
     */
    distinct?: FavoriteDividendsScalarFieldEnum | FavoriteDividendsScalarFieldEnum[]
  }

  /**
   * FavoriteDividends findFirstOrThrow
   */
  export type FavoriteDividendsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteDividends to fetch.
     */
    where?: FavoriteDividendsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FavoriteDividends to fetch.
     */
    orderBy?: FavoriteDividendsOrderByWithRelationInput | FavoriteDividendsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FavoriteDividends.
     */
    cursor?: FavoriteDividendsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FavoriteDividends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FavoriteDividends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FavoriteDividends.
     */
    distinct?: FavoriteDividendsScalarFieldEnum | FavoriteDividendsScalarFieldEnum[]
  }

  /**
   * FavoriteDividends findMany
   */
  export type FavoriteDividendsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteDividends to fetch.
     */
    where?: FavoriteDividendsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FavoriteDividends to fetch.
     */
    orderBy?: FavoriteDividendsOrderByWithRelationInput | FavoriteDividendsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FavoriteDividends.
     */
    cursor?: FavoriteDividendsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FavoriteDividends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FavoriteDividends.
     */
    skip?: number
    distinct?: FavoriteDividendsScalarFieldEnum | FavoriteDividendsScalarFieldEnum[]
  }

  /**
   * FavoriteDividends create
   */
  export type FavoriteDividendsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsInclude<ExtArgs> | null
    /**
     * The data needed to create a FavoriteDividends.
     */
    data: XOR<FavoriteDividendsCreateInput, FavoriteDividendsUncheckedCreateInput>
  }

  /**
   * FavoriteDividends createMany
   */
  export type FavoriteDividendsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FavoriteDividends.
     */
    data: FavoriteDividendsCreateManyInput | FavoriteDividendsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FavoriteDividends createManyAndReturn
   */
  export type FavoriteDividendsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FavoriteDividends.
     */
    data: FavoriteDividendsCreateManyInput | FavoriteDividendsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FavoriteDividends update
   */
  export type FavoriteDividendsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsInclude<ExtArgs> | null
    /**
     * The data needed to update a FavoriteDividends.
     */
    data: XOR<FavoriteDividendsUpdateInput, FavoriteDividendsUncheckedUpdateInput>
    /**
     * Choose, which FavoriteDividends to update.
     */
    where: FavoriteDividendsWhereUniqueInput
  }

  /**
   * FavoriteDividends updateMany
   */
  export type FavoriteDividendsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FavoriteDividends.
     */
    data: XOR<FavoriteDividendsUpdateManyMutationInput, FavoriteDividendsUncheckedUpdateManyInput>
    /**
     * Filter which FavoriteDividends to update
     */
    where?: FavoriteDividendsWhereInput
  }

  /**
   * FavoriteDividends upsert
   */
  export type FavoriteDividendsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsInclude<ExtArgs> | null
    /**
     * The filter to search for the FavoriteDividends to update in case it exists.
     */
    where: FavoriteDividendsWhereUniqueInput
    /**
     * In case the FavoriteDividends found by the `where` argument doesn't exist, create a new FavoriteDividends with this data.
     */
    create: XOR<FavoriteDividendsCreateInput, FavoriteDividendsUncheckedCreateInput>
    /**
     * In case the FavoriteDividends was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FavoriteDividendsUpdateInput, FavoriteDividendsUncheckedUpdateInput>
  }

  /**
   * FavoriteDividends delete
   */
  export type FavoriteDividendsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsInclude<ExtArgs> | null
    /**
     * Filter which FavoriteDividends to delete.
     */
    where: FavoriteDividendsWhereUniqueInput
  }

  /**
   * FavoriteDividends deleteMany
   */
  export type FavoriteDividendsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FavoriteDividends to delete
     */
    where?: FavoriteDividendsWhereInput
  }

  /**
   * FavoriteDividends without action
   */
  export type FavoriteDividendsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteDividends
     */
    select?: FavoriteDividendsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteDividendsInclude<ExtArgs> | null
  }


  /**
   * Model FavoriteIndicator
   */

  export type AggregateFavoriteIndicator = {
    _count: FavoriteIndicatorCountAggregateOutputType | null
    _avg: FavoriteIndicatorAvgAggregateOutputType | null
    _sum: FavoriteIndicatorSumAggregateOutputType | null
    _min: FavoriteIndicatorMinAggregateOutputType | null
    _max: FavoriteIndicatorMaxAggregateOutputType | null
  }

  export type FavoriteIndicatorAvgAggregateOutputType = {
    userId: number | null
    indicatorId: number | null
  }

  export type FavoriteIndicatorSumAggregateOutputType = {
    userId: number | null
    indicatorId: number | null
  }

  export type FavoriteIndicatorMinAggregateOutputType = {
    userId: number | null
    indicatorId: number | null
  }

  export type FavoriteIndicatorMaxAggregateOutputType = {
    userId: number | null
    indicatorId: number | null
  }

  export type FavoriteIndicatorCountAggregateOutputType = {
    userId: number
    indicatorId: number
    _all: number
  }


  export type FavoriteIndicatorAvgAggregateInputType = {
    userId?: true
    indicatorId?: true
  }

  export type FavoriteIndicatorSumAggregateInputType = {
    userId?: true
    indicatorId?: true
  }

  export type FavoriteIndicatorMinAggregateInputType = {
    userId?: true
    indicatorId?: true
  }

  export type FavoriteIndicatorMaxAggregateInputType = {
    userId?: true
    indicatorId?: true
  }

  export type FavoriteIndicatorCountAggregateInputType = {
    userId?: true
    indicatorId?: true
    _all?: true
  }

  export type FavoriteIndicatorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FavoriteIndicator to aggregate.
     */
    where?: FavoriteIndicatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FavoriteIndicators to fetch.
     */
    orderBy?: FavoriteIndicatorOrderByWithRelationInput | FavoriteIndicatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FavoriteIndicatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FavoriteIndicators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FavoriteIndicators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FavoriteIndicators
    **/
    _count?: true | FavoriteIndicatorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FavoriteIndicatorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FavoriteIndicatorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FavoriteIndicatorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FavoriteIndicatorMaxAggregateInputType
  }

  export type GetFavoriteIndicatorAggregateType<T extends FavoriteIndicatorAggregateArgs> = {
        [P in keyof T & keyof AggregateFavoriteIndicator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFavoriteIndicator[P]>
      : GetScalarType<T[P], AggregateFavoriteIndicator[P]>
  }




  export type FavoriteIndicatorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FavoriteIndicatorWhereInput
    orderBy?: FavoriteIndicatorOrderByWithAggregationInput | FavoriteIndicatorOrderByWithAggregationInput[]
    by: FavoriteIndicatorScalarFieldEnum[] | FavoriteIndicatorScalarFieldEnum
    having?: FavoriteIndicatorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FavoriteIndicatorCountAggregateInputType | true
    _avg?: FavoriteIndicatorAvgAggregateInputType
    _sum?: FavoriteIndicatorSumAggregateInputType
    _min?: FavoriteIndicatorMinAggregateInputType
    _max?: FavoriteIndicatorMaxAggregateInputType
  }

  export type FavoriteIndicatorGroupByOutputType = {
    userId: number
    indicatorId: number
    _count: FavoriteIndicatorCountAggregateOutputType | null
    _avg: FavoriteIndicatorAvgAggregateOutputType | null
    _sum: FavoriteIndicatorSumAggregateOutputType | null
    _min: FavoriteIndicatorMinAggregateOutputType | null
    _max: FavoriteIndicatorMaxAggregateOutputType | null
  }

  type GetFavoriteIndicatorGroupByPayload<T extends FavoriteIndicatorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FavoriteIndicatorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FavoriteIndicatorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FavoriteIndicatorGroupByOutputType[P]>
            : GetScalarType<T[P], FavoriteIndicatorGroupByOutputType[P]>
        }
      >
    >


  export type FavoriteIndicatorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    indicatorId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    indicator?: boolean | EconomicIndicatorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["favoriteIndicator"]>

  export type FavoriteIndicatorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    indicatorId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    indicator?: boolean | EconomicIndicatorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["favoriteIndicator"]>

  export type FavoriteIndicatorSelectScalar = {
    userId?: boolean
    indicatorId?: boolean
  }

  export type FavoriteIndicatorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    indicator?: boolean | EconomicIndicatorDefaultArgs<ExtArgs>
  }
  export type FavoriteIndicatorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    indicator?: boolean | EconomicIndicatorDefaultArgs<ExtArgs>
  }

  export type $FavoriteIndicatorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FavoriteIndicator"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      indicator: Prisma.$EconomicIndicatorPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: number
      indicatorId: number
    }, ExtArgs["result"]["favoriteIndicator"]>
    composites: {}
  }

  type FavoriteIndicatorGetPayload<S extends boolean | null | undefined | FavoriteIndicatorDefaultArgs> = $Result.GetResult<Prisma.$FavoriteIndicatorPayload, S>

  type FavoriteIndicatorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FavoriteIndicatorFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FavoriteIndicatorCountAggregateInputType | true
    }

  export interface FavoriteIndicatorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FavoriteIndicator'], meta: { name: 'FavoriteIndicator' } }
    /**
     * Find zero or one FavoriteIndicator that matches the filter.
     * @param {FavoriteIndicatorFindUniqueArgs} args - Arguments to find a FavoriteIndicator
     * @example
     * // Get one FavoriteIndicator
     * const favoriteIndicator = await prisma.favoriteIndicator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FavoriteIndicatorFindUniqueArgs>(args: SelectSubset<T, FavoriteIndicatorFindUniqueArgs<ExtArgs>>): Prisma__FavoriteIndicatorClient<$Result.GetResult<Prisma.$FavoriteIndicatorPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FavoriteIndicator that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FavoriteIndicatorFindUniqueOrThrowArgs} args - Arguments to find a FavoriteIndicator
     * @example
     * // Get one FavoriteIndicator
     * const favoriteIndicator = await prisma.favoriteIndicator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FavoriteIndicatorFindUniqueOrThrowArgs>(args: SelectSubset<T, FavoriteIndicatorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FavoriteIndicatorClient<$Result.GetResult<Prisma.$FavoriteIndicatorPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FavoriteIndicator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteIndicatorFindFirstArgs} args - Arguments to find a FavoriteIndicator
     * @example
     * // Get one FavoriteIndicator
     * const favoriteIndicator = await prisma.favoriteIndicator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FavoriteIndicatorFindFirstArgs>(args?: SelectSubset<T, FavoriteIndicatorFindFirstArgs<ExtArgs>>): Prisma__FavoriteIndicatorClient<$Result.GetResult<Prisma.$FavoriteIndicatorPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FavoriteIndicator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteIndicatorFindFirstOrThrowArgs} args - Arguments to find a FavoriteIndicator
     * @example
     * // Get one FavoriteIndicator
     * const favoriteIndicator = await prisma.favoriteIndicator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FavoriteIndicatorFindFirstOrThrowArgs>(args?: SelectSubset<T, FavoriteIndicatorFindFirstOrThrowArgs<ExtArgs>>): Prisma__FavoriteIndicatorClient<$Result.GetResult<Prisma.$FavoriteIndicatorPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FavoriteIndicators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteIndicatorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FavoriteIndicators
     * const favoriteIndicators = await prisma.favoriteIndicator.findMany()
     * 
     * // Get first 10 FavoriteIndicators
     * const favoriteIndicators = await prisma.favoriteIndicator.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const favoriteIndicatorWithUserIdOnly = await prisma.favoriteIndicator.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends FavoriteIndicatorFindManyArgs>(args?: SelectSubset<T, FavoriteIndicatorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FavoriteIndicatorPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FavoriteIndicator.
     * @param {FavoriteIndicatorCreateArgs} args - Arguments to create a FavoriteIndicator.
     * @example
     * // Create one FavoriteIndicator
     * const FavoriteIndicator = await prisma.favoriteIndicator.create({
     *   data: {
     *     // ... data to create a FavoriteIndicator
     *   }
     * })
     * 
     */
    create<T extends FavoriteIndicatorCreateArgs>(args: SelectSubset<T, FavoriteIndicatorCreateArgs<ExtArgs>>): Prisma__FavoriteIndicatorClient<$Result.GetResult<Prisma.$FavoriteIndicatorPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FavoriteIndicators.
     * @param {FavoriteIndicatorCreateManyArgs} args - Arguments to create many FavoriteIndicators.
     * @example
     * // Create many FavoriteIndicators
     * const favoriteIndicator = await prisma.favoriteIndicator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FavoriteIndicatorCreateManyArgs>(args?: SelectSubset<T, FavoriteIndicatorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FavoriteIndicators and returns the data saved in the database.
     * @param {FavoriteIndicatorCreateManyAndReturnArgs} args - Arguments to create many FavoriteIndicators.
     * @example
     * // Create many FavoriteIndicators
     * const favoriteIndicator = await prisma.favoriteIndicator.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FavoriteIndicators and only return the `userId`
     * const favoriteIndicatorWithUserIdOnly = await prisma.favoriteIndicator.createManyAndReturn({ 
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FavoriteIndicatorCreateManyAndReturnArgs>(args?: SelectSubset<T, FavoriteIndicatorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FavoriteIndicatorPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FavoriteIndicator.
     * @param {FavoriteIndicatorDeleteArgs} args - Arguments to delete one FavoriteIndicator.
     * @example
     * // Delete one FavoriteIndicator
     * const FavoriteIndicator = await prisma.favoriteIndicator.delete({
     *   where: {
     *     // ... filter to delete one FavoriteIndicator
     *   }
     * })
     * 
     */
    delete<T extends FavoriteIndicatorDeleteArgs>(args: SelectSubset<T, FavoriteIndicatorDeleteArgs<ExtArgs>>): Prisma__FavoriteIndicatorClient<$Result.GetResult<Prisma.$FavoriteIndicatorPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FavoriteIndicator.
     * @param {FavoriteIndicatorUpdateArgs} args - Arguments to update one FavoriteIndicator.
     * @example
     * // Update one FavoriteIndicator
     * const favoriteIndicator = await prisma.favoriteIndicator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FavoriteIndicatorUpdateArgs>(args: SelectSubset<T, FavoriteIndicatorUpdateArgs<ExtArgs>>): Prisma__FavoriteIndicatorClient<$Result.GetResult<Prisma.$FavoriteIndicatorPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FavoriteIndicators.
     * @param {FavoriteIndicatorDeleteManyArgs} args - Arguments to filter FavoriteIndicators to delete.
     * @example
     * // Delete a few FavoriteIndicators
     * const { count } = await prisma.favoriteIndicator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FavoriteIndicatorDeleteManyArgs>(args?: SelectSubset<T, FavoriteIndicatorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FavoriteIndicators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteIndicatorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FavoriteIndicators
     * const favoriteIndicator = await prisma.favoriteIndicator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FavoriteIndicatorUpdateManyArgs>(args: SelectSubset<T, FavoriteIndicatorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FavoriteIndicator.
     * @param {FavoriteIndicatorUpsertArgs} args - Arguments to update or create a FavoriteIndicator.
     * @example
     * // Update or create a FavoriteIndicator
     * const favoriteIndicator = await prisma.favoriteIndicator.upsert({
     *   create: {
     *     // ... data to create a FavoriteIndicator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FavoriteIndicator we want to update
     *   }
     * })
     */
    upsert<T extends FavoriteIndicatorUpsertArgs>(args: SelectSubset<T, FavoriteIndicatorUpsertArgs<ExtArgs>>): Prisma__FavoriteIndicatorClient<$Result.GetResult<Prisma.$FavoriteIndicatorPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FavoriteIndicators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteIndicatorCountArgs} args - Arguments to filter FavoriteIndicators to count.
     * @example
     * // Count the number of FavoriteIndicators
     * const count = await prisma.favoriteIndicator.count({
     *   where: {
     *     // ... the filter for the FavoriteIndicators we want to count
     *   }
     * })
    **/
    count<T extends FavoriteIndicatorCountArgs>(
      args?: Subset<T, FavoriteIndicatorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FavoriteIndicatorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FavoriteIndicator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteIndicatorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FavoriteIndicatorAggregateArgs>(args: Subset<T, FavoriteIndicatorAggregateArgs>): Prisma.PrismaPromise<GetFavoriteIndicatorAggregateType<T>>

    /**
     * Group by FavoriteIndicator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteIndicatorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FavoriteIndicatorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FavoriteIndicatorGroupByArgs['orderBy'] }
        : { orderBy?: FavoriteIndicatorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FavoriteIndicatorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFavoriteIndicatorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FavoriteIndicator model
   */
  readonly fields: FavoriteIndicatorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FavoriteIndicator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FavoriteIndicatorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    indicator<T extends EconomicIndicatorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EconomicIndicatorDefaultArgs<ExtArgs>>): Prisma__EconomicIndicatorClient<$Result.GetResult<Prisma.$EconomicIndicatorPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FavoriteIndicator model
   */ 
  interface FavoriteIndicatorFieldRefs {
    readonly userId: FieldRef<"FavoriteIndicator", 'Int'>
    readonly indicatorId: FieldRef<"FavoriteIndicator", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * FavoriteIndicator findUnique
   */
  export type FavoriteIndicatorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteIndicator to fetch.
     */
    where: FavoriteIndicatorWhereUniqueInput
  }

  /**
   * FavoriteIndicator findUniqueOrThrow
   */
  export type FavoriteIndicatorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteIndicator to fetch.
     */
    where: FavoriteIndicatorWhereUniqueInput
  }

  /**
   * FavoriteIndicator findFirst
   */
  export type FavoriteIndicatorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteIndicator to fetch.
     */
    where?: FavoriteIndicatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FavoriteIndicators to fetch.
     */
    orderBy?: FavoriteIndicatorOrderByWithRelationInput | FavoriteIndicatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FavoriteIndicators.
     */
    cursor?: FavoriteIndicatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FavoriteIndicators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FavoriteIndicators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FavoriteIndicators.
     */
    distinct?: FavoriteIndicatorScalarFieldEnum | FavoriteIndicatorScalarFieldEnum[]
  }

  /**
   * FavoriteIndicator findFirstOrThrow
   */
  export type FavoriteIndicatorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteIndicator to fetch.
     */
    where?: FavoriteIndicatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FavoriteIndicators to fetch.
     */
    orderBy?: FavoriteIndicatorOrderByWithRelationInput | FavoriteIndicatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FavoriteIndicators.
     */
    cursor?: FavoriteIndicatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FavoriteIndicators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FavoriteIndicators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FavoriteIndicators.
     */
    distinct?: FavoriteIndicatorScalarFieldEnum | FavoriteIndicatorScalarFieldEnum[]
  }

  /**
   * FavoriteIndicator findMany
   */
  export type FavoriteIndicatorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorInclude<ExtArgs> | null
    /**
     * Filter, which FavoriteIndicators to fetch.
     */
    where?: FavoriteIndicatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FavoriteIndicators to fetch.
     */
    orderBy?: FavoriteIndicatorOrderByWithRelationInput | FavoriteIndicatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FavoriteIndicators.
     */
    cursor?: FavoriteIndicatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FavoriteIndicators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FavoriteIndicators.
     */
    skip?: number
    distinct?: FavoriteIndicatorScalarFieldEnum | FavoriteIndicatorScalarFieldEnum[]
  }

  /**
   * FavoriteIndicator create
   */
  export type FavoriteIndicatorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorInclude<ExtArgs> | null
    /**
     * The data needed to create a FavoriteIndicator.
     */
    data: XOR<FavoriteIndicatorCreateInput, FavoriteIndicatorUncheckedCreateInput>
  }

  /**
   * FavoriteIndicator createMany
   */
  export type FavoriteIndicatorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FavoriteIndicators.
     */
    data: FavoriteIndicatorCreateManyInput | FavoriteIndicatorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FavoriteIndicator createManyAndReturn
   */
  export type FavoriteIndicatorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FavoriteIndicators.
     */
    data: FavoriteIndicatorCreateManyInput | FavoriteIndicatorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FavoriteIndicator update
   */
  export type FavoriteIndicatorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorInclude<ExtArgs> | null
    /**
     * The data needed to update a FavoriteIndicator.
     */
    data: XOR<FavoriteIndicatorUpdateInput, FavoriteIndicatorUncheckedUpdateInput>
    /**
     * Choose, which FavoriteIndicator to update.
     */
    where: FavoriteIndicatorWhereUniqueInput
  }

  /**
   * FavoriteIndicator updateMany
   */
  export type FavoriteIndicatorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FavoriteIndicators.
     */
    data: XOR<FavoriteIndicatorUpdateManyMutationInput, FavoriteIndicatorUncheckedUpdateManyInput>
    /**
     * Filter which FavoriteIndicators to update
     */
    where?: FavoriteIndicatorWhereInput
  }

  /**
   * FavoriteIndicator upsert
   */
  export type FavoriteIndicatorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorInclude<ExtArgs> | null
    /**
     * The filter to search for the FavoriteIndicator to update in case it exists.
     */
    where: FavoriteIndicatorWhereUniqueInput
    /**
     * In case the FavoriteIndicator found by the `where` argument doesn't exist, create a new FavoriteIndicator with this data.
     */
    create: XOR<FavoriteIndicatorCreateInput, FavoriteIndicatorUncheckedCreateInput>
    /**
     * In case the FavoriteIndicator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FavoriteIndicatorUpdateInput, FavoriteIndicatorUncheckedUpdateInput>
  }

  /**
   * FavoriteIndicator delete
   */
  export type FavoriteIndicatorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorInclude<ExtArgs> | null
    /**
     * Filter which FavoriteIndicator to delete.
     */
    where: FavoriteIndicatorWhereUniqueInput
  }

  /**
   * FavoriteIndicator deleteMany
   */
  export type FavoriteIndicatorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FavoriteIndicators to delete
     */
    where?: FavoriteIndicatorWhereInput
  }

  /**
   * FavoriteIndicator without action
   */
  export type FavoriteIndicatorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteIndicator
     */
    select?: FavoriteIndicatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIndicatorInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    nickname: 'nickname',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const OauthInfoScalarFieldEnum: {
    id: 'id',
    provider: 'provider',
    providerId: 'providerId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    tokenExpiry: 'tokenExpiry',
    userId: 'userId'
  };

  export type OauthInfoScalarFieldEnum = (typeof OauthInfoScalarFieldEnum)[keyof typeof OauthInfoScalarFieldEnum]


  export const CompanyScalarFieldEnum: {
    id: 'id',
    ticker: 'ticker',
    name: 'name',
    country: 'country',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum]


  export const EarningsScalarFieldEnum: {
    id: 'id',
    country: 'country',
    releaseDate: 'releaseDate',
    actualEPS: 'actualEPS',
    forecastEPS: 'forecastEPS',
    previousEPS: 'previousEPS',
    actualRevenue: 'actualRevenue',
    forecastRevenue: 'forecastRevenue',
    previousRevenue: 'previousRevenue',
    companyId: 'companyId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EarningsScalarFieldEnum = (typeof EarningsScalarFieldEnum)[keyof typeof EarningsScalarFieldEnum]


  export const DividendScalarFieldEnum: {
    id: 'id',
    country: 'country',
    exDividendDate: 'exDividendDate',
    dividendAmount: 'dividendAmount',
    previousDividendAmount: 'previousDividendAmount',
    paymentDate: 'paymentDate',
    companyId: 'companyId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DividendScalarFieldEnum = (typeof DividendScalarFieldEnum)[keyof typeof DividendScalarFieldEnum]


  export const EconomicIndicatorScalarFieldEnum: {
    id: 'id',
    country: 'country',
    releaseDate: 'releaseDate',
    name: 'name',
    importance: 'importance',
    actual: 'actual',
    forecast: 'forecast',
    previous: 'previous',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EconomicIndicatorScalarFieldEnum = (typeof EconomicIndicatorScalarFieldEnum)[keyof typeof EconomicIndicatorScalarFieldEnum]


  export const FavoriteEarningsScalarFieldEnum: {
    userId: 'userId',
    earningsId: 'earningsId'
  };

  export type FavoriteEarningsScalarFieldEnum = (typeof FavoriteEarningsScalarFieldEnum)[keyof typeof FavoriteEarningsScalarFieldEnum]


  export const FavoriteDividendsScalarFieldEnum: {
    userId: 'userId',
    dividendId: 'dividendId'
  };

  export type FavoriteDividendsScalarFieldEnum = (typeof FavoriteDividendsScalarFieldEnum)[keyof typeof FavoriteDividendsScalarFieldEnum]


  export const FavoriteIndicatorScalarFieldEnum: {
    userId: 'userId',
    indicatorId: 'indicatorId'
  };

  export type FavoriteIndicatorScalarFieldEnum = (typeof FavoriteIndicatorScalarFieldEnum)[keyof typeof FavoriteIndicatorScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    nickname?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    oauthInfo?: OauthInfoListRelationFilter
    favoriteEarnings?: FavoriteEarningsListRelationFilter
    favoriteDividends?: FavoriteDividendsListRelationFilter
    favoriteIndicators?: FavoriteIndicatorListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nickname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    oauthInfo?: OauthInfoOrderByRelationAggregateInput
    favoriteEarnings?: FavoriteEarningsOrderByRelationAggregateInput
    favoriteDividends?: FavoriteDividendsOrderByRelationAggregateInput
    favoriteIndicators?: FavoriteIndicatorOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    nickname?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    oauthInfo?: OauthInfoListRelationFilter
    favoriteEarnings?: FavoriteEarningsListRelationFilter
    favoriteDividends?: FavoriteDividendsListRelationFilter
    favoriteIndicators?: FavoriteIndicatorListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nickname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    nickname?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type OauthInfoWhereInput = {
    AND?: OauthInfoWhereInput | OauthInfoWhereInput[]
    OR?: OauthInfoWhereInput[]
    NOT?: OauthInfoWhereInput | OauthInfoWhereInput[]
    id?: IntFilter<"OauthInfo"> | number
    provider?: StringFilter<"OauthInfo"> | string
    providerId?: StringFilter<"OauthInfo"> | string
    accessToken?: StringNullableFilter<"OauthInfo"> | string | null
    refreshToken?: StringNullableFilter<"OauthInfo"> | string | null
    tokenExpiry?: DateTimeNullableFilter<"OauthInfo"> | Date | string | null
    userId?: IntFilter<"OauthInfo"> | number
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type OauthInfoOrderByWithRelationInput = {
    id?: SortOrder
    provider?: SortOrder
    providerId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    tokenExpiry?: SortOrderInput | SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type OauthInfoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: OauthInfoWhereInput | OauthInfoWhereInput[]
    OR?: OauthInfoWhereInput[]
    NOT?: OauthInfoWhereInput | OauthInfoWhereInput[]
    provider?: StringFilter<"OauthInfo"> | string
    providerId?: StringFilter<"OauthInfo"> | string
    accessToken?: StringNullableFilter<"OauthInfo"> | string | null
    refreshToken?: StringNullableFilter<"OauthInfo"> | string | null
    tokenExpiry?: DateTimeNullableFilter<"OauthInfo"> | Date | string | null
    userId?: IntFilter<"OauthInfo"> | number
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type OauthInfoOrderByWithAggregationInput = {
    id?: SortOrder
    provider?: SortOrder
    providerId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    tokenExpiry?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: OauthInfoCountOrderByAggregateInput
    _avg?: OauthInfoAvgOrderByAggregateInput
    _max?: OauthInfoMaxOrderByAggregateInput
    _min?: OauthInfoMinOrderByAggregateInput
    _sum?: OauthInfoSumOrderByAggregateInput
  }

  export type OauthInfoScalarWhereWithAggregatesInput = {
    AND?: OauthInfoScalarWhereWithAggregatesInput | OauthInfoScalarWhereWithAggregatesInput[]
    OR?: OauthInfoScalarWhereWithAggregatesInput[]
    NOT?: OauthInfoScalarWhereWithAggregatesInput | OauthInfoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"OauthInfo"> | number
    provider?: StringWithAggregatesFilter<"OauthInfo"> | string
    providerId?: StringWithAggregatesFilter<"OauthInfo"> | string
    accessToken?: StringNullableWithAggregatesFilter<"OauthInfo"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"OauthInfo"> | string | null
    tokenExpiry?: DateTimeNullableWithAggregatesFilter<"OauthInfo"> | Date | string | null
    userId?: IntWithAggregatesFilter<"OauthInfo"> | number
  }

  export type CompanyWhereInput = {
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    id?: IntFilter<"Company"> | number
    ticker?: StringFilter<"Company"> | string
    name?: StringFilter<"Company"> | string
    country?: StringFilter<"Company"> | string
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
    earnings?: EarningsListRelationFilter
    dividends?: DividendListRelationFilter
  }

  export type CompanyOrderByWithRelationInput = {
    id?: SortOrder
    ticker?: SortOrder
    name?: SortOrder
    country?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    earnings?: EarningsOrderByRelationAggregateInput
    dividends?: DividendOrderByRelationAggregateInput
  }

  export type CompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    ticker_country?: CompanyTickerCountryCompoundUniqueInput
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    ticker?: StringFilter<"Company"> | string
    name?: StringFilter<"Company"> | string
    country?: StringFilter<"Company"> | string
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
    earnings?: EarningsListRelationFilter
    dividends?: DividendListRelationFilter
  }, "id" | "ticker_country">

  export type CompanyOrderByWithAggregationInput = {
    id?: SortOrder
    ticker?: SortOrder
    name?: SortOrder
    country?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CompanyCountOrderByAggregateInput
    _avg?: CompanyAvgOrderByAggregateInput
    _max?: CompanyMaxOrderByAggregateInput
    _min?: CompanyMinOrderByAggregateInput
    _sum?: CompanySumOrderByAggregateInput
  }

  export type CompanyScalarWhereWithAggregatesInput = {
    AND?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    OR?: CompanyScalarWhereWithAggregatesInput[]
    NOT?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Company"> | number
    ticker?: StringWithAggregatesFilter<"Company"> | string
    name?: StringWithAggregatesFilter<"Company"> | string
    country?: StringWithAggregatesFilter<"Company"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
  }

  export type EarningsWhereInput = {
    AND?: EarningsWhereInput | EarningsWhereInput[]
    OR?: EarningsWhereInput[]
    NOT?: EarningsWhereInput | EarningsWhereInput[]
    id?: IntFilter<"Earnings"> | number
    country?: StringFilter<"Earnings"> | string
    releaseDate?: BigIntFilter<"Earnings"> | bigint | number
    actualEPS?: StringFilter<"Earnings"> | string
    forecastEPS?: StringFilter<"Earnings"> | string
    previousEPS?: StringFilter<"Earnings"> | string
    actualRevenue?: StringFilter<"Earnings"> | string
    forecastRevenue?: StringFilter<"Earnings"> | string
    previousRevenue?: StringFilter<"Earnings"> | string
    companyId?: IntFilter<"Earnings"> | number
    createdAt?: DateTimeFilter<"Earnings"> | Date | string
    updatedAt?: DateTimeFilter<"Earnings"> | Date | string
    company?: XOR<CompanyRelationFilter, CompanyWhereInput>
    favorites?: FavoriteEarningsListRelationFilter
  }

  export type EarningsOrderByWithRelationInput = {
    id?: SortOrder
    country?: SortOrder
    releaseDate?: SortOrder
    actualEPS?: SortOrder
    forecastEPS?: SortOrder
    previousEPS?: SortOrder
    actualRevenue?: SortOrder
    forecastRevenue?: SortOrder
    previousRevenue?: SortOrder
    companyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    company?: CompanyOrderByWithRelationInput
    favorites?: FavoriteEarningsOrderByRelationAggregateInput
  }

  export type EarningsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    releaseDate_companyId?: EarningsReleaseDateCompanyIdCompoundUniqueInput
    AND?: EarningsWhereInput | EarningsWhereInput[]
    OR?: EarningsWhereInput[]
    NOT?: EarningsWhereInput | EarningsWhereInput[]
    country?: StringFilter<"Earnings"> | string
    releaseDate?: BigIntFilter<"Earnings"> | bigint | number
    actualEPS?: StringFilter<"Earnings"> | string
    forecastEPS?: StringFilter<"Earnings"> | string
    previousEPS?: StringFilter<"Earnings"> | string
    actualRevenue?: StringFilter<"Earnings"> | string
    forecastRevenue?: StringFilter<"Earnings"> | string
    previousRevenue?: StringFilter<"Earnings"> | string
    companyId?: IntFilter<"Earnings"> | number
    createdAt?: DateTimeFilter<"Earnings"> | Date | string
    updatedAt?: DateTimeFilter<"Earnings"> | Date | string
    company?: XOR<CompanyRelationFilter, CompanyWhereInput>
    favorites?: FavoriteEarningsListRelationFilter
  }, "id" | "releaseDate_companyId">

  export type EarningsOrderByWithAggregationInput = {
    id?: SortOrder
    country?: SortOrder
    releaseDate?: SortOrder
    actualEPS?: SortOrder
    forecastEPS?: SortOrder
    previousEPS?: SortOrder
    actualRevenue?: SortOrder
    forecastRevenue?: SortOrder
    previousRevenue?: SortOrder
    companyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EarningsCountOrderByAggregateInput
    _avg?: EarningsAvgOrderByAggregateInput
    _max?: EarningsMaxOrderByAggregateInput
    _min?: EarningsMinOrderByAggregateInput
    _sum?: EarningsSumOrderByAggregateInput
  }

  export type EarningsScalarWhereWithAggregatesInput = {
    AND?: EarningsScalarWhereWithAggregatesInput | EarningsScalarWhereWithAggregatesInput[]
    OR?: EarningsScalarWhereWithAggregatesInput[]
    NOT?: EarningsScalarWhereWithAggregatesInput | EarningsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Earnings"> | number
    country?: StringWithAggregatesFilter<"Earnings"> | string
    releaseDate?: BigIntWithAggregatesFilter<"Earnings"> | bigint | number
    actualEPS?: StringWithAggregatesFilter<"Earnings"> | string
    forecastEPS?: StringWithAggregatesFilter<"Earnings"> | string
    previousEPS?: StringWithAggregatesFilter<"Earnings"> | string
    actualRevenue?: StringWithAggregatesFilter<"Earnings"> | string
    forecastRevenue?: StringWithAggregatesFilter<"Earnings"> | string
    previousRevenue?: StringWithAggregatesFilter<"Earnings"> | string
    companyId?: IntWithAggregatesFilter<"Earnings"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Earnings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Earnings"> | Date | string
  }

  export type DividendWhereInput = {
    AND?: DividendWhereInput | DividendWhereInput[]
    OR?: DividendWhereInput[]
    NOT?: DividendWhereInput | DividendWhereInput[]
    id?: IntFilter<"Dividend"> | number
    country?: StringFilter<"Dividend"> | string
    exDividendDate?: BigIntFilter<"Dividend"> | bigint | number
    dividendAmount?: StringFilter<"Dividend"> | string
    previousDividendAmount?: StringFilter<"Dividend"> | string
    paymentDate?: BigIntFilter<"Dividend"> | bigint | number
    companyId?: IntFilter<"Dividend"> | number
    createdAt?: DateTimeFilter<"Dividend"> | Date | string
    updatedAt?: DateTimeFilter<"Dividend"> | Date | string
    company?: XOR<CompanyRelationFilter, CompanyWhereInput>
    favorites?: FavoriteDividendsListRelationFilter
  }

  export type DividendOrderByWithRelationInput = {
    id?: SortOrder
    country?: SortOrder
    exDividendDate?: SortOrder
    dividendAmount?: SortOrder
    previousDividendAmount?: SortOrder
    paymentDate?: SortOrder
    companyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    company?: CompanyOrderByWithRelationInput
    favorites?: FavoriteDividendsOrderByRelationAggregateInput
  }

  export type DividendWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    exDividendDate_companyId?: DividendExDividendDateCompanyIdCompoundUniqueInput
    AND?: DividendWhereInput | DividendWhereInput[]
    OR?: DividendWhereInput[]
    NOT?: DividendWhereInput | DividendWhereInput[]
    country?: StringFilter<"Dividend"> | string
    exDividendDate?: BigIntFilter<"Dividend"> | bigint | number
    dividendAmount?: StringFilter<"Dividend"> | string
    previousDividendAmount?: StringFilter<"Dividend"> | string
    paymentDate?: BigIntFilter<"Dividend"> | bigint | number
    companyId?: IntFilter<"Dividend"> | number
    createdAt?: DateTimeFilter<"Dividend"> | Date | string
    updatedAt?: DateTimeFilter<"Dividend"> | Date | string
    company?: XOR<CompanyRelationFilter, CompanyWhereInput>
    favorites?: FavoriteDividendsListRelationFilter
  }, "id" | "exDividendDate_companyId">

  export type DividendOrderByWithAggregationInput = {
    id?: SortOrder
    country?: SortOrder
    exDividendDate?: SortOrder
    dividendAmount?: SortOrder
    previousDividendAmount?: SortOrder
    paymentDate?: SortOrder
    companyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DividendCountOrderByAggregateInput
    _avg?: DividendAvgOrderByAggregateInput
    _max?: DividendMaxOrderByAggregateInput
    _min?: DividendMinOrderByAggregateInput
    _sum?: DividendSumOrderByAggregateInput
  }

  export type DividendScalarWhereWithAggregatesInput = {
    AND?: DividendScalarWhereWithAggregatesInput | DividendScalarWhereWithAggregatesInput[]
    OR?: DividendScalarWhereWithAggregatesInput[]
    NOT?: DividendScalarWhereWithAggregatesInput | DividendScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Dividend"> | number
    country?: StringWithAggregatesFilter<"Dividend"> | string
    exDividendDate?: BigIntWithAggregatesFilter<"Dividend"> | bigint | number
    dividendAmount?: StringWithAggregatesFilter<"Dividend"> | string
    previousDividendAmount?: StringWithAggregatesFilter<"Dividend"> | string
    paymentDate?: BigIntWithAggregatesFilter<"Dividend"> | bigint | number
    companyId?: IntWithAggregatesFilter<"Dividend"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Dividend"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Dividend"> | Date | string
  }

  export type EconomicIndicatorWhereInput = {
    AND?: EconomicIndicatorWhereInput | EconomicIndicatorWhereInput[]
    OR?: EconomicIndicatorWhereInput[]
    NOT?: EconomicIndicatorWhereInput | EconomicIndicatorWhereInput[]
    id?: IntFilter<"EconomicIndicator"> | number
    country?: StringFilter<"EconomicIndicator"> | string
    releaseDate?: BigIntFilter<"EconomicIndicator"> | bigint | number
    name?: StringFilter<"EconomicIndicator"> | string
    importance?: IntFilter<"EconomicIndicator"> | number
    actual?: StringFilter<"EconomicIndicator"> | string
    forecast?: StringFilter<"EconomicIndicator"> | string
    previous?: StringFilter<"EconomicIndicator"> | string
    createdAt?: DateTimeFilter<"EconomicIndicator"> | Date | string
    updatedAt?: DateTimeFilter<"EconomicIndicator"> | Date | string
    favorites?: FavoriteIndicatorListRelationFilter
  }

  export type EconomicIndicatorOrderByWithRelationInput = {
    id?: SortOrder
    country?: SortOrder
    releaseDate?: SortOrder
    name?: SortOrder
    importance?: SortOrder
    actual?: SortOrder
    forecast?: SortOrder
    previous?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    favorites?: FavoriteIndicatorOrderByRelationAggregateInput
  }

  export type EconomicIndicatorWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    releaseDate_name_country?: EconomicIndicatorReleaseDateNameCountryCompoundUniqueInput
    AND?: EconomicIndicatorWhereInput | EconomicIndicatorWhereInput[]
    OR?: EconomicIndicatorWhereInput[]
    NOT?: EconomicIndicatorWhereInput | EconomicIndicatorWhereInput[]
    country?: StringFilter<"EconomicIndicator"> | string
    releaseDate?: BigIntFilter<"EconomicIndicator"> | bigint | number
    name?: StringFilter<"EconomicIndicator"> | string
    importance?: IntFilter<"EconomicIndicator"> | number
    actual?: StringFilter<"EconomicIndicator"> | string
    forecast?: StringFilter<"EconomicIndicator"> | string
    previous?: StringFilter<"EconomicIndicator"> | string
    createdAt?: DateTimeFilter<"EconomicIndicator"> | Date | string
    updatedAt?: DateTimeFilter<"EconomicIndicator"> | Date | string
    favorites?: FavoriteIndicatorListRelationFilter
  }, "id" | "releaseDate_name_country">

  export type EconomicIndicatorOrderByWithAggregationInput = {
    id?: SortOrder
    country?: SortOrder
    releaseDate?: SortOrder
    name?: SortOrder
    importance?: SortOrder
    actual?: SortOrder
    forecast?: SortOrder
    previous?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EconomicIndicatorCountOrderByAggregateInput
    _avg?: EconomicIndicatorAvgOrderByAggregateInput
    _max?: EconomicIndicatorMaxOrderByAggregateInput
    _min?: EconomicIndicatorMinOrderByAggregateInput
    _sum?: EconomicIndicatorSumOrderByAggregateInput
  }

  export type EconomicIndicatorScalarWhereWithAggregatesInput = {
    AND?: EconomicIndicatorScalarWhereWithAggregatesInput | EconomicIndicatorScalarWhereWithAggregatesInput[]
    OR?: EconomicIndicatorScalarWhereWithAggregatesInput[]
    NOT?: EconomicIndicatorScalarWhereWithAggregatesInput | EconomicIndicatorScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"EconomicIndicator"> | number
    country?: StringWithAggregatesFilter<"EconomicIndicator"> | string
    releaseDate?: BigIntWithAggregatesFilter<"EconomicIndicator"> | bigint | number
    name?: StringWithAggregatesFilter<"EconomicIndicator"> | string
    importance?: IntWithAggregatesFilter<"EconomicIndicator"> | number
    actual?: StringWithAggregatesFilter<"EconomicIndicator"> | string
    forecast?: StringWithAggregatesFilter<"EconomicIndicator"> | string
    previous?: StringWithAggregatesFilter<"EconomicIndicator"> | string
    createdAt?: DateTimeWithAggregatesFilter<"EconomicIndicator"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EconomicIndicator"> | Date | string
  }

  export type FavoriteEarningsWhereInput = {
    AND?: FavoriteEarningsWhereInput | FavoriteEarningsWhereInput[]
    OR?: FavoriteEarningsWhereInput[]
    NOT?: FavoriteEarningsWhereInput | FavoriteEarningsWhereInput[]
    userId?: IntFilter<"FavoriteEarnings"> | number
    earningsId?: IntFilter<"FavoriteEarnings"> | number
    user?: XOR<UserRelationFilter, UserWhereInput>
    earnings?: XOR<EarningsRelationFilter, EarningsWhereInput>
  }

  export type FavoriteEarningsOrderByWithRelationInput = {
    userId?: SortOrder
    earningsId?: SortOrder
    user?: UserOrderByWithRelationInput
    earnings?: EarningsOrderByWithRelationInput
  }

  export type FavoriteEarningsWhereUniqueInput = Prisma.AtLeast<{
    userId_earningsId?: FavoriteEarningsUserIdEarningsIdCompoundUniqueInput
    AND?: FavoriteEarningsWhereInput | FavoriteEarningsWhereInput[]
    OR?: FavoriteEarningsWhereInput[]
    NOT?: FavoriteEarningsWhereInput | FavoriteEarningsWhereInput[]
    userId?: IntFilter<"FavoriteEarnings"> | number
    earningsId?: IntFilter<"FavoriteEarnings"> | number
    user?: XOR<UserRelationFilter, UserWhereInput>
    earnings?: XOR<EarningsRelationFilter, EarningsWhereInput>
  }, "userId_earningsId">

  export type FavoriteEarningsOrderByWithAggregationInput = {
    userId?: SortOrder
    earningsId?: SortOrder
    _count?: FavoriteEarningsCountOrderByAggregateInput
    _avg?: FavoriteEarningsAvgOrderByAggregateInput
    _max?: FavoriteEarningsMaxOrderByAggregateInput
    _min?: FavoriteEarningsMinOrderByAggregateInput
    _sum?: FavoriteEarningsSumOrderByAggregateInput
  }

  export type FavoriteEarningsScalarWhereWithAggregatesInput = {
    AND?: FavoriteEarningsScalarWhereWithAggregatesInput | FavoriteEarningsScalarWhereWithAggregatesInput[]
    OR?: FavoriteEarningsScalarWhereWithAggregatesInput[]
    NOT?: FavoriteEarningsScalarWhereWithAggregatesInput | FavoriteEarningsScalarWhereWithAggregatesInput[]
    userId?: IntWithAggregatesFilter<"FavoriteEarnings"> | number
    earningsId?: IntWithAggregatesFilter<"FavoriteEarnings"> | number
  }

  export type FavoriteDividendsWhereInput = {
    AND?: FavoriteDividendsWhereInput | FavoriteDividendsWhereInput[]
    OR?: FavoriteDividendsWhereInput[]
    NOT?: FavoriteDividendsWhereInput | FavoriteDividendsWhereInput[]
    userId?: IntFilter<"FavoriteDividends"> | number
    dividendId?: IntFilter<"FavoriteDividends"> | number
    user?: XOR<UserRelationFilter, UserWhereInput>
    dividend?: XOR<DividendRelationFilter, DividendWhereInput>
  }

  export type FavoriteDividendsOrderByWithRelationInput = {
    userId?: SortOrder
    dividendId?: SortOrder
    user?: UserOrderByWithRelationInput
    dividend?: DividendOrderByWithRelationInput
  }

  export type FavoriteDividendsWhereUniqueInput = Prisma.AtLeast<{
    userId_dividendId?: FavoriteDividendsUserIdDividendIdCompoundUniqueInput
    AND?: FavoriteDividendsWhereInput | FavoriteDividendsWhereInput[]
    OR?: FavoriteDividendsWhereInput[]
    NOT?: FavoriteDividendsWhereInput | FavoriteDividendsWhereInput[]
    userId?: IntFilter<"FavoriteDividends"> | number
    dividendId?: IntFilter<"FavoriteDividends"> | number
    user?: XOR<UserRelationFilter, UserWhereInput>
    dividend?: XOR<DividendRelationFilter, DividendWhereInput>
  }, "userId_dividendId">

  export type FavoriteDividendsOrderByWithAggregationInput = {
    userId?: SortOrder
    dividendId?: SortOrder
    _count?: FavoriteDividendsCountOrderByAggregateInput
    _avg?: FavoriteDividendsAvgOrderByAggregateInput
    _max?: FavoriteDividendsMaxOrderByAggregateInput
    _min?: FavoriteDividendsMinOrderByAggregateInput
    _sum?: FavoriteDividendsSumOrderByAggregateInput
  }

  export type FavoriteDividendsScalarWhereWithAggregatesInput = {
    AND?: FavoriteDividendsScalarWhereWithAggregatesInput | FavoriteDividendsScalarWhereWithAggregatesInput[]
    OR?: FavoriteDividendsScalarWhereWithAggregatesInput[]
    NOT?: FavoriteDividendsScalarWhereWithAggregatesInput | FavoriteDividendsScalarWhereWithAggregatesInput[]
    userId?: IntWithAggregatesFilter<"FavoriteDividends"> | number
    dividendId?: IntWithAggregatesFilter<"FavoriteDividends"> | number
  }

  export type FavoriteIndicatorWhereInput = {
    AND?: FavoriteIndicatorWhereInput | FavoriteIndicatorWhereInput[]
    OR?: FavoriteIndicatorWhereInput[]
    NOT?: FavoriteIndicatorWhereInput | FavoriteIndicatorWhereInput[]
    userId?: IntFilter<"FavoriteIndicator"> | number
    indicatorId?: IntFilter<"FavoriteIndicator"> | number
    user?: XOR<UserRelationFilter, UserWhereInput>
    indicator?: XOR<EconomicIndicatorRelationFilter, EconomicIndicatorWhereInput>
  }

  export type FavoriteIndicatorOrderByWithRelationInput = {
    userId?: SortOrder
    indicatorId?: SortOrder
    user?: UserOrderByWithRelationInput
    indicator?: EconomicIndicatorOrderByWithRelationInput
  }

  export type FavoriteIndicatorWhereUniqueInput = Prisma.AtLeast<{
    userId_indicatorId?: FavoriteIndicatorUserIdIndicatorIdCompoundUniqueInput
    AND?: FavoriteIndicatorWhereInput | FavoriteIndicatorWhereInput[]
    OR?: FavoriteIndicatorWhereInput[]
    NOT?: FavoriteIndicatorWhereInput | FavoriteIndicatorWhereInput[]
    userId?: IntFilter<"FavoriteIndicator"> | number
    indicatorId?: IntFilter<"FavoriteIndicator"> | number
    user?: XOR<UserRelationFilter, UserWhereInput>
    indicator?: XOR<EconomicIndicatorRelationFilter, EconomicIndicatorWhereInput>
  }, "userId_indicatorId">

  export type FavoriteIndicatorOrderByWithAggregationInput = {
    userId?: SortOrder
    indicatorId?: SortOrder
    _count?: FavoriteIndicatorCountOrderByAggregateInput
    _avg?: FavoriteIndicatorAvgOrderByAggregateInput
    _max?: FavoriteIndicatorMaxOrderByAggregateInput
    _min?: FavoriteIndicatorMinOrderByAggregateInput
    _sum?: FavoriteIndicatorSumOrderByAggregateInput
  }

  export type FavoriteIndicatorScalarWhereWithAggregatesInput = {
    AND?: FavoriteIndicatorScalarWhereWithAggregatesInput | FavoriteIndicatorScalarWhereWithAggregatesInput[]
    OR?: FavoriteIndicatorScalarWhereWithAggregatesInput[]
    NOT?: FavoriteIndicatorScalarWhereWithAggregatesInput | FavoriteIndicatorScalarWhereWithAggregatesInput[]
    userId?: IntWithAggregatesFilter<"FavoriteIndicator"> | number
    indicatorId?: IntWithAggregatesFilter<"FavoriteIndicator"> | number
  }

  export type UserCreateInput = {
    email: string
    password: string
    nickname: string
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthInfo?: OauthInfoCreateNestedManyWithoutUserInput
    favoriteEarnings?: FavoriteEarningsCreateNestedManyWithoutUserInput
    favoriteDividends?: FavoriteDividendsCreateNestedManyWithoutUserInput
    favoriteIndicators?: FavoriteIndicatorCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    email: string
    password: string
    nickname: string
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthInfo?: OauthInfoUncheckedCreateNestedManyWithoutUserInput
    favoriteEarnings?: FavoriteEarningsUncheckedCreateNestedManyWithoutUserInput
    favoriteDividends?: FavoriteDividendsUncheckedCreateNestedManyWithoutUserInput
    favoriteIndicators?: FavoriteIndicatorUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nickname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthInfo?: OauthInfoUpdateManyWithoutUserNestedInput
    favoriteEarnings?: FavoriteEarningsUpdateManyWithoutUserNestedInput
    favoriteDividends?: FavoriteDividendsUpdateManyWithoutUserNestedInput
    favoriteIndicators?: FavoriteIndicatorUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nickname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthInfo?: OauthInfoUncheckedUpdateManyWithoutUserNestedInput
    favoriteEarnings?: FavoriteEarningsUncheckedUpdateManyWithoutUserNestedInput
    favoriteDividends?: FavoriteDividendsUncheckedUpdateManyWithoutUserNestedInput
    favoriteIndicators?: FavoriteIndicatorUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    email: string
    password: string
    nickname: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nickname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nickname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OauthInfoCreateInput = {
    provider: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    tokenExpiry?: Date | string | null
    user: UserCreateNestedOneWithoutOauthInfoInput
  }

  export type OauthInfoUncheckedCreateInput = {
    id?: number
    provider: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    tokenExpiry?: Date | string | null
    userId: number
  }

  export type OauthInfoUpdateInput = {
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutOauthInfoNestedInput
  }

  export type OauthInfoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type OauthInfoCreateManyInput = {
    id?: number
    provider: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    tokenExpiry?: Date | string | null
    userId: number
  }

  export type OauthInfoUpdateManyMutationInput = {
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OauthInfoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type CompanyCreateInput = {
    ticker: string
    name: string
    country: string
    createdAt?: Date | string
    updatedAt?: Date | string
    earnings?: EarningsCreateNestedManyWithoutCompanyInput
    dividends?: DividendCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateInput = {
    id?: number
    ticker: string
    name: string
    country: string
    createdAt?: Date | string
    updatedAt?: Date | string
    earnings?: EarningsUncheckedCreateNestedManyWithoutCompanyInput
    dividends?: DividendUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUpdateInput = {
    ticker?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    earnings?: EarningsUpdateManyWithoutCompanyNestedInput
    dividends?: DividendUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    ticker?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    earnings?: EarningsUncheckedUpdateManyWithoutCompanyNestedInput
    dividends?: DividendUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyCreateManyInput = {
    id?: number
    ticker: string
    name: string
    country: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompanyUpdateManyMutationInput = {
    ticker?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    ticker?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EarningsCreateInput = {
    country: string
    releaseDate: bigint | number
    actualEPS: string
    forecastEPS: string
    previousEPS: string
    actualRevenue: string
    forecastRevenue: string
    previousRevenue: string
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutEarningsInput
    favorites?: FavoriteEarningsCreateNestedManyWithoutEarningsInput
  }

  export type EarningsUncheckedCreateInput = {
    id?: number
    country: string
    releaseDate: bigint | number
    actualEPS: string
    forecastEPS: string
    previousEPS: string
    actualRevenue: string
    forecastRevenue: string
    previousRevenue: string
    companyId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    favorites?: FavoriteEarningsUncheckedCreateNestedManyWithoutEarningsInput
  }

  export type EarningsUpdateInput = {
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    actualEPS?: StringFieldUpdateOperationsInput | string
    forecastEPS?: StringFieldUpdateOperationsInput | string
    previousEPS?: StringFieldUpdateOperationsInput | string
    actualRevenue?: StringFieldUpdateOperationsInput | string
    forecastRevenue?: StringFieldUpdateOperationsInput | string
    previousRevenue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutEarningsNestedInput
    favorites?: FavoriteEarningsUpdateManyWithoutEarningsNestedInput
  }

  export type EarningsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    actualEPS?: StringFieldUpdateOperationsInput | string
    forecastEPS?: StringFieldUpdateOperationsInput | string
    previousEPS?: StringFieldUpdateOperationsInput | string
    actualRevenue?: StringFieldUpdateOperationsInput | string
    forecastRevenue?: StringFieldUpdateOperationsInput | string
    previousRevenue?: StringFieldUpdateOperationsInput | string
    companyId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    favorites?: FavoriteEarningsUncheckedUpdateManyWithoutEarningsNestedInput
  }

  export type EarningsCreateManyInput = {
    id?: number
    country: string
    releaseDate: bigint | number
    actualEPS: string
    forecastEPS: string
    previousEPS: string
    actualRevenue: string
    forecastRevenue: string
    previousRevenue: string
    companyId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EarningsUpdateManyMutationInput = {
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    actualEPS?: StringFieldUpdateOperationsInput | string
    forecastEPS?: StringFieldUpdateOperationsInput | string
    previousEPS?: StringFieldUpdateOperationsInput | string
    actualRevenue?: StringFieldUpdateOperationsInput | string
    forecastRevenue?: StringFieldUpdateOperationsInput | string
    previousRevenue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EarningsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    actualEPS?: StringFieldUpdateOperationsInput | string
    forecastEPS?: StringFieldUpdateOperationsInput | string
    previousEPS?: StringFieldUpdateOperationsInput | string
    actualRevenue?: StringFieldUpdateOperationsInput | string
    forecastRevenue?: StringFieldUpdateOperationsInput | string
    previousRevenue?: StringFieldUpdateOperationsInput | string
    companyId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DividendCreateInput = {
    country: string
    exDividendDate: bigint | number
    dividendAmount: string
    previousDividendAmount: string
    paymentDate: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutDividendsInput
    favorites?: FavoriteDividendsCreateNestedManyWithoutDividendInput
  }

  export type DividendUncheckedCreateInput = {
    id?: number
    country: string
    exDividendDate: bigint | number
    dividendAmount: string
    previousDividendAmount: string
    paymentDate: bigint | number
    companyId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    favorites?: FavoriteDividendsUncheckedCreateNestedManyWithoutDividendInput
  }

  export type DividendUpdateInput = {
    country?: StringFieldUpdateOperationsInput | string
    exDividendDate?: BigIntFieldUpdateOperationsInput | bigint | number
    dividendAmount?: StringFieldUpdateOperationsInput | string
    previousDividendAmount?: StringFieldUpdateOperationsInput | string
    paymentDate?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutDividendsNestedInput
    favorites?: FavoriteDividendsUpdateManyWithoutDividendNestedInput
  }

  export type DividendUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    exDividendDate?: BigIntFieldUpdateOperationsInput | bigint | number
    dividendAmount?: StringFieldUpdateOperationsInput | string
    previousDividendAmount?: StringFieldUpdateOperationsInput | string
    paymentDate?: BigIntFieldUpdateOperationsInput | bigint | number
    companyId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    favorites?: FavoriteDividendsUncheckedUpdateManyWithoutDividendNestedInput
  }

  export type DividendCreateManyInput = {
    id?: number
    country: string
    exDividendDate: bigint | number
    dividendAmount: string
    previousDividendAmount: string
    paymentDate: bigint | number
    companyId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DividendUpdateManyMutationInput = {
    country?: StringFieldUpdateOperationsInput | string
    exDividendDate?: BigIntFieldUpdateOperationsInput | bigint | number
    dividendAmount?: StringFieldUpdateOperationsInput | string
    previousDividendAmount?: StringFieldUpdateOperationsInput | string
    paymentDate?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DividendUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    exDividendDate?: BigIntFieldUpdateOperationsInput | bigint | number
    dividendAmount?: StringFieldUpdateOperationsInput | string
    previousDividendAmount?: StringFieldUpdateOperationsInput | string
    paymentDate?: BigIntFieldUpdateOperationsInput | bigint | number
    companyId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EconomicIndicatorCreateInput = {
    country: string
    releaseDate: bigint | number
    name: string
    importance: number
    actual: string
    forecast: string
    previous: string
    createdAt?: Date | string
    updatedAt?: Date | string
    favorites?: FavoriteIndicatorCreateNestedManyWithoutIndicatorInput
  }

  export type EconomicIndicatorUncheckedCreateInput = {
    id?: number
    country: string
    releaseDate: bigint | number
    name: string
    importance: number
    actual: string
    forecast: string
    previous: string
    createdAt?: Date | string
    updatedAt?: Date | string
    favorites?: FavoriteIndicatorUncheckedCreateNestedManyWithoutIndicatorInput
  }

  export type EconomicIndicatorUpdateInput = {
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    actual?: StringFieldUpdateOperationsInput | string
    forecast?: StringFieldUpdateOperationsInput | string
    previous?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    favorites?: FavoriteIndicatorUpdateManyWithoutIndicatorNestedInput
  }

  export type EconomicIndicatorUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    actual?: StringFieldUpdateOperationsInput | string
    forecast?: StringFieldUpdateOperationsInput | string
    previous?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    favorites?: FavoriteIndicatorUncheckedUpdateManyWithoutIndicatorNestedInput
  }

  export type EconomicIndicatorCreateManyInput = {
    id?: number
    country: string
    releaseDate: bigint | number
    name: string
    importance: number
    actual: string
    forecast: string
    previous: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EconomicIndicatorUpdateManyMutationInput = {
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    actual?: StringFieldUpdateOperationsInput | string
    forecast?: StringFieldUpdateOperationsInput | string
    previous?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EconomicIndicatorUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    actual?: StringFieldUpdateOperationsInput | string
    forecast?: StringFieldUpdateOperationsInput | string
    previous?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FavoriteEarningsCreateInput = {
    user: UserCreateNestedOneWithoutFavoriteEarningsInput
    earnings: EarningsCreateNestedOneWithoutFavoritesInput
  }

  export type FavoriteEarningsUncheckedCreateInput = {
    userId: number
    earningsId: number
  }

  export type FavoriteEarningsUpdateInput = {
    user?: UserUpdateOneRequiredWithoutFavoriteEarningsNestedInput
    earnings?: EarningsUpdateOneRequiredWithoutFavoritesNestedInput
  }

  export type FavoriteEarningsUncheckedUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    earningsId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteEarningsCreateManyInput = {
    userId: number
    earningsId: number
  }

  export type FavoriteEarningsUpdateManyMutationInput = {

  }

  export type FavoriteEarningsUncheckedUpdateManyInput = {
    userId?: IntFieldUpdateOperationsInput | number
    earningsId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteDividendsCreateInput = {
    user: UserCreateNestedOneWithoutFavoriteDividendsInput
    dividend: DividendCreateNestedOneWithoutFavoritesInput
  }

  export type FavoriteDividendsUncheckedCreateInput = {
    userId: number
    dividendId: number
  }

  export type FavoriteDividendsUpdateInput = {
    user?: UserUpdateOneRequiredWithoutFavoriteDividendsNestedInput
    dividend?: DividendUpdateOneRequiredWithoutFavoritesNestedInput
  }

  export type FavoriteDividendsUncheckedUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    dividendId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteDividendsCreateManyInput = {
    userId: number
    dividendId: number
  }

  export type FavoriteDividendsUpdateManyMutationInput = {

  }

  export type FavoriteDividendsUncheckedUpdateManyInput = {
    userId?: IntFieldUpdateOperationsInput | number
    dividendId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteIndicatorCreateInput = {
    user: UserCreateNestedOneWithoutFavoriteIndicatorsInput
    indicator: EconomicIndicatorCreateNestedOneWithoutFavoritesInput
  }

  export type FavoriteIndicatorUncheckedCreateInput = {
    userId: number
    indicatorId: number
  }

  export type FavoriteIndicatorUpdateInput = {
    user?: UserUpdateOneRequiredWithoutFavoriteIndicatorsNestedInput
    indicator?: EconomicIndicatorUpdateOneRequiredWithoutFavoritesNestedInput
  }

  export type FavoriteIndicatorUncheckedUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    indicatorId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteIndicatorCreateManyInput = {
    userId: number
    indicatorId: number
  }

  export type FavoriteIndicatorUpdateManyMutationInput = {

  }

  export type FavoriteIndicatorUncheckedUpdateManyInput = {
    userId?: IntFieldUpdateOperationsInput | number
    indicatorId?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OauthInfoListRelationFilter = {
    every?: OauthInfoWhereInput
    some?: OauthInfoWhereInput
    none?: OauthInfoWhereInput
  }

  export type FavoriteEarningsListRelationFilter = {
    every?: FavoriteEarningsWhereInput
    some?: FavoriteEarningsWhereInput
    none?: FavoriteEarningsWhereInput
  }

  export type FavoriteDividendsListRelationFilter = {
    every?: FavoriteDividendsWhereInput
    some?: FavoriteDividendsWhereInput
    none?: FavoriteDividendsWhereInput
  }

  export type FavoriteIndicatorListRelationFilter = {
    every?: FavoriteIndicatorWhereInput
    some?: FavoriteIndicatorWhereInput
    none?: FavoriteIndicatorWhereInput
  }

  export type OauthInfoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FavoriteEarningsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FavoriteDividendsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FavoriteIndicatorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nickname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nickname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nickname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OauthInfoCountOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    providerId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    tokenExpiry?: SortOrder
    userId?: SortOrder
  }

  export type OauthInfoAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type OauthInfoMaxOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    providerId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    tokenExpiry?: SortOrder
    userId?: SortOrder
  }

  export type OauthInfoMinOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    providerId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    tokenExpiry?: SortOrder
    userId?: SortOrder
  }

  export type OauthInfoSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EarningsListRelationFilter = {
    every?: EarningsWhereInput
    some?: EarningsWhereInput
    none?: EarningsWhereInput
  }

  export type DividendListRelationFilter = {
    every?: DividendWhereInput
    some?: DividendWhereInput
    none?: DividendWhereInput
  }

  export type EarningsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DividendOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompanyTickerCountryCompoundUniqueInput = {
    ticker: string
    country: string
  }

  export type CompanyCountOrderByAggregateInput = {
    id?: SortOrder
    ticker?: SortOrder
    name?: SortOrder
    country?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CompanyMaxOrderByAggregateInput = {
    id?: SortOrder
    ticker?: SortOrder
    name?: SortOrder
    country?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyMinOrderByAggregateInput = {
    id?: SortOrder
    ticker?: SortOrder
    name?: SortOrder
    country?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type CompanyRelationFilter = {
    is?: CompanyWhereInput
    isNot?: CompanyWhereInput
  }

  export type EarningsReleaseDateCompanyIdCompoundUniqueInput = {
    releaseDate: bigint | number
    companyId: number
  }

  export type EarningsCountOrderByAggregateInput = {
    id?: SortOrder
    country?: SortOrder
    releaseDate?: SortOrder
    actualEPS?: SortOrder
    forecastEPS?: SortOrder
    previousEPS?: SortOrder
    actualRevenue?: SortOrder
    forecastRevenue?: SortOrder
    previousRevenue?: SortOrder
    companyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EarningsAvgOrderByAggregateInput = {
    id?: SortOrder
    releaseDate?: SortOrder
    companyId?: SortOrder
  }

  export type EarningsMaxOrderByAggregateInput = {
    id?: SortOrder
    country?: SortOrder
    releaseDate?: SortOrder
    actualEPS?: SortOrder
    forecastEPS?: SortOrder
    previousEPS?: SortOrder
    actualRevenue?: SortOrder
    forecastRevenue?: SortOrder
    previousRevenue?: SortOrder
    companyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EarningsMinOrderByAggregateInput = {
    id?: SortOrder
    country?: SortOrder
    releaseDate?: SortOrder
    actualEPS?: SortOrder
    forecastEPS?: SortOrder
    previousEPS?: SortOrder
    actualRevenue?: SortOrder
    forecastRevenue?: SortOrder
    previousRevenue?: SortOrder
    companyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EarningsSumOrderByAggregateInput = {
    id?: SortOrder
    releaseDate?: SortOrder
    companyId?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type DividendExDividendDateCompanyIdCompoundUniqueInput = {
    exDividendDate: bigint | number
    companyId: number
  }

  export type DividendCountOrderByAggregateInput = {
    id?: SortOrder
    country?: SortOrder
    exDividendDate?: SortOrder
    dividendAmount?: SortOrder
    previousDividendAmount?: SortOrder
    paymentDate?: SortOrder
    companyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DividendAvgOrderByAggregateInput = {
    id?: SortOrder
    exDividendDate?: SortOrder
    paymentDate?: SortOrder
    companyId?: SortOrder
  }

  export type DividendMaxOrderByAggregateInput = {
    id?: SortOrder
    country?: SortOrder
    exDividendDate?: SortOrder
    dividendAmount?: SortOrder
    previousDividendAmount?: SortOrder
    paymentDate?: SortOrder
    companyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DividendMinOrderByAggregateInput = {
    id?: SortOrder
    country?: SortOrder
    exDividendDate?: SortOrder
    dividendAmount?: SortOrder
    previousDividendAmount?: SortOrder
    paymentDate?: SortOrder
    companyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DividendSumOrderByAggregateInput = {
    id?: SortOrder
    exDividendDate?: SortOrder
    paymentDate?: SortOrder
    companyId?: SortOrder
  }

  export type EconomicIndicatorReleaseDateNameCountryCompoundUniqueInput = {
    releaseDate: bigint | number
    name: string
    country: string
  }

  export type EconomicIndicatorCountOrderByAggregateInput = {
    id?: SortOrder
    country?: SortOrder
    releaseDate?: SortOrder
    name?: SortOrder
    importance?: SortOrder
    actual?: SortOrder
    forecast?: SortOrder
    previous?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EconomicIndicatorAvgOrderByAggregateInput = {
    id?: SortOrder
    releaseDate?: SortOrder
    importance?: SortOrder
  }

  export type EconomicIndicatorMaxOrderByAggregateInput = {
    id?: SortOrder
    country?: SortOrder
    releaseDate?: SortOrder
    name?: SortOrder
    importance?: SortOrder
    actual?: SortOrder
    forecast?: SortOrder
    previous?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EconomicIndicatorMinOrderByAggregateInput = {
    id?: SortOrder
    country?: SortOrder
    releaseDate?: SortOrder
    name?: SortOrder
    importance?: SortOrder
    actual?: SortOrder
    forecast?: SortOrder
    previous?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EconomicIndicatorSumOrderByAggregateInput = {
    id?: SortOrder
    releaseDate?: SortOrder
    importance?: SortOrder
  }

  export type EarningsRelationFilter = {
    is?: EarningsWhereInput
    isNot?: EarningsWhereInput
  }

  export type FavoriteEarningsUserIdEarningsIdCompoundUniqueInput = {
    userId: number
    earningsId: number
  }

  export type FavoriteEarningsCountOrderByAggregateInput = {
    userId?: SortOrder
    earningsId?: SortOrder
  }

  export type FavoriteEarningsAvgOrderByAggregateInput = {
    userId?: SortOrder
    earningsId?: SortOrder
  }

  export type FavoriteEarningsMaxOrderByAggregateInput = {
    userId?: SortOrder
    earningsId?: SortOrder
  }

  export type FavoriteEarningsMinOrderByAggregateInput = {
    userId?: SortOrder
    earningsId?: SortOrder
  }

  export type FavoriteEarningsSumOrderByAggregateInput = {
    userId?: SortOrder
    earningsId?: SortOrder
  }

  export type DividendRelationFilter = {
    is?: DividendWhereInput
    isNot?: DividendWhereInput
  }

  export type FavoriteDividendsUserIdDividendIdCompoundUniqueInput = {
    userId: number
    dividendId: number
  }

  export type FavoriteDividendsCountOrderByAggregateInput = {
    userId?: SortOrder
    dividendId?: SortOrder
  }

  export type FavoriteDividendsAvgOrderByAggregateInput = {
    userId?: SortOrder
    dividendId?: SortOrder
  }

  export type FavoriteDividendsMaxOrderByAggregateInput = {
    userId?: SortOrder
    dividendId?: SortOrder
  }

  export type FavoriteDividendsMinOrderByAggregateInput = {
    userId?: SortOrder
    dividendId?: SortOrder
  }

  export type FavoriteDividendsSumOrderByAggregateInput = {
    userId?: SortOrder
    dividendId?: SortOrder
  }

  export type EconomicIndicatorRelationFilter = {
    is?: EconomicIndicatorWhereInput
    isNot?: EconomicIndicatorWhereInput
  }

  export type FavoriteIndicatorUserIdIndicatorIdCompoundUniqueInput = {
    userId: number
    indicatorId: number
  }

  export type FavoriteIndicatorCountOrderByAggregateInput = {
    userId?: SortOrder
    indicatorId?: SortOrder
  }

  export type FavoriteIndicatorAvgOrderByAggregateInput = {
    userId?: SortOrder
    indicatorId?: SortOrder
  }

  export type FavoriteIndicatorMaxOrderByAggregateInput = {
    userId?: SortOrder
    indicatorId?: SortOrder
  }

  export type FavoriteIndicatorMinOrderByAggregateInput = {
    userId?: SortOrder
    indicatorId?: SortOrder
  }

  export type FavoriteIndicatorSumOrderByAggregateInput = {
    userId?: SortOrder
    indicatorId?: SortOrder
  }

  export type OauthInfoCreateNestedManyWithoutUserInput = {
    create?: XOR<OauthInfoCreateWithoutUserInput, OauthInfoUncheckedCreateWithoutUserInput> | OauthInfoCreateWithoutUserInput[] | OauthInfoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OauthInfoCreateOrConnectWithoutUserInput | OauthInfoCreateOrConnectWithoutUserInput[]
    createMany?: OauthInfoCreateManyUserInputEnvelope
    connect?: OauthInfoWhereUniqueInput | OauthInfoWhereUniqueInput[]
  }

  export type FavoriteEarningsCreateNestedManyWithoutUserInput = {
    create?: XOR<FavoriteEarningsCreateWithoutUserInput, FavoriteEarningsUncheckedCreateWithoutUserInput> | FavoriteEarningsCreateWithoutUserInput[] | FavoriteEarningsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FavoriteEarningsCreateOrConnectWithoutUserInput | FavoriteEarningsCreateOrConnectWithoutUserInput[]
    createMany?: FavoriteEarningsCreateManyUserInputEnvelope
    connect?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
  }

  export type FavoriteDividendsCreateNestedManyWithoutUserInput = {
    create?: XOR<FavoriteDividendsCreateWithoutUserInput, FavoriteDividendsUncheckedCreateWithoutUserInput> | FavoriteDividendsCreateWithoutUserInput[] | FavoriteDividendsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FavoriteDividendsCreateOrConnectWithoutUserInput | FavoriteDividendsCreateOrConnectWithoutUserInput[]
    createMany?: FavoriteDividendsCreateManyUserInputEnvelope
    connect?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
  }

  export type FavoriteIndicatorCreateNestedManyWithoutUserInput = {
    create?: XOR<FavoriteIndicatorCreateWithoutUserInput, FavoriteIndicatorUncheckedCreateWithoutUserInput> | FavoriteIndicatorCreateWithoutUserInput[] | FavoriteIndicatorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FavoriteIndicatorCreateOrConnectWithoutUserInput | FavoriteIndicatorCreateOrConnectWithoutUserInput[]
    createMany?: FavoriteIndicatorCreateManyUserInputEnvelope
    connect?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
  }

  export type OauthInfoUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OauthInfoCreateWithoutUserInput, OauthInfoUncheckedCreateWithoutUserInput> | OauthInfoCreateWithoutUserInput[] | OauthInfoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OauthInfoCreateOrConnectWithoutUserInput | OauthInfoCreateOrConnectWithoutUserInput[]
    createMany?: OauthInfoCreateManyUserInputEnvelope
    connect?: OauthInfoWhereUniqueInput | OauthInfoWhereUniqueInput[]
  }

  export type FavoriteEarningsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FavoriteEarningsCreateWithoutUserInput, FavoriteEarningsUncheckedCreateWithoutUserInput> | FavoriteEarningsCreateWithoutUserInput[] | FavoriteEarningsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FavoriteEarningsCreateOrConnectWithoutUserInput | FavoriteEarningsCreateOrConnectWithoutUserInput[]
    createMany?: FavoriteEarningsCreateManyUserInputEnvelope
    connect?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
  }

  export type FavoriteDividendsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FavoriteDividendsCreateWithoutUserInput, FavoriteDividendsUncheckedCreateWithoutUserInput> | FavoriteDividendsCreateWithoutUserInput[] | FavoriteDividendsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FavoriteDividendsCreateOrConnectWithoutUserInput | FavoriteDividendsCreateOrConnectWithoutUserInput[]
    createMany?: FavoriteDividendsCreateManyUserInputEnvelope
    connect?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
  }

  export type FavoriteIndicatorUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FavoriteIndicatorCreateWithoutUserInput, FavoriteIndicatorUncheckedCreateWithoutUserInput> | FavoriteIndicatorCreateWithoutUserInput[] | FavoriteIndicatorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FavoriteIndicatorCreateOrConnectWithoutUserInput | FavoriteIndicatorCreateOrConnectWithoutUserInput[]
    createMany?: FavoriteIndicatorCreateManyUserInputEnvelope
    connect?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OauthInfoUpdateManyWithoutUserNestedInput = {
    create?: XOR<OauthInfoCreateWithoutUserInput, OauthInfoUncheckedCreateWithoutUserInput> | OauthInfoCreateWithoutUserInput[] | OauthInfoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OauthInfoCreateOrConnectWithoutUserInput | OauthInfoCreateOrConnectWithoutUserInput[]
    upsert?: OauthInfoUpsertWithWhereUniqueWithoutUserInput | OauthInfoUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OauthInfoCreateManyUserInputEnvelope
    set?: OauthInfoWhereUniqueInput | OauthInfoWhereUniqueInput[]
    disconnect?: OauthInfoWhereUniqueInput | OauthInfoWhereUniqueInput[]
    delete?: OauthInfoWhereUniqueInput | OauthInfoWhereUniqueInput[]
    connect?: OauthInfoWhereUniqueInput | OauthInfoWhereUniqueInput[]
    update?: OauthInfoUpdateWithWhereUniqueWithoutUserInput | OauthInfoUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OauthInfoUpdateManyWithWhereWithoutUserInput | OauthInfoUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OauthInfoScalarWhereInput | OauthInfoScalarWhereInput[]
  }

  export type FavoriteEarningsUpdateManyWithoutUserNestedInput = {
    create?: XOR<FavoriteEarningsCreateWithoutUserInput, FavoriteEarningsUncheckedCreateWithoutUserInput> | FavoriteEarningsCreateWithoutUserInput[] | FavoriteEarningsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FavoriteEarningsCreateOrConnectWithoutUserInput | FavoriteEarningsCreateOrConnectWithoutUserInput[]
    upsert?: FavoriteEarningsUpsertWithWhereUniqueWithoutUserInput | FavoriteEarningsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FavoriteEarningsCreateManyUserInputEnvelope
    set?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    disconnect?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    delete?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    connect?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    update?: FavoriteEarningsUpdateWithWhereUniqueWithoutUserInput | FavoriteEarningsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FavoriteEarningsUpdateManyWithWhereWithoutUserInput | FavoriteEarningsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FavoriteEarningsScalarWhereInput | FavoriteEarningsScalarWhereInput[]
  }

  export type FavoriteDividendsUpdateManyWithoutUserNestedInput = {
    create?: XOR<FavoriteDividendsCreateWithoutUserInput, FavoriteDividendsUncheckedCreateWithoutUserInput> | FavoriteDividendsCreateWithoutUserInput[] | FavoriteDividendsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FavoriteDividendsCreateOrConnectWithoutUserInput | FavoriteDividendsCreateOrConnectWithoutUserInput[]
    upsert?: FavoriteDividendsUpsertWithWhereUniqueWithoutUserInput | FavoriteDividendsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FavoriteDividendsCreateManyUserInputEnvelope
    set?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    disconnect?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    delete?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    connect?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    update?: FavoriteDividendsUpdateWithWhereUniqueWithoutUserInput | FavoriteDividendsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FavoriteDividendsUpdateManyWithWhereWithoutUserInput | FavoriteDividendsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FavoriteDividendsScalarWhereInput | FavoriteDividendsScalarWhereInput[]
  }

  export type FavoriteIndicatorUpdateManyWithoutUserNestedInput = {
    create?: XOR<FavoriteIndicatorCreateWithoutUserInput, FavoriteIndicatorUncheckedCreateWithoutUserInput> | FavoriteIndicatorCreateWithoutUserInput[] | FavoriteIndicatorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FavoriteIndicatorCreateOrConnectWithoutUserInput | FavoriteIndicatorCreateOrConnectWithoutUserInput[]
    upsert?: FavoriteIndicatorUpsertWithWhereUniqueWithoutUserInput | FavoriteIndicatorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FavoriteIndicatorCreateManyUserInputEnvelope
    set?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    disconnect?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    delete?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    connect?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    update?: FavoriteIndicatorUpdateWithWhereUniqueWithoutUserInput | FavoriteIndicatorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FavoriteIndicatorUpdateManyWithWhereWithoutUserInput | FavoriteIndicatorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FavoriteIndicatorScalarWhereInput | FavoriteIndicatorScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type OauthInfoUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OauthInfoCreateWithoutUserInput, OauthInfoUncheckedCreateWithoutUserInput> | OauthInfoCreateWithoutUserInput[] | OauthInfoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OauthInfoCreateOrConnectWithoutUserInput | OauthInfoCreateOrConnectWithoutUserInput[]
    upsert?: OauthInfoUpsertWithWhereUniqueWithoutUserInput | OauthInfoUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OauthInfoCreateManyUserInputEnvelope
    set?: OauthInfoWhereUniqueInput | OauthInfoWhereUniqueInput[]
    disconnect?: OauthInfoWhereUniqueInput | OauthInfoWhereUniqueInput[]
    delete?: OauthInfoWhereUniqueInput | OauthInfoWhereUniqueInput[]
    connect?: OauthInfoWhereUniqueInput | OauthInfoWhereUniqueInput[]
    update?: OauthInfoUpdateWithWhereUniqueWithoutUserInput | OauthInfoUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OauthInfoUpdateManyWithWhereWithoutUserInput | OauthInfoUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OauthInfoScalarWhereInput | OauthInfoScalarWhereInput[]
  }

  export type FavoriteEarningsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FavoriteEarningsCreateWithoutUserInput, FavoriteEarningsUncheckedCreateWithoutUserInput> | FavoriteEarningsCreateWithoutUserInput[] | FavoriteEarningsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FavoriteEarningsCreateOrConnectWithoutUserInput | FavoriteEarningsCreateOrConnectWithoutUserInput[]
    upsert?: FavoriteEarningsUpsertWithWhereUniqueWithoutUserInput | FavoriteEarningsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FavoriteEarningsCreateManyUserInputEnvelope
    set?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    disconnect?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    delete?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    connect?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    update?: FavoriteEarningsUpdateWithWhereUniqueWithoutUserInput | FavoriteEarningsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FavoriteEarningsUpdateManyWithWhereWithoutUserInput | FavoriteEarningsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FavoriteEarningsScalarWhereInput | FavoriteEarningsScalarWhereInput[]
  }

  export type FavoriteDividendsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FavoriteDividendsCreateWithoutUserInput, FavoriteDividendsUncheckedCreateWithoutUserInput> | FavoriteDividendsCreateWithoutUserInput[] | FavoriteDividendsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FavoriteDividendsCreateOrConnectWithoutUserInput | FavoriteDividendsCreateOrConnectWithoutUserInput[]
    upsert?: FavoriteDividendsUpsertWithWhereUniqueWithoutUserInput | FavoriteDividendsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FavoriteDividendsCreateManyUserInputEnvelope
    set?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    disconnect?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    delete?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    connect?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    update?: FavoriteDividendsUpdateWithWhereUniqueWithoutUserInput | FavoriteDividendsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FavoriteDividendsUpdateManyWithWhereWithoutUserInput | FavoriteDividendsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FavoriteDividendsScalarWhereInput | FavoriteDividendsScalarWhereInput[]
  }

  export type FavoriteIndicatorUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FavoriteIndicatorCreateWithoutUserInput, FavoriteIndicatorUncheckedCreateWithoutUserInput> | FavoriteIndicatorCreateWithoutUserInput[] | FavoriteIndicatorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FavoriteIndicatorCreateOrConnectWithoutUserInput | FavoriteIndicatorCreateOrConnectWithoutUserInput[]
    upsert?: FavoriteIndicatorUpsertWithWhereUniqueWithoutUserInput | FavoriteIndicatorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FavoriteIndicatorCreateManyUserInputEnvelope
    set?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    disconnect?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    delete?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    connect?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    update?: FavoriteIndicatorUpdateWithWhereUniqueWithoutUserInput | FavoriteIndicatorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FavoriteIndicatorUpdateManyWithWhereWithoutUserInput | FavoriteIndicatorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FavoriteIndicatorScalarWhereInput | FavoriteIndicatorScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutOauthInfoInput = {
    create?: XOR<UserCreateWithoutOauthInfoInput, UserUncheckedCreateWithoutOauthInfoInput>
    connectOrCreate?: UserCreateOrConnectWithoutOauthInfoInput
    connect?: UserWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutOauthInfoNestedInput = {
    create?: XOR<UserCreateWithoutOauthInfoInput, UserUncheckedCreateWithoutOauthInfoInput>
    connectOrCreate?: UserCreateOrConnectWithoutOauthInfoInput
    upsert?: UserUpsertWithoutOauthInfoInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOauthInfoInput, UserUpdateWithoutOauthInfoInput>, UserUncheckedUpdateWithoutOauthInfoInput>
  }

  export type EarningsCreateNestedManyWithoutCompanyInput = {
    create?: XOR<EarningsCreateWithoutCompanyInput, EarningsUncheckedCreateWithoutCompanyInput> | EarningsCreateWithoutCompanyInput[] | EarningsUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: EarningsCreateOrConnectWithoutCompanyInput | EarningsCreateOrConnectWithoutCompanyInput[]
    createMany?: EarningsCreateManyCompanyInputEnvelope
    connect?: EarningsWhereUniqueInput | EarningsWhereUniqueInput[]
  }

  export type DividendCreateNestedManyWithoutCompanyInput = {
    create?: XOR<DividendCreateWithoutCompanyInput, DividendUncheckedCreateWithoutCompanyInput> | DividendCreateWithoutCompanyInput[] | DividendUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: DividendCreateOrConnectWithoutCompanyInput | DividendCreateOrConnectWithoutCompanyInput[]
    createMany?: DividendCreateManyCompanyInputEnvelope
    connect?: DividendWhereUniqueInput | DividendWhereUniqueInput[]
  }

  export type EarningsUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<EarningsCreateWithoutCompanyInput, EarningsUncheckedCreateWithoutCompanyInput> | EarningsCreateWithoutCompanyInput[] | EarningsUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: EarningsCreateOrConnectWithoutCompanyInput | EarningsCreateOrConnectWithoutCompanyInput[]
    createMany?: EarningsCreateManyCompanyInputEnvelope
    connect?: EarningsWhereUniqueInput | EarningsWhereUniqueInput[]
  }

  export type DividendUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<DividendCreateWithoutCompanyInput, DividendUncheckedCreateWithoutCompanyInput> | DividendCreateWithoutCompanyInput[] | DividendUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: DividendCreateOrConnectWithoutCompanyInput | DividendCreateOrConnectWithoutCompanyInput[]
    createMany?: DividendCreateManyCompanyInputEnvelope
    connect?: DividendWhereUniqueInput | DividendWhereUniqueInput[]
  }

  export type EarningsUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<EarningsCreateWithoutCompanyInput, EarningsUncheckedCreateWithoutCompanyInput> | EarningsCreateWithoutCompanyInput[] | EarningsUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: EarningsCreateOrConnectWithoutCompanyInput | EarningsCreateOrConnectWithoutCompanyInput[]
    upsert?: EarningsUpsertWithWhereUniqueWithoutCompanyInput | EarningsUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: EarningsCreateManyCompanyInputEnvelope
    set?: EarningsWhereUniqueInput | EarningsWhereUniqueInput[]
    disconnect?: EarningsWhereUniqueInput | EarningsWhereUniqueInput[]
    delete?: EarningsWhereUniqueInput | EarningsWhereUniqueInput[]
    connect?: EarningsWhereUniqueInput | EarningsWhereUniqueInput[]
    update?: EarningsUpdateWithWhereUniqueWithoutCompanyInput | EarningsUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: EarningsUpdateManyWithWhereWithoutCompanyInput | EarningsUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: EarningsScalarWhereInput | EarningsScalarWhereInput[]
  }

  export type DividendUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<DividendCreateWithoutCompanyInput, DividendUncheckedCreateWithoutCompanyInput> | DividendCreateWithoutCompanyInput[] | DividendUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: DividendCreateOrConnectWithoutCompanyInput | DividendCreateOrConnectWithoutCompanyInput[]
    upsert?: DividendUpsertWithWhereUniqueWithoutCompanyInput | DividendUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: DividendCreateManyCompanyInputEnvelope
    set?: DividendWhereUniqueInput | DividendWhereUniqueInput[]
    disconnect?: DividendWhereUniqueInput | DividendWhereUniqueInput[]
    delete?: DividendWhereUniqueInput | DividendWhereUniqueInput[]
    connect?: DividendWhereUniqueInput | DividendWhereUniqueInput[]
    update?: DividendUpdateWithWhereUniqueWithoutCompanyInput | DividendUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: DividendUpdateManyWithWhereWithoutCompanyInput | DividendUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: DividendScalarWhereInput | DividendScalarWhereInput[]
  }

  export type EarningsUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<EarningsCreateWithoutCompanyInput, EarningsUncheckedCreateWithoutCompanyInput> | EarningsCreateWithoutCompanyInput[] | EarningsUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: EarningsCreateOrConnectWithoutCompanyInput | EarningsCreateOrConnectWithoutCompanyInput[]
    upsert?: EarningsUpsertWithWhereUniqueWithoutCompanyInput | EarningsUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: EarningsCreateManyCompanyInputEnvelope
    set?: EarningsWhereUniqueInput | EarningsWhereUniqueInput[]
    disconnect?: EarningsWhereUniqueInput | EarningsWhereUniqueInput[]
    delete?: EarningsWhereUniqueInput | EarningsWhereUniqueInput[]
    connect?: EarningsWhereUniqueInput | EarningsWhereUniqueInput[]
    update?: EarningsUpdateWithWhereUniqueWithoutCompanyInput | EarningsUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: EarningsUpdateManyWithWhereWithoutCompanyInput | EarningsUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: EarningsScalarWhereInput | EarningsScalarWhereInput[]
  }

  export type DividendUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<DividendCreateWithoutCompanyInput, DividendUncheckedCreateWithoutCompanyInput> | DividendCreateWithoutCompanyInput[] | DividendUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: DividendCreateOrConnectWithoutCompanyInput | DividendCreateOrConnectWithoutCompanyInput[]
    upsert?: DividendUpsertWithWhereUniqueWithoutCompanyInput | DividendUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: DividendCreateManyCompanyInputEnvelope
    set?: DividendWhereUniqueInput | DividendWhereUniqueInput[]
    disconnect?: DividendWhereUniqueInput | DividendWhereUniqueInput[]
    delete?: DividendWhereUniqueInput | DividendWhereUniqueInput[]
    connect?: DividendWhereUniqueInput | DividendWhereUniqueInput[]
    update?: DividendUpdateWithWhereUniqueWithoutCompanyInput | DividendUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: DividendUpdateManyWithWhereWithoutCompanyInput | DividendUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: DividendScalarWhereInput | DividendScalarWhereInput[]
  }

  export type CompanyCreateNestedOneWithoutEarningsInput = {
    create?: XOR<CompanyCreateWithoutEarningsInput, CompanyUncheckedCreateWithoutEarningsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutEarningsInput
    connect?: CompanyWhereUniqueInput
  }

  export type FavoriteEarningsCreateNestedManyWithoutEarningsInput = {
    create?: XOR<FavoriteEarningsCreateWithoutEarningsInput, FavoriteEarningsUncheckedCreateWithoutEarningsInput> | FavoriteEarningsCreateWithoutEarningsInput[] | FavoriteEarningsUncheckedCreateWithoutEarningsInput[]
    connectOrCreate?: FavoriteEarningsCreateOrConnectWithoutEarningsInput | FavoriteEarningsCreateOrConnectWithoutEarningsInput[]
    createMany?: FavoriteEarningsCreateManyEarningsInputEnvelope
    connect?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
  }

  export type FavoriteEarningsUncheckedCreateNestedManyWithoutEarningsInput = {
    create?: XOR<FavoriteEarningsCreateWithoutEarningsInput, FavoriteEarningsUncheckedCreateWithoutEarningsInput> | FavoriteEarningsCreateWithoutEarningsInput[] | FavoriteEarningsUncheckedCreateWithoutEarningsInput[]
    connectOrCreate?: FavoriteEarningsCreateOrConnectWithoutEarningsInput | FavoriteEarningsCreateOrConnectWithoutEarningsInput[]
    createMany?: FavoriteEarningsCreateManyEarningsInputEnvelope
    connect?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type CompanyUpdateOneRequiredWithoutEarningsNestedInput = {
    create?: XOR<CompanyCreateWithoutEarningsInput, CompanyUncheckedCreateWithoutEarningsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutEarningsInput
    upsert?: CompanyUpsertWithoutEarningsInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutEarningsInput, CompanyUpdateWithoutEarningsInput>, CompanyUncheckedUpdateWithoutEarningsInput>
  }

  export type FavoriteEarningsUpdateManyWithoutEarningsNestedInput = {
    create?: XOR<FavoriteEarningsCreateWithoutEarningsInput, FavoriteEarningsUncheckedCreateWithoutEarningsInput> | FavoriteEarningsCreateWithoutEarningsInput[] | FavoriteEarningsUncheckedCreateWithoutEarningsInput[]
    connectOrCreate?: FavoriteEarningsCreateOrConnectWithoutEarningsInput | FavoriteEarningsCreateOrConnectWithoutEarningsInput[]
    upsert?: FavoriteEarningsUpsertWithWhereUniqueWithoutEarningsInput | FavoriteEarningsUpsertWithWhereUniqueWithoutEarningsInput[]
    createMany?: FavoriteEarningsCreateManyEarningsInputEnvelope
    set?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    disconnect?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    delete?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    connect?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    update?: FavoriteEarningsUpdateWithWhereUniqueWithoutEarningsInput | FavoriteEarningsUpdateWithWhereUniqueWithoutEarningsInput[]
    updateMany?: FavoriteEarningsUpdateManyWithWhereWithoutEarningsInput | FavoriteEarningsUpdateManyWithWhereWithoutEarningsInput[]
    deleteMany?: FavoriteEarningsScalarWhereInput | FavoriteEarningsScalarWhereInput[]
  }

  export type FavoriteEarningsUncheckedUpdateManyWithoutEarningsNestedInput = {
    create?: XOR<FavoriteEarningsCreateWithoutEarningsInput, FavoriteEarningsUncheckedCreateWithoutEarningsInput> | FavoriteEarningsCreateWithoutEarningsInput[] | FavoriteEarningsUncheckedCreateWithoutEarningsInput[]
    connectOrCreate?: FavoriteEarningsCreateOrConnectWithoutEarningsInput | FavoriteEarningsCreateOrConnectWithoutEarningsInput[]
    upsert?: FavoriteEarningsUpsertWithWhereUniqueWithoutEarningsInput | FavoriteEarningsUpsertWithWhereUniqueWithoutEarningsInput[]
    createMany?: FavoriteEarningsCreateManyEarningsInputEnvelope
    set?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    disconnect?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    delete?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    connect?: FavoriteEarningsWhereUniqueInput | FavoriteEarningsWhereUniqueInput[]
    update?: FavoriteEarningsUpdateWithWhereUniqueWithoutEarningsInput | FavoriteEarningsUpdateWithWhereUniqueWithoutEarningsInput[]
    updateMany?: FavoriteEarningsUpdateManyWithWhereWithoutEarningsInput | FavoriteEarningsUpdateManyWithWhereWithoutEarningsInput[]
    deleteMany?: FavoriteEarningsScalarWhereInput | FavoriteEarningsScalarWhereInput[]
  }

  export type CompanyCreateNestedOneWithoutDividendsInput = {
    create?: XOR<CompanyCreateWithoutDividendsInput, CompanyUncheckedCreateWithoutDividendsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutDividendsInput
    connect?: CompanyWhereUniqueInput
  }

  export type FavoriteDividendsCreateNestedManyWithoutDividendInput = {
    create?: XOR<FavoriteDividendsCreateWithoutDividendInput, FavoriteDividendsUncheckedCreateWithoutDividendInput> | FavoriteDividendsCreateWithoutDividendInput[] | FavoriteDividendsUncheckedCreateWithoutDividendInput[]
    connectOrCreate?: FavoriteDividendsCreateOrConnectWithoutDividendInput | FavoriteDividendsCreateOrConnectWithoutDividendInput[]
    createMany?: FavoriteDividendsCreateManyDividendInputEnvelope
    connect?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
  }

  export type FavoriteDividendsUncheckedCreateNestedManyWithoutDividendInput = {
    create?: XOR<FavoriteDividendsCreateWithoutDividendInput, FavoriteDividendsUncheckedCreateWithoutDividendInput> | FavoriteDividendsCreateWithoutDividendInput[] | FavoriteDividendsUncheckedCreateWithoutDividendInput[]
    connectOrCreate?: FavoriteDividendsCreateOrConnectWithoutDividendInput | FavoriteDividendsCreateOrConnectWithoutDividendInput[]
    createMany?: FavoriteDividendsCreateManyDividendInputEnvelope
    connect?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
  }

  export type CompanyUpdateOneRequiredWithoutDividendsNestedInput = {
    create?: XOR<CompanyCreateWithoutDividendsInput, CompanyUncheckedCreateWithoutDividendsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutDividendsInput
    upsert?: CompanyUpsertWithoutDividendsInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutDividendsInput, CompanyUpdateWithoutDividendsInput>, CompanyUncheckedUpdateWithoutDividendsInput>
  }

  export type FavoriteDividendsUpdateManyWithoutDividendNestedInput = {
    create?: XOR<FavoriteDividendsCreateWithoutDividendInput, FavoriteDividendsUncheckedCreateWithoutDividendInput> | FavoriteDividendsCreateWithoutDividendInput[] | FavoriteDividendsUncheckedCreateWithoutDividendInput[]
    connectOrCreate?: FavoriteDividendsCreateOrConnectWithoutDividendInput | FavoriteDividendsCreateOrConnectWithoutDividendInput[]
    upsert?: FavoriteDividendsUpsertWithWhereUniqueWithoutDividendInput | FavoriteDividendsUpsertWithWhereUniqueWithoutDividendInput[]
    createMany?: FavoriteDividendsCreateManyDividendInputEnvelope
    set?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    disconnect?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    delete?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    connect?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    update?: FavoriteDividendsUpdateWithWhereUniqueWithoutDividendInput | FavoriteDividendsUpdateWithWhereUniqueWithoutDividendInput[]
    updateMany?: FavoriteDividendsUpdateManyWithWhereWithoutDividendInput | FavoriteDividendsUpdateManyWithWhereWithoutDividendInput[]
    deleteMany?: FavoriteDividendsScalarWhereInput | FavoriteDividendsScalarWhereInput[]
  }

  export type FavoriteDividendsUncheckedUpdateManyWithoutDividendNestedInput = {
    create?: XOR<FavoriteDividendsCreateWithoutDividendInput, FavoriteDividendsUncheckedCreateWithoutDividendInput> | FavoriteDividendsCreateWithoutDividendInput[] | FavoriteDividendsUncheckedCreateWithoutDividendInput[]
    connectOrCreate?: FavoriteDividendsCreateOrConnectWithoutDividendInput | FavoriteDividendsCreateOrConnectWithoutDividendInput[]
    upsert?: FavoriteDividendsUpsertWithWhereUniqueWithoutDividendInput | FavoriteDividendsUpsertWithWhereUniqueWithoutDividendInput[]
    createMany?: FavoriteDividendsCreateManyDividendInputEnvelope
    set?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    disconnect?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    delete?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    connect?: FavoriteDividendsWhereUniqueInput | FavoriteDividendsWhereUniqueInput[]
    update?: FavoriteDividendsUpdateWithWhereUniqueWithoutDividendInput | FavoriteDividendsUpdateWithWhereUniqueWithoutDividendInput[]
    updateMany?: FavoriteDividendsUpdateManyWithWhereWithoutDividendInput | FavoriteDividendsUpdateManyWithWhereWithoutDividendInput[]
    deleteMany?: FavoriteDividendsScalarWhereInput | FavoriteDividendsScalarWhereInput[]
  }

  export type FavoriteIndicatorCreateNestedManyWithoutIndicatorInput = {
    create?: XOR<FavoriteIndicatorCreateWithoutIndicatorInput, FavoriteIndicatorUncheckedCreateWithoutIndicatorInput> | FavoriteIndicatorCreateWithoutIndicatorInput[] | FavoriteIndicatorUncheckedCreateWithoutIndicatorInput[]
    connectOrCreate?: FavoriteIndicatorCreateOrConnectWithoutIndicatorInput | FavoriteIndicatorCreateOrConnectWithoutIndicatorInput[]
    createMany?: FavoriteIndicatorCreateManyIndicatorInputEnvelope
    connect?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
  }

  export type FavoriteIndicatorUncheckedCreateNestedManyWithoutIndicatorInput = {
    create?: XOR<FavoriteIndicatorCreateWithoutIndicatorInput, FavoriteIndicatorUncheckedCreateWithoutIndicatorInput> | FavoriteIndicatorCreateWithoutIndicatorInput[] | FavoriteIndicatorUncheckedCreateWithoutIndicatorInput[]
    connectOrCreate?: FavoriteIndicatorCreateOrConnectWithoutIndicatorInput | FavoriteIndicatorCreateOrConnectWithoutIndicatorInput[]
    createMany?: FavoriteIndicatorCreateManyIndicatorInputEnvelope
    connect?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
  }

  export type FavoriteIndicatorUpdateManyWithoutIndicatorNestedInput = {
    create?: XOR<FavoriteIndicatorCreateWithoutIndicatorInput, FavoriteIndicatorUncheckedCreateWithoutIndicatorInput> | FavoriteIndicatorCreateWithoutIndicatorInput[] | FavoriteIndicatorUncheckedCreateWithoutIndicatorInput[]
    connectOrCreate?: FavoriteIndicatorCreateOrConnectWithoutIndicatorInput | FavoriteIndicatorCreateOrConnectWithoutIndicatorInput[]
    upsert?: FavoriteIndicatorUpsertWithWhereUniqueWithoutIndicatorInput | FavoriteIndicatorUpsertWithWhereUniqueWithoutIndicatorInput[]
    createMany?: FavoriteIndicatorCreateManyIndicatorInputEnvelope
    set?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    disconnect?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    delete?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    connect?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    update?: FavoriteIndicatorUpdateWithWhereUniqueWithoutIndicatorInput | FavoriteIndicatorUpdateWithWhereUniqueWithoutIndicatorInput[]
    updateMany?: FavoriteIndicatorUpdateManyWithWhereWithoutIndicatorInput | FavoriteIndicatorUpdateManyWithWhereWithoutIndicatorInput[]
    deleteMany?: FavoriteIndicatorScalarWhereInput | FavoriteIndicatorScalarWhereInput[]
  }

  export type FavoriteIndicatorUncheckedUpdateManyWithoutIndicatorNestedInput = {
    create?: XOR<FavoriteIndicatorCreateWithoutIndicatorInput, FavoriteIndicatorUncheckedCreateWithoutIndicatorInput> | FavoriteIndicatorCreateWithoutIndicatorInput[] | FavoriteIndicatorUncheckedCreateWithoutIndicatorInput[]
    connectOrCreate?: FavoriteIndicatorCreateOrConnectWithoutIndicatorInput | FavoriteIndicatorCreateOrConnectWithoutIndicatorInput[]
    upsert?: FavoriteIndicatorUpsertWithWhereUniqueWithoutIndicatorInput | FavoriteIndicatorUpsertWithWhereUniqueWithoutIndicatorInput[]
    createMany?: FavoriteIndicatorCreateManyIndicatorInputEnvelope
    set?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    disconnect?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    delete?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    connect?: FavoriteIndicatorWhereUniqueInput | FavoriteIndicatorWhereUniqueInput[]
    update?: FavoriteIndicatorUpdateWithWhereUniqueWithoutIndicatorInput | FavoriteIndicatorUpdateWithWhereUniqueWithoutIndicatorInput[]
    updateMany?: FavoriteIndicatorUpdateManyWithWhereWithoutIndicatorInput | FavoriteIndicatorUpdateManyWithWhereWithoutIndicatorInput[]
    deleteMany?: FavoriteIndicatorScalarWhereInput | FavoriteIndicatorScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutFavoriteEarningsInput = {
    create?: XOR<UserCreateWithoutFavoriteEarningsInput, UserUncheckedCreateWithoutFavoriteEarningsInput>
    connectOrCreate?: UserCreateOrConnectWithoutFavoriteEarningsInput
    connect?: UserWhereUniqueInput
  }

  export type EarningsCreateNestedOneWithoutFavoritesInput = {
    create?: XOR<EarningsCreateWithoutFavoritesInput, EarningsUncheckedCreateWithoutFavoritesInput>
    connectOrCreate?: EarningsCreateOrConnectWithoutFavoritesInput
    connect?: EarningsWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutFavoriteEarningsNestedInput = {
    create?: XOR<UserCreateWithoutFavoriteEarningsInput, UserUncheckedCreateWithoutFavoriteEarningsInput>
    connectOrCreate?: UserCreateOrConnectWithoutFavoriteEarningsInput
    upsert?: UserUpsertWithoutFavoriteEarningsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFavoriteEarningsInput, UserUpdateWithoutFavoriteEarningsInput>, UserUncheckedUpdateWithoutFavoriteEarningsInput>
  }

  export type EarningsUpdateOneRequiredWithoutFavoritesNestedInput = {
    create?: XOR<EarningsCreateWithoutFavoritesInput, EarningsUncheckedCreateWithoutFavoritesInput>
    connectOrCreate?: EarningsCreateOrConnectWithoutFavoritesInput
    upsert?: EarningsUpsertWithoutFavoritesInput
    connect?: EarningsWhereUniqueInput
    update?: XOR<XOR<EarningsUpdateToOneWithWhereWithoutFavoritesInput, EarningsUpdateWithoutFavoritesInput>, EarningsUncheckedUpdateWithoutFavoritesInput>
  }

  export type UserCreateNestedOneWithoutFavoriteDividendsInput = {
    create?: XOR<UserCreateWithoutFavoriteDividendsInput, UserUncheckedCreateWithoutFavoriteDividendsInput>
    connectOrCreate?: UserCreateOrConnectWithoutFavoriteDividendsInput
    connect?: UserWhereUniqueInput
  }

  export type DividendCreateNestedOneWithoutFavoritesInput = {
    create?: XOR<DividendCreateWithoutFavoritesInput, DividendUncheckedCreateWithoutFavoritesInput>
    connectOrCreate?: DividendCreateOrConnectWithoutFavoritesInput
    connect?: DividendWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutFavoriteDividendsNestedInput = {
    create?: XOR<UserCreateWithoutFavoriteDividendsInput, UserUncheckedCreateWithoutFavoriteDividendsInput>
    connectOrCreate?: UserCreateOrConnectWithoutFavoriteDividendsInput
    upsert?: UserUpsertWithoutFavoriteDividendsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFavoriteDividendsInput, UserUpdateWithoutFavoriteDividendsInput>, UserUncheckedUpdateWithoutFavoriteDividendsInput>
  }

  export type DividendUpdateOneRequiredWithoutFavoritesNestedInput = {
    create?: XOR<DividendCreateWithoutFavoritesInput, DividendUncheckedCreateWithoutFavoritesInput>
    connectOrCreate?: DividendCreateOrConnectWithoutFavoritesInput
    upsert?: DividendUpsertWithoutFavoritesInput
    connect?: DividendWhereUniqueInput
    update?: XOR<XOR<DividendUpdateToOneWithWhereWithoutFavoritesInput, DividendUpdateWithoutFavoritesInput>, DividendUncheckedUpdateWithoutFavoritesInput>
  }

  export type UserCreateNestedOneWithoutFavoriteIndicatorsInput = {
    create?: XOR<UserCreateWithoutFavoriteIndicatorsInput, UserUncheckedCreateWithoutFavoriteIndicatorsInput>
    connectOrCreate?: UserCreateOrConnectWithoutFavoriteIndicatorsInput
    connect?: UserWhereUniqueInput
  }

  export type EconomicIndicatorCreateNestedOneWithoutFavoritesInput = {
    create?: XOR<EconomicIndicatorCreateWithoutFavoritesInput, EconomicIndicatorUncheckedCreateWithoutFavoritesInput>
    connectOrCreate?: EconomicIndicatorCreateOrConnectWithoutFavoritesInput
    connect?: EconomicIndicatorWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutFavoriteIndicatorsNestedInput = {
    create?: XOR<UserCreateWithoutFavoriteIndicatorsInput, UserUncheckedCreateWithoutFavoriteIndicatorsInput>
    connectOrCreate?: UserCreateOrConnectWithoutFavoriteIndicatorsInput
    upsert?: UserUpsertWithoutFavoriteIndicatorsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFavoriteIndicatorsInput, UserUpdateWithoutFavoriteIndicatorsInput>, UserUncheckedUpdateWithoutFavoriteIndicatorsInput>
  }

  export type EconomicIndicatorUpdateOneRequiredWithoutFavoritesNestedInput = {
    create?: XOR<EconomicIndicatorCreateWithoutFavoritesInput, EconomicIndicatorUncheckedCreateWithoutFavoritesInput>
    connectOrCreate?: EconomicIndicatorCreateOrConnectWithoutFavoritesInput
    upsert?: EconomicIndicatorUpsertWithoutFavoritesInput
    connect?: EconomicIndicatorWhereUniqueInput
    update?: XOR<XOR<EconomicIndicatorUpdateToOneWithWhereWithoutFavoritesInput, EconomicIndicatorUpdateWithoutFavoritesInput>, EconomicIndicatorUncheckedUpdateWithoutFavoritesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type OauthInfoCreateWithoutUserInput = {
    provider: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    tokenExpiry?: Date | string | null
  }

  export type OauthInfoUncheckedCreateWithoutUserInput = {
    id?: number
    provider: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    tokenExpiry?: Date | string | null
  }

  export type OauthInfoCreateOrConnectWithoutUserInput = {
    where: OauthInfoWhereUniqueInput
    create: XOR<OauthInfoCreateWithoutUserInput, OauthInfoUncheckedCreateWithoutUserInput>
  }

  export type OauthInfoCreateManyUserInputEnvelope = {
    data: OauthInfoCreateManyUserInput | OauthInfoCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FavoriteEarningsCreateWithoutUserInput = {
    earnings: EarningsCreateNestedOneWithoutFavoritesInput
  }

  export type FavoriteEarningsUncheckedCreateWithoutUserInput = {
    earningsId: number
  }

  export type FavoriteEarningsCreateOrConnectWithoutUserInput = {
    where: FavoriteEarningsWhereUniqueInput
    create: XOR<FavoriteEarningsCreateWithoutUserInput, FavoriteEarningsUncheckedCreateWithoutUserInput>
  }

  export type FavoriteEarningsCreateManyUserInputEnvelope = {
    data: FavoriteEarningsCreateManyUserInput | FavoriteEarningsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FavoriteDividendsCreateWithoutUserInput = {
    dividend: DividendCreateNestedOneWithoutFavoritesInput
  }

  export type FavoriteDividendsUncheckedCreateWithoutUserInput = {
    dividendId: number
  }

  export type FavoriteDividendsCreateOrConnectWithoutUserInput = {
    where: FavoriteDividendsWhereUniqueInput
    create: XOR<FavoriteDividendsCreateWithoutUserInput, FavoriteDividendsUncheckedCreateWithoutUserInput>
  }

  export type FavoriteDividendsCreateManyUserInputEnvelope = {
    data: FavoriteDividendsCreateManyUserInput | FavoriteDividendsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FavoriteIndicatorCreateWithoutUserInput = {
    indicator: EconomicIndicatorCreateNestedOneWithoutFavoritesInput
  }

  export type FavoriteIndicatorUncheckedCreateWithoutUserInput = {
    indicatorId: number
  }

  export type FavoriteIndicatorCreateOrConnectWithoutUserInput = {
    where: FavoriteIndicatorWhereUniqueInput
    create: XOR<FavoriteIndicatorCreateWithoutUserInput, FavoriteIndicatorUncheckedCreateWithoutUserInput>
  }

  export type FavoriteIndicatorCreateManyUserInputEnvelope = {
    data: FavoriteIndicatorCreateManyUserInput | FavoriteIndicatorCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type OauthInfoUpsertWithWhereUniqueWithoutUserInput = {
    where: OauthInfoWhereUniqueInput
    update: XOR<OauthInfoUpdateWithoutUserInput, OauthInfoUncheckedUpdateWithoutUserInput>
    create: XOR<OauthInfoCreateWithoutUserInput, OauthInfoUncheckedCreateWithoutUserInput>
  }

  export type OauthInfoUpdateWithWhereUniqueWithoutUserInput = {
    where: OauthInfoWhereUniqueInput
    data: XOR<OauthInfoUpdateWithoutUserInput, OauthInfoUncheckedUpdateWithoutUserInput>
  }

  export type OauthInfoUpdateManyWithWhereWithoutUserInput = {
    where: OauthInfoScalarWhereInput
    data: XOR<OauthInfoUpdateManyMutationInput, OauthInfoUncheckedUpdateManyWithoutUserInput>
  }

  export type OauthInfoScalarWhereInput = {
    AND?: OauthInfoScalarWhereInput | OauthInfoScalarWhereInput[]
    OR?: OauthInfoScalarWhereInput[]
    NOT?: OauthInfoScalarWhereInput | OauthInfoScalarWhereInput[]
    id?: IntFilter<"OauthInfo"> | number
    provider?: StringFilter<"OauthInfo"> | string
    providerId?: StringFilter<"OauthInfo"> | string
    accessToken?: StringNullableFilter<"OauthInfo"> | string | null
    refreshToken?: StringNullableFilter<"OauthInfo"> | string | null
    tokenExpiry?: DateTimeNullableFilter<"OauthInfo"> | Date | string | null
    userId?: IntFilter<"OauthInfo"> | number
  }

  export type FavoriteEarningsUpsertWithWhereUniqueWithoutUserInput = {
    where: FavoriteEarningsWhereUniqueInput
    update: XOR<FavoriteEarningsUpdateWithoutUserInput, FavoriteEarningsUncheckedUpdateWithoutUserInput>
    create: XOR<FavoriteEarningsCreateWithoutUserInput, FavoriteEarningsUncheckedCreateWithoutUserInput>
  }

  export type FavoriteEarningsUpdateWithWhereUniqueWithoutUserInput = {
    where: FavoriteEarningsWhereUniqueInput
    data: XOR<FavoriteEarningsUpdateWithoutUserInput, FavoriteEarningsUncheckedUpdateWithoutUserInput>
  }

  export type FavoriteEarningsUpdateManyWithWhereWithoutUserInput = {
    where: FavoriteEarningsScalarWhereInput
    data: XOR<FavoriteEarningsUpdateManyMutationInput, FavoriteEarningsUncheckedUpdateManyWithoutUserInput>
  }

  export type FavoriteEarningsScalarWhereInput = {
    AND?: FavoriteEarningsScalarWhereInput | FavoriteEarningsScalarWhereInput[]
    OR?: FavoriteEarningsScalarWhereInput[]
    NOT?: FavoriteEarningsScalarWhereInput | FavoriteEarningsScalarWhereInput[]
    userId?: IntFilter<"FavoriteEarnings"> | number
    earningsId?: IntFilter<"FavoriteEarnings"> | number
  }

  export type FavoriteDividendsUpsertWithWhereUniqueWithoutUserInput = {
    where: FavoriteDividendsWhereUniqueInput
    update: XOR<FavoriteDividendsUpdateWithoutUserInput, FavoriteDividendsUncheckedUpdateWithoutUserInput>
    create: XOR<FavoriteDividendsCreateWithoutUserInput, FavoriteDividendsUncheckedCreateWithoutUserInput>
  }

  export type FavoriteDividendsUpdateWithWhereUniqueWithoutUserInput = {
    where: FavoriteDividendsWhereUniqueInput
    data: XOR<FavoriteDividendsUpdateWithoutUserInput, FavoriteDividendsUncheckedUpdateWithoutUserInput>
  }

  export type FavoriteDividendsUpdateManyWithWhereWithoutUserInput = {
    where: FavoriteDividendsScalarWhereInput
    data: XOR<FavoriteDividendsUpdateManyMutationInput, FavoriteDividendsUncheckedUpdateManyWithoutUserInput>
  }

  export type FavoriteDividendsScalarWhereInput = {
    AND?: FavoriteDividendsScalarWhereInput | FavoriteDividendsScalarWhereInput[]
    OR?: FavoriteDividendsScalarWhereInput[]
    NOT?: FavoriteDividendsScalarWhereInput | FavoriteDividendsScalarWhereInput[]
    userId?: IntFilter<"FavoriteDividends"> | number
    dividendId?: IntFilter<"FavoriteDividends"> | number
  }

  export type FavoriteIndicatorUpsertWithWhereUniqueWithoutUserInput = {
    where: FavoriteIndicatorWhereUniqueInput
    update: XOR<FavoriteIndicatorUpdateWithoutUserInput, FavoriteIndicatorUncheckedUpdateWithoutUserInput>
    create: XOR<FavoriteIndicatorCreateWithoutUserInput, FavoriteIndicatorUncheckedCreateWithoutUserInput>
  }

  export type FavoriteIndicatorUpdateWithWhereUniqueWithoutUserInput = {
    where: FavoriteIndicatorWhereUniqueInput
    data: XOR<FavoriteIndicatorUpdateWithoutUserInput, FavoriteIndicatorUncheckedUpdateWithoutUserInput>
  }

  export type FavoriteIndicatorUpdateManyWithWhereWithoutUserInput = {
    where: FavoriteIndicatorScalarWhereInput
    data: XOR<FavoriteIndicatorUpdateManyMutationInput, FavoriteIndicatorUncheckedUpdateManyWithoutUserInput>
  }

  export type FavoriteIndicatorScalarWhereInput = {
    AND?: FavoriteIndicatorScalarWhereInput | FavoriteIndicatorScalarWhereInput[]
    OR?: FavoriteIndicatorScalarWhereInput[]
    NOT?: FavoriteIndicatorScalarWhereInput | FavoriteIndicatorScalarWhereInput[]
    userId?: IntFilter<"FavoriteIndicator"> | number
    indicatorId?: IntFilter<"FavoriteIndicator"> | number
  }

  export type UserCreateWithoutOauthInfoInput = {
    email: string
    password: string
    nickname: string
    createdAt?: Date | string
    updatedAt?: Date | string
    favoriteEarnings?: FavoriteEarningsCreateNestedManyWithoutUserInput
    favoriteDividends?: FavoriteDividendsCreateNestedManyWithoutUserInput
    favoriteIndicators?: FavoriteIndicatorCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOauthInfoInput = {
    id?: number
    email: string
    password: string
    nickname: string
    createdAt?: Date | string
    updatedAt?: Date | string
    favoriteEarnings?: FavoriteEarningsUncheckedCreateNestedManyWithoutUserInput
    favoriteDividends?: FavoriteDividendsUncheckedCreateNestedManyWithoutUserInput
    favoriteIndicators?: FavoriteIndicatorUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOauthInfoInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOauthInfoInput, UserUncheckedCreateWithoutOauthInfoInput>
  }

  export type UserUpsertWithoutOauthInfoInput = {
    update: XOR<UserUpdateWithoutOauthInfoInput, UserUncheckedUpdateWithoutOauthInfoInput>
    create: XOR<UserCreateWithoutOauthInfoInput, UserUncheckedCreateWithoutOauthInfoInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOauthInfoInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOauthInfoInput, UserUncheckedUpdateWithoutOauthInfoInput>
  }

  export type UserUpdateWithoutOauthInfoInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nickname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    favoriteEarnings?: FavoriteEarningsUpdateManyWithoutUserNestedInput
    favoriteDividends?: FavoriteDividendsUpdateManyWithoutUserNestedInput
    favoriteIndicators?: FavoriteIndicatorUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOauthInfoInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nickname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    favoriteEarnings?: FavoriteEarningsUncheckedUpdateManyWithoutUserNestedInput
    favoriteDividends?: FavoriteDividendsUncheckedUpdateManyWithoutUserNestedInput
    favoriteIndicators?: FavoriteIndicatorUncheckedUpdateManyWithoutUserNestedInput
  }

  export type EarningsCreateWithoutCompanyInput = {
    country: string
    releaseDate: bigint | number
    actualEPS: string
    forecastEPS: string
    previousEPS: string
    actualRevenue: string
    forecastRevenue: string
    previousRevenue: string
    createdAt?: Date | string
    updatedAt?: Date | string
    favorites?: FavoriteEarningsCreateNestedManyWithoutEarningsInput
  }

  export type EarningsUncheckedCreateWithoutCompanyInput = {
    id?: number
    country: string
    releaseDate: bigint | number
    actualEPS: string
    forecastEPS: string
    previousEPS: string
    actualRevenue: string
    forecastRevenue: string
    previousRevenue: string
    createdAt?: Date | string
    updatedAt?: Date | string
    favorites?: FavoriteEarningsUncheckedCreateNestedManyWithoutEarningsInput
  }

  export type EarningsCreateOrConnectWithoutCompanyInput = {
    where: EarningsWhereUniqueInput
    create: XOR<EarningsCreateWithoutCompanyInput, EarningsUncheckedCreateWithoutCompanyInput>
  }

  export type EarningsCreateManyCompanyInputEnvelope = {
    data: EarningsCreateManyCompanyInput | EarningsCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type DividendCreateWithoutCompanyInput = {
    country: string
    exDividendDate: bigint | number
    dividendAmount: string
    previousDividendAmount: string
    paymentDate: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    favorites?: FavoriteDividendsCreateNestedManyWithoutDividendInput
  }

  export type DividendUncheckedCreateWithoutCompanyInput = {
    id?: number
    country: string
    exDividendDate: bigint | number
    dividendAmount: string
    previousDividendAmount: string
    paymentDate: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    favorites?: FavoriteDividendsUncheckedCreateNestedManyWithoutDividendInput
  }

  export type DividendCreateOrConnectWithoutCompanyInput = {
    where: DividendWhereUniqueInput
    create: XOR<DividendCreateWithoutCompanyInput, DividendUncheckedCreateWithoutCompanyInput>
  }

  export type DividendCreateManyCompanyInputEnvelope = {
    data: DividendCreateManyCompanyInput | DividendCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type EarningsUpsertWithWhereUniqueWithoutCompanyInput = {
    where: EarningsWhereUniqueInput
    update: XOR<EarningsUpdateWithoutCompanyInput, EarningsUncheckedUpdateWithoutCompanyInput>
    create: XOR<EarningsCreateWithoutCompanyInput, EarningsUncheckedCreateWithoutCompanyInput>
  }

  export type EarningsUpdateWithWhereUniqueWithoutCompanyInput = {
    where: EarningsWhereUniqueInput
    data: XOR<EarningsUpdateWithoutCompanyInput, EarningsUncheckedUpdateWithoutCompanyInput>
  }

  export type EarningsUpdateManyWithWhereWithoutCompanyInput = {
    where: EarningsScalarWhereInput
    data: XOR<EarningsUpdateManyMutationInput, EarningsUncheckedUpdateManyWithoutCompanyInput>
  }

  export type EarningsScalarWhereInput = {
    AND?: EarningsScalarWhereInput | EarningsScalarWhereInput[]
    OR?: EarningsScalarWhereInput[]
    NOT?: EarningsScalarWhereInput | EarningsScalarWhereInput[]
    id?: IntFilter<"Earnings"> | number
    country?: StringFilter<"Earnings"> | string
    releaseDate?: BigIntFilter<"Earnings"> | bigint | number
    actualEPS?: StringFilter<"Earnings"> | string
    forecastEPS?: StringFilter<"Earnings"> | string
    previousEPS?: StringFilter<"Earnings"> | string
    actualRevenue?: StringFilter<"Earnings"> | string
    forecastRevenue?: StringFilter<"Earnings"> | string
    previousRevenue?: StringFilter<"Earnings"> | string
    companyId?: IntFilter<"Earnings"> | number
    createdAt?: DateTimeFilter<"Earnings"> | Date | string
    updatedAt?: DateTimeFilter<"Earnings"> | Date | string
  }

  export type DividendUpsertWithWhereUniqueWithoutCompanyInput = {
    where: DividendWhereUniqueInput
    update: XOR<DividendUpdateWithoutCompanyInput, DividendUncheckedUpdateWithoutCompanyInput>
    create: XOR<DividendCreateWithoutCompanyInput, DividendUncheckedCreateWithoutCompanyInput>
  }

  export type DividendUpdateWithWhereUniqueWithoutCompanyInput = {
    where: DividendWhereUniqueInput
    data: XOR<DividendUpdateWithoutCompanyInput, DividendUncheckedUpdateWithoutCompanyInput>
  }

  export type DividendUpdateManyWithWhereWithoutCompanyInput = {
    where: DividendScalarWhereInput
    data: XOR<DividendUpdateManyMutationInput, DividendUncheckedUpdateManyWithoutCompanyInput>
  }

  export type DividendScalarWhereInput = {
    AND?: DividendScalarWhereInput | DividendScalarWhereInput[]
    OR?: DividendScalarWhereInput[]
    NOT?: DividendScalarWhereInput | DividendScalarWhereInput[]
    id?: IntFilter<"Dividend"> | number
    country?: StringFilter<"Dividend"> | string
    exDividendDate?: BigIntFilter<"Dividend"> | bigint | number
    dividendAmount?: StringFilter<"Dividend"> | string
    previousDividendAmount?: StringFilter<"Dividend"> | string
    paymentDate?: BigIntFilter<"Dividend"> | bigint | number
    companyId?: IntFilter<"Dividend"> | number
    createdAt?: DateTimeFilter<"Dividend"> | Date | string
    updatedAt?: DateTimeFilter<"Dividend"> | Date | string
  }

  export type CompanyCreateWithoutEarningsInput = {
    ticker: string
    name: string
    country: string
    createdAt?: Date | string
    updatedAt?: Date | string
    dividends?: DividendCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutEarningsInput = {
    id?: number
    ticker: string
    name: string
    country: string
    createdAt?: Date | string
    updatedAt?: Date | string
    dividends?: DividendUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutEarningsInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutEarningsInput, CompanyUncheckedCreateWithoutEarningsInput>
  }

  export type FavoriteEarningsCreateWithoutEarningsInput = {
    user: UserCreateNestedOneWithoutFavoriteEarningsInput
  }

  export type FavoriteEarningsUncheckedCreateWithoutEarningsInput = {
    userId: number
  }

  export type FavoriteEarningsCreateOrConnectWithoutEarningsInput = {
    where: FavoriteEarningsWhereUniqueInput
    create: XOR<FavoriteEarningsCreateWithoutEarningsInput, FavoriteEarningsUncheckedCreateWithoutEarningsInput>
  }

  export type FavoriteEarningsCreateManyEarningsInputEnvelope = {
    data: FavoriteEarningsCreateManyEarningsInput | FavoriteEarningsCreateManyEarningsInput[]
    skipDuplicates?: boolean
  }

  export type CompanyUpsertWithoutEarningsInput = {
    update: XOR<CompanyUpdateWithoutEarningsInput, CompanyUncheckedUpdateWithoutEarningsInput>
    create: XOR<CompanyCreateWithoutEarningsInput, CompanyUncheckedCreateWithoutEarningsInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutEarningsInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutEarningsInput, CompanyUncheckedUpdateWithoutEarningsInput>
  }

  export type CompanyUpdateWithoutEarningsInput = {
    ticker?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dividends?: DividendUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutEarningsInput = {
    id?: IntFieldUpdateOperationsInput | number
    ticker?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dividends?: DividendUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type FavoriteEarningsUpsertWithWhereUniqueWithoutEarningsInput = {
    where: FavoriteEarningsWhereUniqueInput
    update: XOR<FavoriteEarningsUpdateWithoutEarningsInput, FavoriteEarningsUncheckedUpdateWithoutEarningsInput>
    create: XOR<FavoriteEarningsCreateWithoutEarningsInput, FavoriteEarningsUncheckedCreateWithoutEarningsInput>
  }

  export type FavoriteEarningsUpdateWithWhereUniqueWithoutEarningsInput = {
    where: FavoriteEarningsWhereUniqueInput
    data: XOR<FavoriteEarningsUpdateWithoutEarningsInput, FavoriteEarningsUncheckedUpdateWithoutEarningsInput>
  }

  export type FavoriteEarningsUpdateManyWithWhereWithoutEarningsInput = {
    where: FavoriteEarningsScalarWhereInput
    data: XOR<FavoriteEarningsUpdateManyMutationInput, FavoriteEarningsUncheckedUpdateManyWithoutEarningsInput>
  }

  export type CompanyCreateWithoutDividendsInput = {
    ticker: string
    name: string
    country: string
    createdAt?: Date | string
    updatedAt?: Date | string
    earnings?: EarningsCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutDividendsInput = {
    id?: number
    ticker: string
    name: string
    country: string
    createdAt?: Date | string
    updatedAt?: Date | string
    earnings?: EarningsUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutDividendsInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutDividendsInput, CompanyUncheckedCreateWithoutDividendsInput>
  }

  export type FavoriteDividendsCreateWithoutDividendInput = {
    user: UserCreateNestedOneWithoutFavoriteDividendsInput
  }

  export type FavoriteDividendsUncheckedCreateWithoutDividendInput = {
    userId: number
  }

  export type FavoriteDividendsCreateOrConnectWithoutDividendInput = {
    where: FavoriteDividendsWhereUniqueInput
    create: XOR<FavoriteDividendsCreateWithoutDividendInput, FavoriteDividendsUncheckedCreateWithoutDividendInput>
  }

  export type FavoriteDividendsCreateManyDividendInputEnvelope = {
    data: FavoriteDividendsCreateManyDividendInput | FavoriteDividendsCreateManyDividendInput[]
    skipDuplicates?: boolean
  }

  export type CompanyUpsertWithoutDividendsInput = {
    update: XOR<CompanyUpdateWithoutDividendsInput, CompanyUncheckedUpdateWithoutDividendsInput>
    create: XOR<CompanyCreateWithoutDividendsInput, CompanyUncheckedCreateWithoutDividendsInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutDividendsInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutDividendsInput, CompanyUncheckedUpdateWithoutDividendsInput>
  }

  export type CompanyUpdateWithoutDividendsInput = {
    ticker?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    earnings?: EarningsUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutDividendsInput = {
    id?: IntFieldUpdateOperationsInput | number
    ticker?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    earnings?: EarningsUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type FavoriteDividendsUpsertWithWhereUniqueWithoutDividendInput = {
    where: FavoriteDividendsWhereUniqueInput
    update: XOR<FavoriteDividendsUpdateWithoutDividendInput, FavoriteDividendsUncheckedUpdateWithoutDividendInput>
    create: XOR<FavoriteDividendsCreateWithoutDividendInput, FavoriteDividendsUncheckedCreateWithoutDividendInput>
  }

  export type FavoriteDividendsUpdateWithWhereUniqueWithoutDividendInput = {
    where: FavoriteDividendsWhereUniqueInput
    data: XOR<FavoriteDividendsUpdateWithoutDividendInput, FavoriteDividendsUncheckedUpdateWithoutDividendInput>
  }

  export type FavoriteDividendsUpdateManyWithWhereWithoutDividendInput = {
    where: FavoriteDividendsScalarWhereInput
    data: XOR<FavoriteDividendsUpdateManyMutationInput, FavoriteDividendsUncheckedUpdateManyWithoutDividendInput>
  }

  export type FavoriteIndicatorCreateWithoutIndicatorInput = {
    user: UserCreateNestedOneWithoutFavoriteIndicatorsInput
  }

  export type FavoriteIndicatorUncheckedCreateWithoutIndicatorInput = {
    userId: number
  }

  export type FavoriteIndicatorCreateOrConnectWithoutIndicatorInput = {
    where: FavoriteIndicatorWhereUniqueInput
    create: XOR<FavoriteIndicatorCreateWithoutIndicatorInput, FavoriteIndicatorUncheckedCreateWithoutIndicatorInput>
  }

  export type FavoriteIndicatorCreateManyIndicatorInputEnvelope = {
    data: FavoriteIndicatorCreateManyIndicatorInput | FavoriteIndicatorCreateManyIndicatorInput[]
    skipDuplicates?: boolean
  }

  export type FavoriteIndicatorUpsertWithWhereUniqueWithoutIndicatorInput = {
    where: FavoriteIndicatorWhereUniqueInput
    update: XOR<FavoriteIndicatorUpdateWithoutIndicatorInput, FavoriteIndicatorUncheckedUpdateWithoutIndicatorInput>
    create: XOR<FavoriteIndicatorCreateWithoutIndicatorInput, FavoriteIndicatorUncheckedCreateWithoutIndicatorInput>
  }

  export type FavoriteIndicatorUpdateWithWhereUniqueWithoutIndicatorInput = {
    where: FavoriteIndicatorWhereUniqueInput
    data: XOR<FavoriteIndicatorUpdateWithoutIndicatorInput, FavoriteIndicatorUncheckedUpdateWithoutIndicatorInput>
  }

  export type FavoriteIndicatorUpdateManyWithWhereWithoutIndicatorInput = {
    where: FavoriteIndicatorScalarWhereInput
    data: XOR<FavoriteIndicatorUpdateManyMutationInput, FavoriteIndicatorUncheckedUpdateManyWithoutIndicatorInput>
  }

  export type UserCreateWithoutFavoriteEarningsInput = {
    email: string
    password: string
    nickname: string
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthInfo?: OauthInfoCreateNestedManyWithoutUserInput
    favoriteDividends?: FavoriteDividendsCreateNestedManyWithoutUserInput
    favoriteIndicators?: FavoriteIndicatorCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFavoriteEarningsInput = {
    id?: number
    email: string
    password: string
    nickname: string
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthInfo?: OauthInfoUncheckedCreateNestedManyWithoutUserInput
    favoriteDividends?: FavoriteDividendsUncheckedCreateNestedManyWithoutUserInput
    favoriteIndicators?: FavoriteIndicatorUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFavoriteEarningsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFavoriteEarningsInput, UserUncheckedCreateWithoutFavoriteEarningsInput>
  }

  export type EarningsCreateWithoutFavoritesInput = {
    country: string
    releaseDate: bigint | number
    actualEPS: string
    forecastEPS: string
    previousEPS: string
    actualRevenue: string
    forecastRevenue: string
    previousRevenue: string
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutEarningsInput
  }

  export type EarningsUncheckedCreateWithoutFavoritesInput = {
    id?: number
    country: string
    releaseDate: bigint | number
    actualEPS: string
    forecastEPS: string
    previousEPS: string
    actualRevenue: string
    forecastRevenue: string
    previousRevenue: string
    companyId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EarningsCreateOrConnectWithoutFavoritesInput = {
    where: EarningsWhereUniqueInput
    create: XOR<EarningsCreateWithoutFavoritesInput, EarningsUncheckedCreateWithoutFavoritesInput>
  }

  export type UserUpsertWithoutFavoriteEarningsInput = {
    update: XOR<UserUpdateWithoutFavoriteEarningsInput, UserUncheckedUpdateWithoutFavoriteEarningsInput>
    create: XOR<UserCreateWithoutFavoriteEarningsInput, UserUncheckedCreateWithoutFavoriteEarningsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFavoriteEarningsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFavoriteEarningsInput, UserUncheckedUpdateWithoutFavoriteEarningsInput>
  }

  export type UserUpdateWithoutFavoriteEarningsInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nickname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthInfo?: OauthInfoUpdateManyWithoutUserNestedInput
    favoriteDividends?: FavoriteDividendsUpdateManyWithoutUserNestedInput
    favoriteIndicators?: FavoriteIndicatorUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFavoriteEarningsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nickname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthInfo?: OauthInfoUncheckedUpdateManyWithoutUserNestedInput
    favoriteDividends?: FavoriteDividendsUncheckedUpdateManyWithoutUserNestedInput
    favoriteIndicators?: FavoriteIndicatorUncheckedUpdateManyWithoutUserNestedInput
  }

  export type EarningsUpsertWithoutFavoritesInput = {
    update: XOR<EarningsUpdateWithoutFavoritesInput, EarningsUncheckedUpdateWithoutFavoritesInput>
    create: XOR<EarningsCreateWithoutFavoritesInput, EarningsUncheckedCreateWithoutFavoritesInput>
    where?: EarningsWhereInput
  }

  export type EarningsUpdateToOneWithWhereWithoutFavoritesInput = {
    where?: EarningsWhereInput
    data: XOR<EarningsUpdateWithoutFavoritesInput, EarningsUncheckedUpdateWithoutFavoritesInput>
  }

  export type EarningsUpdateWithoutFavoritesInput = {
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    actualEPS?: StringFieldUpdateOperationsInput | string
    forecastEPS?: StringFieldUpdateOperationsInput | string
    previousEPS?: StringFieldUpdateOperationsInput | string
    actualRevenue?: StringFieldUpdateOperationsInput | string
    forecastRevenue?: StringFieldUpdateOperationsInput | string
    previousRevenue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutEarningsNestedInput
  }

  export type EarningsUncheckedUpdateWithoutFavoritesInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    actualEPS?: StringFieldUpdateOperationsInput | string
    forecastEPS?: StringFieldUpdateOperationsInput | string
    previousEPS?: StringFieldUpdateOperationsInput | string
    actualRevenue?: StringFieldUpdateOperationsInput | string
    forecastRevenue?: StringFieldUpdateOperationsInput | string
    previousRevenue?: StringFieldUpdateOperationsInput | string
    companyId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutFavoriteDividendsInput = {
    email: string
    password: string
    nickname: string
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthInfo?: OauthInfoCreateNestedManyWithoutUserInput
    favoriteEarnings?: FavoriteEarningsCreateNestedManyWithoutUserInput
    favoriteIndicators?: FavoriteIndicatorCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFavoriteDividendsInput = {
    id?: number
    email: string
    password: string
    nickname: string
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthInfo?: OauthInfoUncheckedCreateNestedManyWithoutUserInput
    favoriteEarnings?: FavoriteEarningsUncheckedCreateNestedManyWithoutUserInput
    favoriteIndicators?: FavoriteIndicatorUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFavoriteDividendsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFavoriteDividendsInput, UserUncheckedCreateWithoutFavoriteDividendsInput>
  }

  export type DividendCreateWithoutFavoritesInput = {
    country: string
    exDividendDate: bigint | number
    dividendAmount: string
    previousDividendAmount: string
    paymentDate: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutDividendsInput
  }

  export type DividendUncheckedCreateWithoutFavoritesInput = {
    id?: number
    country: string
    exDividendDate: bigint | number
    dividendAmount: string
    previousDividendAmount: string
    paymentDate: bigint | number
    companyId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DividendCreateOrConnectWithoutFavoritesInput = {
    where: DividendWhereUniqueInput
    create: XOR<DividendCreateWithoutFavoritesInput, DividendUncheckedCreateWithoutFavoritesInput>
  }

  export type UserUpsertWithoutFavoriteDividendsInput = {
    update: XOR<UserUpdateWithoutFavoriteDividendsInput, UserUncheckedUpdateWithoutFavoriteDividendsInput>
    create: XOR<UserCreateWithoutFavoriteDividendsInput, UserUncheckedCreateWithoutFavoriteDividendsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFavoriteDividendsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFavoriteDividendsInput, UserUncheckedUpdateWithoutFavoriteDividendsInput>
  }

  export type UserUpdateWithoutFavoriteDividendsInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nickname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthInfo?: OauthInfoUpdateManyWithoutUserNestedInput
    favoriteEarnings?: FavoriteEarningsUpdateManyWithoutUserNestedInput
    favoriteIndicators?: FavoriteIndicatorUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFavoriteDividendsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nickname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthInfo?: OauthInfoUncheckedUpdateManyWithoutUserNestedInput
    favoriteEarnings?: FavoriteEarningsUncheckedUpdateManyWithoutUserNestedInput
    favoriteIndicators?: FavoriteIndicatorUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DividendUpsertWithoutFavoritesInput = {
    update: XOR<DividendUpdateWithoutFavoritesInput, DividendUncheckedUpdateWithoutFavoritesInput>
    create: XOR<DividendCreateWithoutFavoritesInput, DividendUncheckedCreateWithoutFavoritesInput>
    where?: DividendWhereInput
  }

  export type DividendUpdateToOneWithWhereWithoutFavoritesInput = {
    where?: DividendWhereInput
    data: XOR<DividendUpdateWithoutFavoritesInput, DividendUncheckedUpdateWithoutFavoritesInput>
  }

  export type DividendUpdateWithoutFavoritesInput = {
    country?: StringFieldUpdateOperationsInput | string
    exDividendDate?: BigIntFieldUpdateOperationsInput | bigint | number
    dividendAmount?: StringFieldUpdateOperationsInput | string
    previousDividendAmount?: StringFieldUpdateOperationsInput | string
    paymentDate?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutDividendsNestedInput
  }

  export type DividendUncheckedUpdateWithoutFavoritesInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    exDividendDate?: BigIntFieldUpdateOperationsInput | bigint | number
    dividendAmount?: StringFieldUpdateOperationsInput | string
    previousDividendAmount?: StringFieldUpdateOperationsInput | string
    paymentDate?: BigIntFieldUpdateOperationsInput | bigint | number
    companyId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutFavoriteIndicatorsInput = {
    email: string
    password: string
    nickname: string
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthInfo?: OauthInfoCreateNestedManyWithoutUserInput
    favoriteEarnings?: FavoriteEarningsCreateNestedManyWithoutUserInput
    favoriteDividends?: FavoriteDividendsCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFavoriteIndicatorsInput = {
    id?: number
    email: string
    password: string
    nickname: string
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthInfo?: OauthInfoUncheckedCreateNestedManyWithoutUserInput
    favoriteEarnings?: FavoriteEarningsUncheckedCreateNestedManyWithoutUserInput
    favoriteDividends?: FavoriteDividendsUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFavoriteIndicatorsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFavoriteIndicatorsInput, UserUncheckedCreateWithoutFavoriteIndicatorsInput>
  }

  export type EconomicIndicatorCreateWithoutFavoritesInput = {
    country: string
    releaseDate: bigint | number
    name: string
    importance: number
    actual: string
    forecast: string
    previous: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EconomicIndicatorUncheckedCreateWithoutFavoritesInput = {
    id?: number
    country: string
    releaseDate: bigint | number
    name: string
    importance: number
    actual: string
    forecast: string
    previous: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EconomicIndicatorCreateOrConnectWithoutFavoritesInput = {
    where: EconomicIndicatorWhereUniqueInput
    create: XOR<EconomicIndicatorCreateWithoutFavoritesInput, EconomicIndicatorUncheckedCreateWithoutFavoritesInput>
  }

  export type UserUpsertWithoutFavoriteIndicatorsInput = {
    update: XOR<UserUpdateWithoutFavoriteIndicatorsInput, UserUncheckedUpdateWithoutFavoriteIndicatorsInput>
    create: XOR<UserCreateWithoutFavoriteIndicatorsInput, UserUncheckedCreateWithoutFavoriteIndicatorsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFavoriteIndicatorsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFavoriteIndicatorsInput, UserUncheckedUpdateWithoutFavoriteIndicatorsInput>
  }

  export type UserUpdateWithoutFavoriteIndicatorsInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nickname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthInfo?: OauthInfoUpdateManyWithoutUserNestedInput
    favoriteEarnings?: FavoriteEarningsUpdateManyWithoutUserNestedInput
    favoriteDividends?: FavoriteDividendsUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFavoriteIndicatorsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nickname?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthInfo?: OauthInfoUncheckedUpdateManyWithoutUserNestedInput
    favoriteEarnings?: FavoriteEarningsUncheckedUpdateManyWithoutUserNestedInput
    favoriteDividends?: FavoriteDividendsUncheckedUpdateManyWithoutUserNestedInput
  }

  export type EconomicIndicatorUpsertWithoutFavoritesInput = {
    update: XOR<EconomicIndicatorUpdateWithoutFavoritesInput, EconomicIndicatorUncheckedUpdateWithoutFavoritesInput>
    create: XOR<EconomicIndicatorCreateWithoutFavoritesInput, EconomicIndicatorUncheckedCreateWithoutFavoritesInput>
    where?: EconomicIndicatorWhereInput
  }

  export type EconomicIndicatorUpdateToOneWithWhereWithoutFavoritesInput = {
    where?: EconomicIndicatorWhereInput
    data: XOR<EconomicIndicatorUpdateWithoutFavoritesInput, EconomicIndicatorUncheckedUpdateWithoutFavoritesInput>
  }

  export type EconomicIndicatorUpdateWithoutFavoritesInput = {
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    actual?: StringFieldUpdateOperationsInput | string
    forecast?: StringFieldUpdateOperationsInput | string
    previous?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EconomicIndicatorUncheckedUpdateWithoutFavoritesInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    actual?: StringFieldUpdateOperationsInput | string
    forecast?: StringFieldUpdateOperationsInput | string
    previous?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OauthInfoCreateManyUserInput = {
    id?: number
    provider: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    tokenExpiry?: Date | string | null
  }

  export type FavoriteEarningsCreateManyUserInput = {
    earningsId: number
  }

  export type FavoriteDividendsCreateManyUserInput = {
    dividendId: number
  }

  export type FavoriteIndicatorCreateManyUserInput = {
    indicatorId: number
  }

  export type OauthInfoUpdateWithoutUserInput = {
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OauthInfoUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OauthInfoUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FavoriteEarningsUpdateWithoutUserInput = {
    earnings?: EarningsUpdateOneRequiredWithoutFavoritesNestedInput
  }

  export type FavoriteEarningsUncheckedUpdateWithoutUserInput = {
    earningsId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteEarningsUncheckedUpdateManyWithoutUserInput = {
    earningsId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteDividendsUpdateWithoutUserInput = {
    dividend?: DividendUpdateOneRequiredWithoutFavoritesNestedInput
  }

  export type FavoriteDividendsUncheckedUpdateWithoutUserInput = {
    dividendId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteDividendsUncheckedUpdateManyWithoutUserInput = {
    dividendId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteIndicatorUpdateWithoutUserInput = {
    indicator?: EconomicIndicatorUpdateOneRequiredWithoutFavoritesNestedInput
  }

  export type FavoriteIndicatorUncheckedUpdateWithoutUserInput = {
    indicatorId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteIndicatorUncheckedUpdateManyWithoutUserInput = {
    indicatorId?: IntFieldUpdateOperationsInput | number
  }

  export type EarningsCreateManyCompanyInput = {
    id?: number
    country: string
    releaseDate: bigint | number
    actualEPS: string
    forecastEPS: string
    previousEPS: string
    actualRevenue: string
    forecastRevenue: string
    previousRevenue: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DividendCreateManyCompanyInput = {
    id?: number
    country: string
    exDividendDate: bigint | number
    dividendAmount: string
    previousDividendAmount: string
    paymentDate: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EarningsUpdateWithoutCompanyInput = {
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    actualEPS?: StringFieldUpdateOperationsInput | string
    forecastEPS?: StringFieldUpdateOperationsInput | string
    previousEPS?: StringFieldUpdateOperationsInput | string
    actualRevenue?: StringFieldUpdateOperationsInput | string
    forecastRevenue?: StringFieldUpdateOperationsInput | string
    previousRevenue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    favorites?: FavoriteEarningsUpdateManyWithoutEarningsNestedInput
  }

  export type EarningsUncheckedUpdateWithoutCompanyInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    actualEPS?: StringFieldUpdateOperationsInput | string
    forecastEPS?: StringFieldUpdateOperationsInput | string
    previousEPS?: StringFieldUpdateOperationsInput | string
    actualRevenue?: StringFieldUpdateOperationsInput | string
    forecastRevenue?: StringFieldUpdateOperationsInput | string
    previousRevenue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    favorites?: FavoriteEarningsUncheckedUpdateManyWithoutEarningsNestedInput
  }

  export type EarningsUncheckedUpdateManyWithoutCompanyInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    releaseDate?: BigIntFieldUpdateOperationsInput | bigint | number
    actualEPS?: StringFieldUpdateOperationsInput | string
    forecastEPS?: StringFieldUpdateOperationsInput | string
    previousEPS?: StringFieldUpdateOperationsInput | string
    actualRevenue?: StringFieldUpdateOperationsInput | string
    forecastRevenue?: StringFieldUpdateOperationsInput | string
    previousRevenue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DividendUpdateWithoutCompanyInput = {
    country?: StringFieldUpdateOperationsInput | string
    exDividendDate?: BigIntFieldUpdateOperationsInput | bigint | number
    dividendAmount?: StringFieldUpdateOperationsInput | string
    previousDividendAmount?: StringFieldUpdateOperationsInput | string
    paymentDate?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    favorites?: FavoriteDividendsUpdateManyWithoutDividendNestedInput
  }

  export type DividendUncheckedUpdateWithoutCompanyInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    exDividendDate?: BigIntFieldUpdateOperationsInput | bigint | number
    dividendAmount?: StringFieldUpdateOperationsInput | string
    previousDividendAmount?: StringFieldUpdateOperationsInput | string
    paymentDate?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    favorites?: FavoriteDividendsUncheckedUpdateManyWithoutDividendNestedInput
  }

  export type DividendUncheckedUpdateManyWithoutCompanyInput = {
    id?: IntFieldUpdateOperationsInput | number
    country?: StringFieldUpdateOperationsInput | string
    exDividendDate?: BigIntFieldUpdateOperationsInput | bigint | number
    dividendAmount?: StringFieldUpdateOperationsInput | string
    previousDividendAmount?: StringFieldUpdateOperationsInput | string
    paymentDate?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FavoriteEarningsCreateManyEarningsInput = {
    userId: number
  }

  export type FavoriteEarningsUpdateWithoutEarningsInput = {
    user?: UserUpdateOneRequiredWithoutFavoriteEarningsNestedInput
  }

  export type FavoriteEarningsUncheckedUpdateWithoutEarningsInput = {
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteEarningsUncheckedUpdateManyWithoutEarningsInput = {
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteDividendsCreateManyDividendInput = {
    userId: number
  }

  export type FavoriteDividendsUpdateWithoutDividendInput = {
    user?: UserUpdateOneRequiredWithoutFavoriteDividendsNestedInput
  }

  export type FavoriteDividendsUncheckedUpdateWithoutDividendInput = {
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteDividendsUncheckedUpdateManyWithoutDividendInput = {
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteIndicatorCreateManyIndicatorInput = {
    userId: number
  }

  export type FavoriteIndicatorUpdateWithoutIndicatorInput = {
    user?: UserUpdateOneRequiredWithoutFavoriteIndicatorsNestedInput
  }

  export type FavoriteIndicatorUncheckedUpdateWithoutIndicatorInput = {
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type FavoriteIndicatorUncheckedUpdateManyWithoutIndicatorInput = {
    userId?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompanyCountOutputTypeDefaultArgs instead
     */
    export type CompanyCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompanyCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EarningsCountOutputTypeDefaultArgs instead
     */
    export type EarningsCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EarningsCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DividendCountOutputTypeDefaultArgs instead
     */
    export type DividendCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DividendCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EconomicIndicatorCountOutputTypeDefaultArgs instead
     */
    export type EconomicIndicatorCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EconomicIndicatorCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OauthInfoDefaultArgs instead
     */
    export type OauthInfoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OauthInfoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompanyDefaultArgs instead
     */
    export type CompanyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompanyDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EarningsDefaultArgs instead
     */
    export type EarningsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EarningsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DividendDefaultArgs instead
     */
    export type DividendArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DividendDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EconomicIndicatorDefaultArgs instead
     */
    export type EconomicIndicatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EconomicIndicatorDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FavoriteEarningsDefaultArgs instead
     */
    export type FavoriteEarningsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FavoriteEarningsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FavoriteDividendsDefaultArgs instead
     */
    export type FavoriteDividendsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FavoriteDividendsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FavoriteIndicatorDefaultArgs instead
     */
    export type FavoriteIndicatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FavoriteIndicatorDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}