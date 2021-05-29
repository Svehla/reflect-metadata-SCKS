# Why reflex-metadata s*cks

## TLDR:


Don't a vendor lock yourself with unsupported experimental syntax and
don't use `reflect-metadata` which forces you to pre-process your runtime code.

Use raw vanilla Javascript and infer Typescript data types directly from the Javascript definitions.


### Good code

```typescript
const userModel = model({
  id: nonNullable(stringType)
  name: nonNullable(stringType)
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

[Check full working example of the good code in the Typescript playground](https://www.typescriptlang.org/play?target=6&module=6#code/LAKA9GAEAiCGAutLwE6wHYGcBmB7FAtggJa5aQCu8xANpqAKYAeADvvJAMZmYdEsBRdKmINMkALyQAPAGkGAT0jN4DdABNxvFMXQBzSAB9I6CgQBGDFABpIANVsAlBvHlKVazZG26Dx0xZWTnYAfAAUoJCQ2OgAXJBhsPEA2m62dgC6AJSSIZDJzq6KwRnWkZC45gBW8c7cKOpyxfYhoDkSeQDy1Qyc8AB02Ci4BEIiYmHdVb0DauOYYZVVWf38YTGQsOIYClk5W5B1+I2FaYehoJfgUPAKLAwAtFS04oys7Mh3DJAAypwAFgwiABBFAoSSQADe5Vu93iAHJYGDYAp4eUUAwAI4UYgY9QAfni5lwuBoDAw5WIqgImHif0BRFAAF8rsw2CgOLDvvSgbApjMIdCQFEuQiljM0cLIBjsbiGASiSSyRSpSxhvcOaJaYdesdpD59LYeURWlKIJAAO7-BCbYlUZC4TbqdTSrE4vHRUQ0TT48rmq022B2zmO2DOkwUGg0INkzbiTgYSCWCNR-EJdC4DgUDQMbC6eU5ABkrtlHuI4jdsBo0XwkAABtn1Ln8+o636oHl-vB4CxaRBeLBOABrXAANys2BouAt-W4BDAsDAABYAAwARjXAGYAKwAdjX7cgABVOtBOvEMehYARvvBHTL3fK03ek99uFhy6phJaqf9IJ0AAUBAAOQeYEAIASW8e5OF9KUHzldQ3EwQlvBEfRkgyZkri5X4AV5AAhJVyXQQUYS+BFiVJEjJSiBC8VQqjlXQbCQFw41YB+dCDCkIURQoyB4QNPRaJLR8FSTYiVRZNivjwhlYGAsxLHBXjyLhQSAhU0T6KfRVqOk1l3g5T57nk3kIQ40FwWMDj+T6IxzKILidH0RyOKUwIbKc2AiIMliQFAXDgOITgGAAWSsPQGGkI9bAAVVsI8VwhI9IGLRLjzXQV8lkSBdEgIdFFwbBjxXDJ4mS1IMkgJk8ikI8D0C2SzPC2Ais6FhqDIKtYqcN1EOUJgvy8JiSPqnVS3lIaRvEVAKG+NM0uMRtm3QabKqM9lOTkiD0GwKwOKPL5YpmzxxA4ia0o8DRxD40yGDFHo+lEtVcA1agxHiXQDvBeL0QGvFkNQnZWKiJbknhXSkMUTB4Rqm6vGEzDynByAQrCyKUGi6RUaifHzQAAXgTAHjZGYybBfA8fxqFcvy0iioUEr-wIKlpEyo9Ieh5D4eSLSrAyEIMlQvbfqOk74uqvImTKKVaaiImSbJ1gKasYYUBp-HIXpgquahwH5V5jJ+eUwWKsgMXDvwohjvuDnpdqrXTVp+IldJ8m+kpjWtZ11IGcK4rSvii2rZQCX7al2QhadqVKrO266dFQSkTQVEAG58upbUdljtH3ZVmD4G96n5cgNqOq60grxoaQw4jmL9apIE4aFzCku5w31Hhl3IHjxG7oeyipPQeE88gNMC894v1dL2mK4YTrupr6QxowDuDam7uhfKfvhvOpOBKE7ix5k-OoGJj3Va92fNbLhel+r3rhI36Ge9348E68HXk-hAWUFPuUSeF9lbTxLnfee7VF5Vx6rXf+r8u7vzjiYBg4475XFAOaB42CHhNjzOtbwNtYBXHfLwSABAFAcTIlKX+4oXpxi4DweAcsohvQ+lqeI90ohMzXJwrWv9-5jwOKQ5hWtobxHmt8YRTCWH41lnjJmAAmPhZd+IaWPq5ESDCRGyNpuI6IVZMAMF0bVWR8j4Jd2QikUoAMt7xGwIY4xrEMEtW+OFShRC7bfCkPXTxJ0uQswoZdIAA)

[Or whole Github Repo](https://github.com/Svehla/dont-use-reflex-metadata/blob/master/index.ts)

## And... What the `reflex-metadata` is?

First of all, we need to know [Typescript decorators API](https://www.typescriptlang.org/docs/handbook/decorators.html).

### Decorators

Decorators are syntax-sugar that give us the option to write quasi `high-order-function` to enhance `classes`, `methods`, and `properties`.

```typescript
class ExampleClass {
  @first() // decorators
  @second() // decorators
  method() {}
}
```

You man know similar pattern from languages like `C#`, `Java` or `Python`.

