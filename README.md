# DOCTRINA

Doctrina is an online educational platform.
With the help of the Doctrina, you can easily transfer the educational process to your device.

Interraction with **GraphQL**

```
fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({query: "{cources{title}}"})
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));
```

**GraphQL**

To create model:
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

To get models:
```
{
  cources{
    title,
    description
  }
}
```