const Song = require("../models/song");

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);
chai.use(require('chai-datetime'));

describe('Songs API', () => {
    // Initialize database before each test
    beforeEach(async () => { 
        // Clear database
        await Song.deleteMany({});
        
        // Clear array
        testSongDocs.length = 0;       

        // Add test songs
        for (const s of testSongs) {
            const song = new Song(s);
            const newSong = await song.save();
            testSongDocs.push(newSong);
        }    
    });

    const testSongDocs = [];

    const testSongs = [
        {
            title: "Hello",
            artist: "Adele",
            popularity: 10,
            releaseDate: "2015-10-23",
            genre: ["soul"]
        },
        {
            title: "Uptown Funk",
            artist: "Bruno Mars",
            popularity: 10,
            releaseDate: "2014-10-10",
            genre: ["funk", "boogie"]
        },
        {
            title: "Wrong",
            artist: "Depeche Mode",
            popularity: 7,
            releaseDate: "2009-04-06",
            genre: ["synthpop"]
        }];

    describe('GET /songs', () => {
        it('should get all the songs', (done) => {
            chai.request(server)
                .get('/api/songs')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(3);
                done();
                });
        });
    });

    describe('GET /:id song', () => {
        it('should get a song by id', (done) => {
            const song = testSongDocs[0];
            chai.request(server)
              .get('/api/songs/' + song._id)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title').eql(song.title);
                    res.body.should.have.property('artist').eql(song.artist);
                    res.body.should.have.property('popularity').eql(song.popularity);
                    res.body.should.have.property('releaseDate');
                    new Date(res.body.releaseDate).should.equalDate(song.releaseDate);
                    res.body.should.have.property('_id').eql(song._id.toString());
                done();
            });
        });
    });

    describe('GET /songs?genre=boogie', () => {
        it('should get array with only one song matching the genre', (done) => {
            const song = testSongDocs[1];
            chai.request(server)
              .get('/api/songs?genre=boogie')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.property('length').eql(1);
                    res.body[0].should.have.property('title').eql(song.title);
                    res.body[0].should.have.property('artist').eql(song.artist);
                    res.body[0].should.have.property('popularity').eql(song.popularity);
                    res.body[0].should.have.property('releaseDate');
                    new Date(res.body[0].releaseDate).should.equalDate(song.releaseDate);
                    res.body[0].should.have.property('_id').eql(song._id.toString());
                done();
            });
        });
    });

    describe('POST /songs', () => {
        it('should post a song', (done) => {            
            chai.request(server)
                .post('/api/songs')
                .send(testSongs[0])
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('title');
                    res.body.should.have.property('artist');
                    res.body.should.have.property('popularity');
                    res.body.should.have.property('releaseDate');
                    res.body.should.have.property('genre');                
                    done();
                });
        });

        it('should not post a song with popularity outside 1-10', (done) => {
            // Make a shallow copy of a song
            const badSong = Object.assign({}, testSongs[0]);

            // Give popularity outside of valid range
            badSong.popularity = 11;

        chai.request(server)
            .post('/api/songs')
            .send(badSong)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('popularity');
                res.body.errors.popularity.should.have.property('kind').eql('max');
            done();
            });
        });  
    });

    describe('PUT /songs/:id', () => {
        it('should update a song', (done) => { 
            const song = testSongs[0];
            song.title = 'New title';
            song.artist = 'New artist';
            song.popularity = 2;
            song.releaseDate = new Date('1999-12-31');

            chai.request(server)
                .put('/api/songs/' + testSongDocs[0]._id)
                .send(song)
                .end((err, res) => {
                    res.should.have.status(204);
                    
                    // Verify song was updated
                    chai.request(server)
                        .get('/api/songs/' + testSongDocs[0]._id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('title').eql(song.title);
                            res.body.should.have.property('artist').eql(song.artist);
                            res.body.should.have.property('popularity').eql(song.popularity);
                            res.body.should.have.property('releaseDate');
                            new Date(res.body.releaseDate).should.equalDate(song.releaseDate);
                            res.body.should.have.property('_id').eql(testSongDocs[0]._id.toString());
                            done();
                        });
                });
            });
    });

    describe('DELETE /songs/:id', () => {
        it('should delete a song', (done) => { 
            const song = testSongDocs[0];

            chai.request(server)
                .delete('/api/songs/' + song._id)
                .end((err, res) => {
                    res.should.have.status(204);
                    
                    // Verify song was delete
                    chai.request(server)
                        .get('/api/songs/' + song._id)
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                });
        });

        it('should return 404 for non-existing song', (done) => { 
            const songId = '222222222222222222222222';

            chai.request(server)
                .delete('/api/songs/' + songId)
                .end((err, res) => {
                    res.should.have.status(404);                    
                    done();
                });
        });
    });

});