If you compare Typescript decorators with the [Python implementation](https://www.python.org/dev/peps/pep-0318/),
you can find the difference that Typescript implementation does not works for basic `functions` of `arrow functions`.
At the top of it, the decorators are only Typescript specific feature.
But we have to pay attention because similar functionality is already [in the tc39 Javascript proposal at stage 2](https://github.com/tc39/proposal-decorators).

### reflex-metadata

That was decorators, now we have to look for the [reflex-metadata](https://www.npmjs.com/package/reflect-metadata) library.
Let's check the documentation.

>
*Background*
- Decorators add the ability to augment a class and its members as the class is defined, through a declarative syntax.
- Traceur attaches annotations to a static property on the class.
- Languages like C# (.NET), and Java support attributes or annotations that add metadata to types, along with a reflective API for reading metadata.


If you don't fully understand who will use it in the real world, you can check some libraries which use `reflex-metadata` to define the applications data models.

- [type-orm](https://typeorm.io/#/) (~24K Github stars)
- [type-graphql](https://typegraphql.com/) (~6K Github stars)
- [nest.js](https://github.com/nestjs/nest) (~37K Github Stars)
- and so on...

If you know these libraries you know what I'm talking about.
Thanks to the `reflex-metadata` library you can "hack" into Typescript compiler and get the static
type descriptor from the compile-time into your Javascript runtime.

For example, you may have code like:

```typescript
@ObjectType()
class Recipe {
  @Field()
  title: string;
}
```

The `reflex-metadata` library enables us to write decorators that will read metadata from the static type
and these metadata may affect your Javascript runtime code.
You may imagine this metadata as an information that field title is `string`.

So that's pretty handy syntax sugar!

Yes...

But actually...

No... There is another side of the same coin.

Let's check on how to define SQL table via `type-orm` library using decorators and `reflex-metadata`.

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
So that's magic because as you man know basic Typescript compiler should transpile code into this:

```javascript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  firstName;
}
```

Default Typescript compiler removes information about data types. Thanks to `reflex-metadata` this code is still working
because it transfers information about static types into runtime metadata descriptor which can be read in the Javascript runtime.

### And where is the problem?

In my humble opinion, the whole philosophy of influencing Javascript runtime via static types is bad and we should not use it in the Javascript ecosystem!

The `reflex-metadata` library has to influence Typescript compiler and forces us to vendor lock our code into Typescript specific
syntax so we're not longer able to use raw vanilla Javascript.
The beauty of the standard Typescript is that it just enhances real Javascript codebase and enable us to have
better integration, stability and documentation.

If some typings do not work correctly we can just use `as any`, `@ts-expect-error` or `@ts-ignore`, and everything is okay.
We don't need to bend our application in the name of strict-type-safe-nazi faith.
The strongest Typescripts type-system advantage against the others is
that Typescript is just a tool for developers and it does not optimize the runtime.

If you define the variable in the C language, thanks to the definition of data-type you know how many bits will be allocated in the memory.
At first sight, it could look that Typescript is missing this kind of optimization but at the second sight, we can find that this is the GAME CHANGER!
It enables us to just use a type system to help us document code and avoid runtime errors with the best developer experience.
If you combine this philosophy with Typescript type inferring you get the greatest
dev-tool for avoiding runtime errors which is not affecting Javascript code.

If you're more interested in some fancy usage of Typescript type inference which solves real-world problems,
you can check other articles.

- [React typed state management under 10 lines of code](https://dev.to/svehla/react-typed-state-management-under-10-lines-of-code-1347)
- [Type inferred react-redux under 20 lines](https://dev.to/svehla/typescript-100-type-safe-react-redux-under-20-lines-4h8n)
- [World-first Static time RegEx engine with O(0) time complexity](https://dev.to/svehla/world-first-static-time-regex-engine-with-o-0-time-complexity-4k4e)
- [and so on...](https://dev.to/svehla/)

### Reflex-metadata vs single source of truth (SSOT)?

If you use libraries like `typed-graphql` or `type-orm` you can find that `reflex-metadata` is only
working for basic data types like: `number`, `string`, and `boolean`.
If you want to refer to another data type, you have to create a real Javascript pointer reference.

There are some real-world examples where you can see that the code is "duplicated" and you have to define
real Javascript reference and static type reference. It mean that you do not follow SSOT and DRY at all.

*type-orm example* 

*(you should read comments in the code snippet)*

```typescript
@Entity()
export class PhotoMetadata {
  // here you have to define reference into real runtime Javascript pointer
  @OneToOne(type => Photo)
  @JoinColumn()
  // here you duplicate pointer into Photo just to have proper static types
  photo: Photo;
}
```


*type-graphql example*

*(you should read comments in the code snippet)*

```typescript
@InputType()
class NewRecipeInput {
  // here you have to define reference into real runtime Javascript pointer
  @Field(type => [String])
  @ArrayMaxSize(30)
  // here you duplicate pointer into Photo just to have proper static types
  // so that mean that you can have inconsistent between static type and @Field(...) definition
  ingredients: string[];
}
```

Our target is to have SSOT which describe our data types and give us 
- Infer static types
- Option to have runtime Javascript validations
- Code should be typed-saved
- Good documentation

------------------------------------------------------------------------

## The solution

So we showed up why the `reflex-metadata` suc*s, so what should we use instead?
Thanks to Typescript generics we're able to write data type as a Javascript function composition or just simple `hash-map`/object.
Then we can Infer data types.
Thanks to that our code is pure Javascript, we're able to be more flexible and generate data-types on fly and not
to be fixed 

### JSON Schema vs Class-based schema

In previous examples we used class to define the schema, now we'll use a simple Javascript hashmap.
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
  requiredKeys: ['key1' as const, 'key2' as const],
  required: false,
}
```

The only Typescript-specific code is there `as const` notation, which defines that the data type should have been the same as the value.

We're able to write data type for schema like this:

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

```


### Let's go deeper, Infer type from the schema!

Now we can create generic which extracts data type from the schema definition.

```Typescript
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
```

*For simplicity I'll not describe how was the `InferSchemaType<T>` generic crafted. if you want to know more, just mention me below in the comment section.*

This generic is kinda more complicated but if we look at the result, we can see that the generics works perfectly.

```typescript
type MySchemaType = InferSchemaType<typeof mySchema>
```

[you can check full source code here](https://www.typescriptlang.org/play?target=6&module=6#code/LAKA9GAEAiCGAutLwE6wHYGcBmB7FAtggJa5aQCu8xANpqAKYAeADvvJAMZmYdEsBRdKmINMkALyQAPAGkGAT0jN4DdABNxvFMXQBzSAB9I6CgQBGDFABpIANVsAlBvHlKVazZG26Dx0xZWTnYAfAAUoJCQ2OgAXJBhsPEA2m62dgC6AJSSIZDJzq6KwRnWkZC45gBW8c7cKOpyxfYhoDkSeQDy1Qyc8AB02Ci4BEIiYmHdVb0DauOYYZVVWf38YTGQsOIYClk5W5B1+I2FaYehoJfgUPAKLAwAtFS04oys7Mh3DJAAypwAFgwiABBFAoSSQADe5Vu93iAHJYGDYAp4eUUAwAI4UYgY9QAfni5lwuBoDAw5WIqgImHif0BRFAAF8rsw2CgOLDvvSgbApjMIdCQFEuQiljM0cLIBjsbiGASiSSyRSpSxhvcOaJaYdesdpD59LYeURWlKIJAAO7-BCbYlUZC4TbqdTSrE4vHRUQ0TT48rmq022B2zmO2DOkwUGg0INkzbiTgYSCWCNR-EJdC4DgUDQMbC6eU5ABkrtlHuI4jdsBo0XwkAABtn1Ln8+o636oHl-vB4CxaRBeLBOABrXAANys2BouAt-W4BDAsDAABYAAwARjXAGYAKwAdjX7cgABVOtBOvEMehYARvvBHTL3fK03ek99uFhy6phJaqf9IJ0AAUBAAOQeYEAIASW8e5OF9KUHzldQ3EwQlvBEfRkgyZkri5X4AV5AAhJVyXQQUYS+BFiVJEjJSiBC8VQqjlXQbCQFw41YB+dCDCkIURQoyB4QNPRaJLR8FSTYiVRZNivjwhlYGAsxLHBXjyLhQSAhU0T6KfRVqOk1l3g5T57nk3kIQ40FwWMDj+T6IxzKILidH0RyOKUwIbKc2AiIMliQFAXDgOITgGAAWSsPQGGkI9bAAVVsI8VwhI9IGLRLjzXQV8lkSBdEgIdFFwbBjxXDJ4mS1IMkgJk8ikI8D0C2SzPC2Ais6FhqDIKtYqcN1EOUJgvy8JiSPqnVS3lIaRvEVAKG+NM0uMRtm3QabKqM9lOTkiD0GwKwOKPL5YpmzxxA4ia0o8DRxD40yGDFHo+lEtVcA1agxHiXQDvBeL0QGvFkNQnZWKiJbknhXSkMUTB4Rqm6vGEzDynByAQrCyKUGi6RUaifHzQAAXgTAHjZGYybBfA8fxqFcvy0iioUEr-wIKlpEyo9Ieh5D4eSLSrAyEIMlQvbfqOk74uqvImTKKVaaiImSbJ1gKasYYUBp-HIXpgquahwH5V5jJ+eUwWKsgMXDvwohjvuDnpdqrXTVp+IldJ8m+kpjWtZ11IGcK4rSvii2rZQCX7al2QhadqVKrO266dFQSkTQVEAG58upbUdljtH3ZVmD4G96n5cgNqOq60grxoaQw4jmL9apIE4aFzCku5w31Hhl3IHjxG7oeyipPQeE88gNMC894v1dL2mK4YTrupr6QxowDuDam7uhfKfvhvOpOBKE7ix5k-OoGJj3Va92fNbLhel+r3rhI36Ge9348E68HXk-hAWUFPuUSeF9lbTxLnfee7VF5Vx6rXf+r8u7vzjiYBg4475XFAOaB42CHhNjzOtbwNtYBXHfLwSABAFAcTIlKX+4oXpxi4DweAcsohvQ+lqeI90ohMzXJwrWv9-5jwOKQ5hWtobxHmt8YRTCWH41lnjJmAAmPhZd+IaWPq5ESDCRGyNpuI6IVZMAMF0bVWR8j4Jd2QikUoAMt7xGwIY4xrEMEtW+OFShRC7bfCkPXTxJ0uQswoZdIAA)

This is phenomenal code to define schema and infer type from it.
Its' very strong because it enables us to just write simple
raw Javascript and 100% of static types are inferred via a few generics and functions.


At the end...
Thanks to omitting experimental Typescript API and returning into good old Javascript we don't vendor-lock our code into Typescript compiler.

#### validators

Even if we want to have runtime-validations its super eay to write runtime validator on top of this schema definition.

If you're more interested in how to write validation from schema you can check source code on Github
https://github.com/Svehla/dont-use-reflex-metadata/blob/master/index.ts

### use High-order-functions vs Decorators API

But what if you just like decorators and you want to enhance some functions?

Decorators are just syntax-sugar. We can program the same in raw Javascript with few TS generics.

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

##### Raw
```typescript
// these two examples are not the same because 
// 1. the second one will  instance the method function code every time that class is instanced
// 2. there is different `this` binding
// but we'll ignore that small difference and we'll focus on different stuffs...
const fn1 = first()(second()((self) => {
  console.log('hi')
})))
```

##### with usage of Ramda.js library

```typescript
import * as R from 'ramda'

const fn1 = R.pipe(
  second(),
  first()
)(self => {
  console.log('hi')
})
```

If you want to see more about how to add proper types for HOC or Pipe function, just wrote me down in the comment section.

------------------------------------------------------------------------

## Who should care about this article the most?

The problem is not with the regular programmers who just install npm libraries.
The problem is with the authors of libraries whose think that this **new** `reflex-metadata` API with experimental decorators will
save the world, but at the opposite side it just vendor lock your codebase into 1 edge-case technology.

## Is there some good library too?

Haha! good question, of course there is.

I picked one library which uses the same philosophy as we described in this article. 

### Typed-env-parser

[Typed env parser - npm](https://www.npmjs.com/package/typed-env-parser).
[Typed env parser - github](https://github.com/Svehla/typed-env-parser#readme).

If you look for the API:

![typed-env-parser API](https://github.com/Svehla/typed-env-parser/blob/main/example/static/ts-preview-1.png?raw=true)

You can find that users definition does not include typescript and the API of the function is clear Javascript.
Thanks to the type inference we get all features of strongly typed system in vanilla js implementation.

## Well That's all...

I hope that you find time & energy to read whole article with clear and open mind.
Try to think about the syntax which you may use in your codebase on the daily basics
and be skeptical about new *fancy* stuff, which enforce you to do extra compilation to make the code works...

** If you enjoyed reading the article don’t forget to like it to tell me that it makes sense to continue. **