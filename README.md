# DOCTRINA

Doctrina is an online educational platform.
With the help of the Doctrina, you can easily transfer the educational process to your device.



GraphQL:

to create model:

```
mutation{
  createCource(cource: {
    title: "Math",
    description: "Cool!"
  }){
    title,
    description,
    createdAt
  }
}
```

to get models:

```
{
  cources{
    title,
    description
  }
}
```