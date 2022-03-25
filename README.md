# crudServer

# Problem Description:
A simple node application that performs CRUD operation (create, read, update, delete) of customers infomation into a database.json file.

The aplication should be able to perform.
  - `GET` Request which returns all the customers data in your database.json data

  - `POST` Request which adds a new customer data to your database.json file (If there is no database.json on post, create one dynamically). 
  Also, when posting data, the customerId, timeCreated and timeUpdated fields should be generated dynamically. The timeCreated and timeUpdated fields should be the current date.

  - `PUT` Request which updates fields of a particular customer data using the customerId in database.json If an object with the id sent in the request is not found in the database.json file, return a 404 response. 
  Also, the customerId, timeCreated and timeUpdated fields should not be updated by the input from postman. The customerId and timeCreated fields are to remain the same as they were at the point of creation while the timeUpdated field should be changed dynamically to the current date whenever any field is updated.

  - `DELETE` Request which removes a particular customer data from your database.json using the customerId
  If an object with the customerId sent in the request is not found in the database.json file, return a 404 response.

(Note: customerId, timeCreated and timeUpdated should be generated dynamically.)


# Data format example:
```
For a POST Request, the customer should supply their name:

    {
      name: "John Doe"
    }


For a PUT Request, the customer should supply the customerId and new name for update:

    {
      customerId: 1,
      name: "Johnny Roe"
    }

For a DELETE Request, the customer should supply the customerId or the customer that will be deleted:

    {
      customerId: 1
    }

Database.json file content:
[
    {
      customerId: 1,
      name: "John Doe",
      timeCreated: "2022-03-23T08:05:35.455Z",
      timeUpdated: "2022-03-24T19:14:32.432Z"
    },
    {
      customerId: 2,
      name: "Jane Doe",
      timeCreated: "2022-03-24T05:17:22.333Z",
      timeUpdated: "2022-03-25T09:34:11.121Z"
    }
]

```