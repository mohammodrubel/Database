const express = require ('express')
require('dotenv').config()
const { MongoClient} = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())



    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i8wrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


    async function run (){

        try{
            await client.connect();

            const database = client.db("fardinPersonalBlog");
            const blogCollection = database.collection("blogContent");
            const commentsCollection = database.collection("comments");
            const massageCollection = database.collection("massage");
            const userCollection = database.collection("userInformation");

            // post api 
            app.post('/blogs', async (req,res)=>{
                const singleBlogs = req.body;
                const result = await blogCollection.insertOne(singleBlogs)
                res.json(result)
            })


            app.get('/blogs', async (req,res)=>{
                console.log(req.query)
                const page = req.query.page
                const size = parseInt(req.query.size)
                const myBlog = blogCollection.find({}) 
                const count = await myBlog.count()

                let getBlog;

                if(page){
                    getBlog = await myBlog.skip(page * size).limit(size).toArray()
                }else{
                    getBlog = await myBlog.toArray()
                }
                // const myBlog = blogCollection.find({})
                // const getBlog = await myBlog.toArray()
                
                res.send({
                    count,
                    getBlog
                })
            })

            //DELETE API
            app.delete('/blogs/:id',async (req,res)=>{
                const id = req.params.id ;
                const query = {_id: ObjectId(id)};
                const result = await blogCollection.deleteOne(query)
                console.log(result)
                res.json(result)
            })
            // get api comments 
            app.post('/comments', async (req,res)=>{
                const comments = req.body ;
                const result = await commentsCollection.insertOne(comments);
                console.log(result)
                res.json(result)
            })
            // get api 
            app.get('/comments',async(req,res)=>{
                const myComments = commentsCollection.find({})
                const getComments  = await myComments.toArray()
                res.send(getComments)
            })

            //DELETE API
            app.delete('/comments/:id',async (req,res)=>{
                const id = req.params.id ;
                const query = {_id: ObjectId(id)};
                const result = await commentsCollection.deleteOne(query)
                console.log(result)
                res.json(result)
            })

            // CONTACT US POST METHOD 
            app.post('/contactUs', async (req,res)=>{
                const comments = req.body ;
                const result = await massageCollection.insertOne(comments);
                console.log(result)
                res.json(result)
            })

             //CONTACT US get api 
             app.get('/contactUs',async(req,res)=>{
                const contact = massageCollection.find({})
                const contactus  = await contact.toArray()
                res.send(contactus)
            })

             //DELETE API
             app.delete('/contactUs/:id',async (req,res)=>{
                const id = req.params.id ;
                const query = {_id: ObjectId(id)};
                const result = await massageCollection.deleteOne(query)
                console.log(result)
                res.json(result)
            })

            // USER COLLECTION 
            app.post('/user',async(req,res)=>{
                const userInfo = req.body;
                const user =await userCollection.insertOne(userInfo)
                res.json(user)
            })

            // USER COLLECTION PUT OR UPSERT 
            app.put('/user' , async(req,res)=>{
                const user = req.body ;
                const filter = {email:user.email}
                const option = {upsert : true}
                const updateDoc = {$set:user}
                const result =await userCollection.updateOne(filter,updateDoc,option)
                res.json(result)
            })

            // MAKE ADMIN 
            app.put ('/user/admin',async (req,res)=>{
                const user = req.body ;
                const filter = {email:user.email}
                const updateDoc = {$set:{role:'admin'}}
                const result = await userCollection.updateOne(filter,updateDoc)
                res.json(result)
            })

            // Check Admin 
            app.get('/user/:email',async (req,res)=>{
                const email = req.params.email;
                const query = {email : email};
                const user = await userCollection.findOne(query)
                let isAdmin = false
                if(user?.role === 'admin'){
                    isAdmin = true
                }
                res.json({admin : isAdmin})
            })

        }
        finally{

        }
    }
    run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('running server')
})

app.listen(port,()=>{
    console.log('running personal server port number',port)
})

