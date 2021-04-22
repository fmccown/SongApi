# SongApi
RESTful web API created with Express and MongoDB

After cloning, run **npm install**. Then run **npm start** to start an Express server. Make sure the MongoDB deamon is running before starting.

The song API supports the following requests:

* Get all songs: GET http://localhost:8000/api/songs/
* Get song by ID: GET http://localhost:8000/api/songs/ID
* Add a new song: POST http://localhost:8000/api/songs/
* Update an existing song: PUT http://localhost:8000/api/songs/ID
* Delete a song: DELETE http://localhost:8000/api/songs/ID
