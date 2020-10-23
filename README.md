# DOCTRINA


Doctrina is an online educational platform.
With the help of the Doctrina, you can easily transfer the educational process to your device.


### Install dependencies

```
# install dependencies
$ npm i
$ cd doctrina-ui
$ npm i
```

### Run API

```
# run server
$ npm run server
```
Now you should be able to access API at [http://localhost:5000](http://localhost:5000)

### Run Frontend
```
# run angular client
$ npm run client
```
Now you should be able to access client part at  [http://localhost:4200]( http://localhost:4200)

### Run API and Frontend
```
# start server and client with one command
$ npm run dev
```





### Interract with GraphQL

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
