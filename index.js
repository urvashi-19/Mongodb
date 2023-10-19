const express = require('express');
const app = express()
// middleware - Pluggin
app.use(express.urlencoded({extended:false}))


// Step1 : reuire the mongoose model
const mongoose = require('mongoose');

// Step2 : make the connection

//for url type mongosh in cmd
mongoose.connect('mongodb://127.0.0.1:27017/salesforce').then(
    ()=> console.log("mongodb connected...")
).catch(
    (err) => console.log("err found", err)
)


// Step3 : make the userSchema
const userSchema = new mongoose.Schema({
    firstName :{
        type : String,
        required: true,
    },

    lastName :{
        type: String,

    },

    email:{
        type: String,
        required: true,
        unique: true,
    },

    gender:{
        type: String
    },

    jobTitle:{
        type: String
    }
},
  { timestamps : true}
);


// Step4 : make the model("users") 
const User =  mongoose.model("user" , userSchema);


app.post('/api/users' , async (req , res)=>{

    
    const body = req.body;
    // setting the status code
    if(!body || !body.first_name || !body.gender){
        return res.status(400).json({msg:"somethings is pending"})
    }
    
    // adding data to the db
      
    const result = await User.create({
        firstName : body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title
    })

    console.log("result: " , result)

   return  res.status(201).json({msg: "successfully done.."})
 
})


app.get('/users' , async(req , res)=>{
  

    // here User is model
    const alldbusers = await User.find({}) 
    const html = `
    <ul>

     ${alldbusers.map((data)=>
        `<li>${data.firstName} - ${data.email}</li>`
    ).join("")}
    </ul>`

    res.send(html);
});


app.get('/api/users', async (req , res)=>{

    //setting headers 
    const alldbusers = await User.find({});
    res.setHeader("Myname"  ,  "Piyush Garg");  
    console.log(req.headers);
    res.json(alldbusers) ;
})


app.get('/api/users/:id' , async (req , res)=>{
    
    const user  =  await User.findById(req.params.id);
    if(!user) return res.status(404).json({error: "user not found"});

    return res.json(user);
    

})

app.patch('/api/users/:id' , async (req , res)=>{
    //for  edit(patch) we need id
    await User.findByIdAndUpdate(req.params.id , {lastName : "changes"});

    return res.json({status:"success"});
})

app.delete('/api/users/:id' , async(req , res)=>{
    //for  edit(delete) we need id
    await User.findByIdAndDelete(req.params.id);
    return res.json({status:"success"});
})











PORT = 8000;
app.listen(PORT , ()=>{
    console.log("server is running at " , PORT);
})