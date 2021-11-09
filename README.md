# DataStorage

A simple Javascript data storage. No dependencies.

## Get started

Import the file on your project [storage.min.js](https://raw.githubusercontent.com/ruizalexandre/data-storage/main/storage.min.js). 

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DataStorage</title>
  </head>

  <body>
    <script src="https://raw.githubusercontent.com/ruizalexandre/data-storage/main/storage.js"></script>
  </body>
</html>
```

There are some features like 

* Init your initial data, add a key
* Set your data
* Get your data
* Select some specifif data
* Subscribe on changes
* Append some storage

### Init

```javascript
var userStorage = new DataStorage();
```

By default, your storage will have `root` key. `userStorage.key // Returns root`

```javascript
var userStorage = new DataStorage({
  // Add a unique key
  key: 'user',
  // Can add the initialState, default equals { }
  initialState: {
    name: '',
    age: 0,
  },
);
```

You can synchronize with `localStorage` or `sessionStorage`.

```javascript
var userStorage = new DataStorage({
  // Add a unique key
  key: 'user',
  // Can add the initialState, default equals { }
  initialState: {
    name: '',
    age: 0,
  },
  // Active sync here
  syncWithStorage: localStorage
);
```

Synchronization will be performed on start. When the DataStorage is created, we are checking if some data exists in storage and we are using this value for initialState.

```javascript
/* We have this in our localStorage for example
{
  name: 'Aragorn',
  age: 87,
},
*/

var userStorage = new DataStorage({
  key: 'user',
  // initialState will not be used, we have already data from storage
  initialState: {
    name: '',
    age: 0,
  },
  syncWithStorage: localStorage
);
```

### Set data

```javascript
var userStorage = new DataStorage({
  key: 'user',
  initialState: {
    name: '',
    age: 0,
  },
  syncWithStorage: localStorage
);

// Set partial data
userStorage.setData({
  name: 'Aragorn'
});

// Set entire the data
userStorage.setData({ 
  name: 'Aragorn',
  age: 87
});

// Erase all data - New definition of object if needed
userStorage.setData({ 
  lastname: '',
  firstname: '',
  age: 0
}, true);
```

### Get data

```javascript
var userStorage = new DataStorage({
  key: 'user',
  initialState: {
    name: 'Aragorn',
    age: 87,
  },
);

// Get data
userStorage.getData(); 

// Returns
// {
//    name: 'Aragorn',
//    age: 87,
// },
```

### Select data

With specific key

```javascript
var userStorage = new DataStorage({
  key: 'user',
  initialState: {
    name: 'Aragorn',
    age: 87,
  },
);

// Get data
userStorage.selectData('name'); 

// Returns
// 'Aragorn'
```

With selector

```javascript
var userStorage = new DataStorage({
  key: 'user',
  initialState: {
    name: 'Aragorn',
    age: 87,
  },
);

// Get data
userStorage.selectData((data) => data.age); 

// Returns
// 87
```

### Subscribe

Subscribe on changes.

```javascript
var userStorage = new DataStorage({
  key: 'user',
  initialState: {
    name: 'Aragorn',
    age: 87,
  },
);

// Get data
var userStorageSubscription = userStorage.subscribe(function (updatedData) {
   // Here catch all updates from updated data
}); 

// Remove subscription from updates
userStorageSubscription.unsubscribe(); 
```

### Append storage


```javascript
var userStorage = new DataStorage({
  key: 'user',
  initialState: {
    name: 'Aragorn',
    age: 87,
  },
);

var rootStorage = new RootStorage({
  key: 'root',
  initialState: {
    name: 'MyBeautifulApp',
    primaryColor: 'red',
    lang: 'fr-FR',
  },
);

rootStorage.appendStorage(userStorage);
```

Get data from any levels

```javascript
var userStorage = new DataStorage({
  key: 'user',
  initialState: {
    name: 'Aragorn',
    age: 87,
  },
);

var rootStorage = new RootStorage({
  key: 'root',
  initialState: {
    name: 'MyBeautifulApp',
    primaryColor: 'red',
    lang: 'fr-FR',
  },
);

rootStorage.appendStorage(userStorage);
rootStorage.getState(true);

// With the `true` value in `getState`
// Returns
// {
//   name: 'MyBeautifulApp',
//   primaryColor: 'red',
//   lang: 'fr-FR',
//   user: {
//     name: 'Aragorn',
//     age: 87,
//   }
// }
```

### Get storage from key


```javascript
var userStorage = new DataStorage({
  key: 'user',
  initialState: {
    name: 'Aragorn',
    age: 87,
  },
);

var rootStorage = new RootStorage({
  key: 'root',
  initialState: {
    name: 'MyBeautifulApp',
    primaryColor: 'red',
    lang: 'fr-FR',
  },
);

rootStorage.appendStorage(userStorage);
rootStorage.selectStorage('user');
// Returns userStorage
```
