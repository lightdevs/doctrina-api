# DOCTRINA


Doctrina is an online educational platform.
With the help of the Doctrina, you can easily transfer the educational process to your device.

### Run API

```
# install dependencies
$ npm i
# run server
$ npm run start
```

Now you should be able to access API at [http://localhost:5000](http://localhost:5000)

### Interraction with GraphQL

```
fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({query: "{courses{title}}"})
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));
```

### GraphQL

###### Create model
```
mutation{
  createCourse(
    course: {
    	title: "Math",
    	description: "Cool!"
  	}){
    title,
    description,
    createdAt
  }
}
```

###### Get models
```
{
  courses{
    title,
    description
  }
}
```