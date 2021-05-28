# Why reflex-metadata is Javascript anti-pattern and we should fight not to use it!

## TLDR:

Don't use reflect-metadata for getting Javascript code works, use just
pure Javascript with Typescript generics to infer static types directly from the code.

It's more Javascript way to write
```typescript
const userModel = model({
  id: nonNullable(stringType)
  name: nonNullable(stringType)
})
```

than

```typescript
@Model()
class userModel 
  @Field()
  id: string

  @Field()
  name: string
}
```


## And... What the `reflex-metadata` is?

First of all, we need to know [Typescript decorators API](https://www.typescriptlang.org/docs/handbook/decorators.html).
This syntax sugar give us option to write code like this:

```typescript
class ExampleClass {
  @first() // decorators
  @second() // decorators
  method() {}
}
```

You man know this kind of code from languages like `C#`, `Java` or `Python`.

If you compare Typescript decorators with the [Python implementation](https://www.python.org/dev/peps/pep-0318/),
you can find the difference that Typescript implementation works only stuffs around the classes and not for basic `functions` of `arrow functions`.
Similar functionality is already [in the tc39 Javascript proposal at stage 2](https://github.com/tc39/proposal-decorators).

But there is another library called [reflex-metadata](https://www.npmjs.com/package/reflect-metadata).
Let's check `reflex-metadata` documentation.

"""
*Background*
- Decorators add the ability to augment a class and its members as the class is defined, through a declarative syntax.
- Traceur attaches annotations to a static property on the class.
- Languages like C# (.NET), and Java support attributes or annotations that add metadata to types, along with a reflective API for reading metadata.
"""

If you don't fully understand who will use it in the real world, you can check some libraries which use `reflex-metadata` to define the application data model.

- [type-orm](https://typeorm.io/#/) (24.4K Github stars)
- [type-graphql](https://typegraphql.com/) (6.3K Github stars)
- and so on...

If you know these libraries you know what I'm talking about. Thanks to the `reflex-metadata` library you can "hack" Typescript
runtime and get static type directly into your runtime code.
For example, you may have code like:

```typescript
@ObjectType()
class Recipe {
  @Field()
  title: string;
}
```

Reflex-metadata library enables to write decorators that will read metadata from the static type and it will affect of
Javascript runtime code.

So that's pretty handy syntax sugar!

Yes...

But actually... There is another side to this coin.

In another example, we can see the definition of SQL table via type-orm library using decorators plus `reflex-metadata` API.

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;
}
```

As you may see, there is no Javascript runtime information about the data types of these fields.
So that's magic coz as you man know raw Typescript compiler will transpile code into this:

```javascript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  firstName;
}
```

The compiler removes information about data types. But thanks to `reflex-metadata` this code is still working
because it transfers static types into runtime metadata information which are used in the Javascript runtime.

### And where is the problem?

In my humble opinion, the whole philosophy of influencing Javascript runtime from static types is bad and we should avoid it!
It's magic to change the Typescript compiler way of working and it forces us to use Just Typescript and it adds vendor lock to use raw vanilla Javascript.
The beauty of the Typescript is that it just enhances real Javascript runtime code and enable us to have
better integration and documentation and it doesn't trigger us to change anything.
If something does not work we can just use `as any`, `@ts-expect-error` or `@ts-ignore`, and everything is okay.
We don't need to bend our application in the name of type-nazi faith.

The strongest Typescripts type-system advantage against the other strongly typed systems is
that Typescript is just a tool for developers and it does not optimize the runtime.
If you define the variable in the C language, thanks to data-type you define how many bits will be allocated in the memory.
At first sight, it could look that Typescript is missing something but at the second sight, we can find that this is the game changer!
It enables us to just use a type system to help us document code and avoid runtime errors. If you combine this philosophy with
Typescript type inference you get the greatest dev-tool on how to write code without runtime errors and with 0 lines of strongly typed structures.

If you're more interested in some fancy usage of type inference for real-world problems,
you can check other articles like:

- [React typed state management under 10 lines of code](https://dev.to/svehla/react-typed-state-management-under-10-lines-of-code-1347)
- [Type inferred react-redux under 20 lines](https://dev.to/svehla/typescript-100-type-safe-react-redux-under-20-lines-4h8n)
- [World-first Static time RegEx engine with O(0) time complexity](https://dev.to/svehla/world-first-static-time-regex-engine-with-o-0-time-complexity-4k4e)
- [and so on...](https://dev.to/svehla/)

### What about a single source of truth and DRY pattern?

If you use libraries like `typed-graphql` or `typed-orm` you can find that `reflex-metadata` is only
working for basic data types like: `number`, `string`, and `boolean`.
If you want to refer to another data type, you have to create a real Javascript reference.

There are some real-world examples where you can see that the code is "duplicate" and you have to define
real Javascript reference and Static type reference so you duplicate the same information on two places

### type-orm example

```typescript
@Entity()
export class PhotoMetadata {
  // here you have to define Javascript pointer
  @OneToOne(type => Photo)
  @JoinColumn()
  // here you duplicate pointer into Photo just to have proper static types
  photo: Photo;
}
```


#### type-graphql example

```typescript
@InputType()
class NewRecipeInput {
  // here you have to define Javascript pointer
  @Field(type => [String])
  @ArrayMaxSize(30)
  // here you duplicate pointer into Photo just to have proper static types
  // so that mean that you can have inconsistent between static type and @Field(...) definition
  ingredients: string[];
}
```

Our target is to have 1 single source of truth which describe our data type and could give us 
- Static types
- Option to have runtime Javascript validations
- Option to combine and merge types 
- Code should be 100% Javascript without writing static-types
- All should be type-safe by default

## Solution

Okay so that means, that `reflex-metadata` sucks, but what should we use instead?

### Schema vs Class

You can declare the shape of data via a good old Javascript object instead of class.

#### validators

You can take your schema object and generate validators from it.

#### Getting TS Type

Do you have some javascript objects? We can write generic which extract raw data types from it.

### use High-order-functions instead of Decorators

High-order-functions (HOC in short) enable us to reuse some patterns in calling a function

### Let's go deeper! 

### High order function vs decorations API

// is this part relevant?

Thanks to this feature you can implement nicer API for high-order-function pattern. That looks really nice.
We can compare these two snippets:

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

```typescript
// these two examples are not the same because 
// 1. the second one will  instance the method function code every time that class is instanced
// 2. there is different `this` binding
// but we'll ignore that small difference and we'll focus on different stuffs...
class ExampleClass {
  method = first()(second(() => {
    console.log('hi')
  }))
}
```



### Raw Javascript Schema


## Who should care about it?

The problem is not with the regular programmers but with the authors of libraries.