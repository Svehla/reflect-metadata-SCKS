
## TLDR:


Don't vendor lock yourself with unsupported experimental syntax and
don't use `reflect-metadata` which forces you to pre-process your runtime code.

Use raw vanilla Javascript and infer Typescript data types directly from the Javascript definitions.


### Good code

```typescript
const userModel = model({
  id: nonNullable(stringType())
  name: nonNullable(stringType())
})
```

### Bad code

```typescript
@Model()
class userModel 
  @Field()
  id: string

  @Field()
  name: string
}
```

[Check full working example of the good code in the Typescript playground](https://www.typescriptlang.org/play?target=6&module=6#code/PTAEFpK6dv4YmBYAUCCSqgCIEMAXPUAgJzwDsBnAMwHtSBbQgSzutAFcCWAbKzFihoMQseImQ0AUwAeABwYFQAY3ZVlzeQFEKZFtIEBeUAB4A0tICeoOQWkUAJgI2kWFAOagAPqAqdGACNpUgAaUAA1cIAlaQJLGzsHZ1BXdy9ffyCQmIiAPgAKNFBQGgoALlACvEqAbQTwiIBdAEpQIzzQWtj461ym0OLQOkCAK0rYtVJHCz7IvLQ2jtAAeTHpFQIAOhpSOkZdfUMCtdGN7YcjqgKR0ZatrQKy0DwBSisWttfQSYYZnoaP3yaBB6DAkghkNgInBUMgJCs8mk4G4fAEgjhMIxcJxQhkCiUCKRoAAyioABbSZgAQVIpHaoAA3kMCIjpJUAOR4Ol4KwcoakaQAR04LEFjgA-JVAnQ6LxpJQhix7IwqJUyZTmGgAL6guSKUjKVnEjVUvCnc4M5moErG9mgDm3c78m2gQUisXSSXS2XyxWu+R7JGGgxqn4bP6mNKecKm5gLVC61BoO2kilmgBCvoVFCtLLZnJlcpzLpK7tF4qloCLfooOpTbLTmrwJP0njzrrtnOjHlLbuFFa9VZrOfrqFTcbwADkAsF6SZrbaCw6snO++XPd7q9n-Un8QajY3JwzJ7T6b5JxbNj4m2bW252xf08wZ9lz7fmFni-6G8SpywVGkABZEIPGkUwABVwgAVXCCCAAYGQg0AADJQFg0AIIARitLpzFAdxQAAa2sOgaEw+CmkqBD6iaUBtU6ExsNBVMgLwEiVnkHh2DwXhIJiAdN1sWR7CcAQR0oRjww9cVhNElIyE4aRQAlTDQGom9OCcaQaHcL1QD1AlDSJZSAEkKBoEJJwgtlILk5IBEnKTkKSMSmXzJFOSdTY+0DOhgx4QxKncSz6WgscSlUjAAAECCocB9XOBK6QYIZGTwgjcxIqwyPQqjQHM0LrNs6DaM6JMSg01yUnSrsHW5cg+QAbgIlUw3eeihiisBYvixLNmSvZSCGEo2I4ri2AoXjTEKqznzwGykUg2oOWVKkqA5Jo8lqAZMJWjdxU2hNKrU6qBFq5cOQkigOU611utAXqEoUJKQiGkbQDG6ROO4qa+OuuD9sEw6tqGKqRIcpkTO7NtezuyLQBiuLnqRAa3tS11RvY76Jp4vie0BjkDq9I6wdOiG3IuzyV1nEJboqlTEZ65H+oIQaMZKLHxt+6bVxyPaieBknQddSoKGkAA3EJQRlsFsVxBX4CxCFQEpXhg1AUYqHYatRV4RwQgEKFlcV02ldQNRqGUHtFuUkwCiWToCkXaGHR7W7vktjRBldYnHEqGheKoZTPfUAgdRaUEveUCh2BnXheDwQJ5QZOyzqhv3Kg6hjqmolpKn-QCQNIMDTBWRhlX4h0-Y5PJwnSzOSFIJT6MYp2Xa2Tu8B9sshf9puW9Dq2I6jsPhnWTZbdTqDChqTDHaqF26sdCeCA9gRo570A-IC0Ms63xvA-4EON7Dn3tUj5M5bNm+UGvuFQAN3TxdSeaShxE3b9v0erdARgrGPCYWOFB46J2TtIG4q9bbOyVP3YBoCk7ygKDbNkDsWhbymowe0KCkQOwjpfWWaBo5-wAfNaIeAADuHYlzUxXmcHyLxT5Wy3jvEIgUwwuxKNlLClROGc2XnzUg69VBnw+r3GSXpKiKRPiI5hH1tRby4dYAATLwsRrsOTu0YbI726jD5BxkZveRW8FECj7gHAx2ijGJhYkeeatscImFmqQYqS07S5X-k5X8ylXHSGUQyZxvjTDuPIp4shlCExoCAA)

[Or whole Github Repo](https://github.com/Svehla/reflex-metadata-SCKS/blob/master/index.ts)

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hd56uijwwrw0lz8ez21i.png)

## And... what is `reflect-metadata`?

First of all we need to know [Typescript decorators API](https://www.typescriptlang.org/docs/handbook/decorators.html).

### Decorators

Decorators are syntax sugar which gives us the option to write quasi `high-order-functions` to enhance `classes`, `methods`, and `properties`.

```typescript
class ExampleClass {
  @first() // decorators
  @second() // decorators
  method() {}
}
```

You may know a similar pattern from languages like `C#`, `Java` or `Python`.

If you compare Typescript decorators to the [Python implementation](https://www.python.org/dev/peps/pep-0318/),
you can find the difference that Typescript implementation does not work for basic `functions` or `arrow functions`.
At the top of it, the decorators are only a Typescript specific feature.
But we have to pay attention because similar functionality is already [in the tc39 Javascript proposal at stage 2](https://github.com/tc39/proposal-decorators).

### reflect-metadata

That was decorators, now we have to look for the [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) library.
Let's check the documentation.

>
*Background*
- Decorators add the ability to augment a class and its members as the class is defined, through a declarative syntax.
- Traceur attaches annotations to a static property on the class.
- Languages like C# (.NET), and Java support attributes or annotations that add metadata to types, along with a reflective API for reading metadata.


If you don't fully understand who will use it in the real world you can check some libraries which use `reflect-metadata` to define the applications data models.

- [type-orm](https://typeorm.io/#/) (~24K Github stars)
- [type-graphql](https://typegraphql.com/) (~6K Github stars)
- [nest.js](https://github.com/nestjs/nest) (~37K Github Stars)
- and so on...

If you know these libraries you know what I'm talking about.
Thanks to the `reflect-metadata` library you can "hack" into the Typescript compiler and get the static type metadata from compile-time into your Javascript runtime.

For example, you may have code like:

```typescript
@ObjectType()
class Recipe {
  @Field()
  title: string;
}
```

The `reflect-metadata` library enables us to write decorators that will read metadata from the static type and this metadata may affect your Javascript runtime code.
You may imagine this metadata as an information that field title is `string`.

So that's pretty handy syntax sugar!

Yes...

But actually...

No... There is another side of the same coin.

Let's check on how to define an SQL table via the `type-orm` library using decorators and `reflect-metadata`.

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;
}
```

As you may see, there is no Javascript runtime information about the data types of columns.
So that's magic because the basic Typescript compiler should transpile code into this:

```javascript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  firstName;
}
```

The default Typescript compiler removes information about data types. Thanks to `reflect-metadata` and `"emitDecoratorMetadata": true` this code is still working
since it transfers information about static types into the runtime metadata descriptor which can be read in the Javascript runtime.

### And where is the problem?

In my humble opinion the whole philosophy of influencing Javascript runtime via static types is bad and we should not use it in the Javascript ecosystem!

The `reflect-metadata` library has to influence the Typescript compiler and forces us to vendor lock our code into Typescript specific syntax so we're no longer able to use raw vanilla Javascript. The beauty of standard Typescript is that it just enhances the real Javascript codebase and enables us to have better integration, stability and documentation.

If some typings do not work correctly we can just use `as any`, `@ts-expect-error` or `@ts-ignore`, and everything is okay. We don't need to bend our application in the name of strict-type-safe-only faith. The strongest type-system advantage of Typescript over the others is that Typescript is just a tool for developers and it does not optimize the runtime.

If you define a variable in the C language, you know how many bits will be allocated in the memory thanks to the definition of a data-type.
At first glance, it could look like Typescript is missing this kind of optimization but on the other hand we should also realise that THIS is the game changer!
It enables us to just use a type system to help us document code and avoid runtime errors with the best developer experience.
If you combine this philosophy with Typescript type inferring you get the greatest dev-tool for avoiding runtime errors which is not affecting Javascript code.

If you're more interested in some fancy usage of Typescript type inference which solves real-world problems, you can check my other articles.

- [World-first Static time RegEx engine with O(0) time complexity](https://dev.to/svehla/world-first-static-time-regex-engine-with-o-0-time-complexity-4k4e)
- [React typed state management under 10 lines of code](https://dev.to/svehla/react-typed-state-management-under-10-lines-of-code-1347)
- [Type inferred react-redux under 20 lines](https://dev.to/svehla/typescript-100-type-safe-react-redux-under-20-lines-4h8n)
- [and so on...](https://dev.to/svehla/)

### Reflect-metadata vs single source of truth (SSOT)?

If you use libraries like `typed-graphql` or `type-orm` you can find that `reflect-metadata` is only working for basic data types like: `number`, `string`, and `boolean`.
If you want to refer to another data type, you have to create a real Javascript pointer reference.

There are some real-world examples where you can see that the code is "duplicated" and you have to define real Javascript reference and static type reference.
It mean that you do not follow SSOT (Single source of truth) and DRY (Don't repeat yourself) at all.

*type-orm example* 

*(you should read comments in the code snippet)*

```typescript
@Entity()
export class PhotoMetadata {
  // here you have to define a reference into the real runtime Javascript pointer
  @OneToOne(type => Photo)
  @JoinColumn()
  // here you duplicate the pointer into Photo just to have proper static types
  photo: Photo;
}
```


*type-graphql example*

*(you should read comments in the code snippet)*

```typescript
@InputType()
class NewRecipeInput {
  // here you have to define a reference into the real runtime Javascript pointer
  @Field(type => [String])
  @ArrayMaxSize(30)
  // here you duplicate the pointer into Photo just to have proper static types
  // so that means you can have an inconsistency between the static type and @Field(...) definition
  ingredients: string[];
}
```

Our target is to have SSOT which describes our data types and give us 
- Static type inferring
- Infer cyclic pointer references
- Option to have runtime Javascript validations
- Type-safety
- Good documentation
- Enable us to use standard Javascript tooling
- Enable us to generate the schema in the runtime

------------------------------------------------------------------------

## The solution

So we have explained why using `reflect-metadata` suc*s...so what should we use instead?
Thanks to Typescript generics we're able to write data types as a Javascript function composition or just simple `hash-map`/`object`.
Then we can Infer the data types. Thanks to that our code is pure Javascript, we're able to be more flexible and generate data types on the fly and not be fixed.

### JSON Schema vs Class-based schema

In the previous examples we used class to define the schema, now we'll use a simple Javascript hashmap.
So let's define some basic ones.

```typescript
const mySchema = {
  type: 'object' as const,
  properties: {
    key1: {
      type: 'number' as const,
      required: true as const,
    },
    key2: {
      type: 'string' as const,
      required: false as const,
    },
  },
  required: false as const,
}
```

The only Typescript-specific code there is the `as const` notation which defines that the data type should have been the same as the value.

We're able to write a data type for a schema like this:

```typescript
export type SchemaArr = {
  type: 'array'
  required?: boolean
  items: Schema
}

export type SchemaObject = {
  type: 'object'
  required?: boolean
  properties: Record<string, Schema>
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

```


### Let's go deeper, Infer type from the Javascript schema!

Now we can create a generic which extracts the data type from the schema definition.

```Typescript
type NiceMerge<T, U, T0 = T & U, T1 = { [K in keyof T0]: T0[K] }> = T1

type MakeOptional<T, Required extends boolean> = Required extends true ? T : T | undefined 

export type InferSchemaType<T extends Schema> = T extends {
  type: 'object'
  properties: infer U
}
  ? // @ts-expect-error
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

```

*For simplicity I will not be describing how the `InferSchemaType<T>` generic was crafted. If you want to know more, just mention me below in the comment section.*

This generic is kinda more complicated but if we look at the result we can see that the generics work perfectly.

```typescript
type MySchemaType = InferSchemaType<typeof mySchema>
```

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u0ba0xpc62nphgbd0u29.png)


Or we can create builder util functions which build JSON with the nicer API.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z34pa7syb1nj1k3h1w2r.png)

[You can check full source code here](https://www.typescriptlang.org/play?target=6&module=6#code/PTAEFpK6dv4YmBYAUCCSqgCIEMAXPUAgJzwDsBnAMwHtSBbQgSzutAFcCWAbKzFihoMQseImQ0AUwAeABwYFQAY3ZVlzeQFEKZFtIEBeUAB4A0tICeoOQWkUAJgI2kWFAOagAPqAqdGACNpUgAaUAA1cIAlaQJLGzsHZ1BXdy9ffyCQmIiAPgAKNFBQGgoALlACvEqAbQTwiIBdAEpQIzzQWtj461ym0OLQOkCAK0rYtVJHCz7IvLQ2jtAAeTHpFQIAOhpSOkZdfUMCtdGN7YcjqgKR0ZatrQKy0DwBSisWttfQSYYZnoaP3yaBB6DAkghkNgInBUMgJCs8mk4G4fAEgjhMIxcJxQhkCiUCKRoAAyioABbSZgAQVIpHaoAA3kMCIjpJUAOR4Ol4KwcoakaQAR04LEFjgA-JVAnQ6LxpJQhix7IwqJUyZTmGgAL6guSKUjKVnEjVUvCnc4M5moErG9mgDm3c78m2gQUisXSSXS2XyxWu+R7JGGgxqn4bP6mNKecKm5gLVC61BoO2kilmgBCvoVFCtLLZnJlcpzLpK7tF4qloCLfooOpTbLTmrwJP0njzrrtnOjHlLbuFFa9VZrOfrqFTcbwADkAsF6SZrbaCw6snO++XPd7q9n-Un8QajY3JwzJ7T6b5JxbNj4m2bW252xf08wZ9lz7fmFni-6G8SpywVGkABZEIPGkUwABVwgAVXCCCAAYGQg0AADJQFg0AIIARitLpzFAdxQAAa2sOgaEw+CmkqBD6iaUBtU6ExsNBVMgLwEiVnkHh2DwXhIJiAdN1sWR7CcAQR0oRjww9cVhNElIyE4aRQAlTDQGom9OCcaQaHcL1QD1AlDSJZSAEkKBoEJJwgtlILk5IBEnKTkKSMSmXzJFOSdTY+0DOhgx4QxKncSz6WgscSlUjAAAECCocB9XOBK6QYIZGTwgjcxIqwyPQqjQHM0LrNs6DaM6JMSg01yUnSrsHW5cg+QAbgIlUw3eeihiisBYvixLNmSvZSCGEo2I4ri2AoXjTEKqznzwGykUg2oOWVKkqA5Jo8lqAZMJWjdxU2hNKrU6qBFq5cOQkigOU611utAXqEoUJKQiGkbQDG6ROO4qa+OuuD9sEw6tqGKqRIcpkTO7NtezuyLQBiuLnqRAa3tS11RvY76Jp4vie0BjkDq9I6wdOiG3IuzyV1nEJboqlTEZ65H+oIQaMZKLHxt+6bVxyPaieBknQddSoKGkAA3EJQRlsFsVxBX4CxCFQEpXhg1AUYqHYatRV4RwQgEKFlcV02ldQNRqGUHtFuUkwCiWToCkXaGHR7W7vktjRBldYnHEqGheKoZTPfUAgdRaUEveUCh2BnXheDwQJ5QZOyzqhv3Kg6hjqmolpKn-QCQNIMDTBWRhlX4h0-Y5PJwnSzOSFIJT6MYp2Xa2Tu8B9sshf9puW9Dq2I6jsPhnWTZbdTqDChqTDHaqF26sdCeCA9gRo570A-IC0Ms63xvA-4EON7Dn3tUj5M5bNm+UGvuFQAN3TxdSeaShxE3b9v0erdARgrGPCYWOFB46J2TtIG4q9bbOyVP3YBoCk7ygKDbNkDsWhbymowe0KCkQOwjpfWWaBo5-wAfNaIeAADuHYlzUxXmcHyLxT5Wy3jvEIgUwwuxKNlLClROGc2XnzUg69VBnw+r3GSXpKiKRPiI5hH1tRby4dYAATLwsRrsOTu0YbI726jD5BxkZveRW8FECj7gHAx2ijGJhYkeeatscImFmqQYqS07S5X-k5X8ylXHSGUQyZxvjTDuPIp4shlCExoCAA)

[Or in the Github Repo](https://github.com/Svehla/reflex-metadata-SCKS/blob/master/index.ts)

This is phenomenal code to define a schema and infer a type from it.
It's very strong because it enables us to just write simple raw Javascript and 100% of static types are inferred via a few generics and functions.


At the end...
Thanks to omitting experimental Typescript API and returning into good old Javascript we don't vendor-lock our code into the Typescript compiler.

### Validators

Even if we want to have runtime-validations, it's super easy to write a runtime validator on top of this schema definition.

If you're more interested in how to write validation from schema you can check the source code on my Github
https://github.com/Svehla/reflex-metadata-SCKS/blob/master/index.ts

### Use High-order-functions vs Decorators API

But what if you just like decorators and you want to enhance some functions?

Decorators are just syntax-sugar. We can program the same in raw Javascript with a few TS generics.

#### Decoration API

```typescript
class ExampleClass {
  @first() // decorator
  @second() // decorator
  method() {
    console.log('hi')
  }
}
```
vs

#### HOF (high-order-function) API

*Raw Javascript*
```typescript
// these two examples are not the same because 
// 1. the second one will  instance the method function code every time that class is instanced
// 2. there is different `this` binding
// but we'll ignore that small difference and we'll focus on different stuff...
const fn1 = first()(second()((self) => {
  console.log('hi')
})))
```

*with usage of Ramda.js library*

```typescript
import * as R from 'ramda'

const fn1 = R.pipe(
  second(),
  first()
)(self => {
  console.log('hi')
})
```

If you want to see more about how to add proper types for HOC or the Pipe function just tell me down in the comment section.

------------------------------------------------------------------------

## Who should care about this article the most?

The problem is not with the regular programmers who just install npm libraries.
The problem is the authors of libraries who think that this **new** `reflect-metadata` API with experimental decorators will save the world, but at the opposite side it just vendor locks your codebase into 1 edge-case technology.

## Is there some good library too?

Haha! good question, of course there is.

I picked two libraries which uses the same philosophy as we described in this article. 

### 1. Typed-env-parser

[Typed env parser - npm](https://www.npmjs.com/package/typed-env-parser).
[Typed env parser - github](https://github.com/Svehla/typed-env-parser#readme).

If you look for the API:

![typed-env-parser API](https://github.com/Svehla/typed-env-parser/blob/main/example/static/ts-preview-1.png?raw=true)

You can find that the definition of users does not include Typescript and the API of the function is pure Javascript.
Thanks to the type inference we get all the features of a strongly typed system in vanilla js implementation.

### 2. Yup

[Yup - npm](https://www.npmjs.com/package/yup)

Yup enable us to define JS schema and infer its data type from raw Javascript schema.

## Well That's all...

I hope that you find time & energy to read whole article with a clear and open mind.
Try to think about the syntax which you may use in your codebase on the daily basis and be sceptical about new *fancy* stuff, which enforces you to do extra compilation to make the code work...

**If you enjoyed reading the article don’t forget to like it to tell me if it makes sense to continue.**