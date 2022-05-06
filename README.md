# SongApi
RESTful web API created with Express and MongoDB. This API is from the [Web Programming zyBook](https://www.zybooks.com/catalog/web-programming/).

First, ensure the MongoDB deamon is running since the API reads and writes to MongoDB.

After cloning, run **npm install**. Then run **npm start** to start an Express server on port 8000.

The song API supports the following requests:

* Get all songs: GET http://localhost:8000/api/songs/
* Get song by ID: GET http://localhost:8000/api/songs/ID
* Add a new song: POST http://localhost:8000/api/songs/
* Update an existing song: PUT http://localhost:8000/api/songs/ID
* Delete a song: DELETE http://localhost:8000/api/songs/ID
