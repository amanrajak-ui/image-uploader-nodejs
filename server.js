import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

const app =express();
import { v2 as cloudinary } from 'cloudinary';

 // Configuration
    cloudinary.config({ 
        cloud_name: 'dta5ldnof', 
        api_key: '479131425454678', 
        api_secret: '1SRstd5c11uoQlIR8yxirj-W1pw' // Click 'View API Keys' above to copy your API secret
    });

mongoose
  .connect(
    "mongodb+srv://akrajak151:XusZ4xuvs59L4Ago@cluster0.vxnoxx8.mongodb.net/",
    {
      dbName: "NodeJs_Mastery_Course",
    }
  )
  .then(() => console.log("MongoDb Connected..!"))
  .catch((err) => console.log(err));

//rendering ejs file
app.get('/',(req,res)=>{
    res.render('index.ejs',{url:null})
})


const storage = multer.diskStorage({
  destination: './public/uploads',                                                    // mean yaha pe sara image dal rahe hai 
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })                                        //iske through image upload ho raha hai 

app.post('/upload', upload.single('file'), async (req, res)=> {
  
    const file =req.file.path
    //                                      cloudinary pe upload krne ka code 
    const cloudinaryRes = await cloudinary.uploader.upload(file,{
      folder:"Nodejs_Mastry_course"
    })

      // save to database
    const db = await File.create({
    filename: file.originalname,
    public_id: cloudinaryRes.public_id,
    imgUrl: cloudinaryRes.secure_url,
  });

    res.render("index.ejs", { url: cloudinaryRes.secure_url });   //image ko dhikhane ke liye 

    //res.json({message:'file uploaded successfully',cloudinaryRes})
   
});

//                                                                    ab dbms me dalne ka code
const imageSchema= new mongoose.Schema({
    filename:String,
    public_id:String,  // public id ke through hii in future img delete kr sakte hai
    imageUrl:String,

});

const File = mongoose.model("cloudinary", imageSchema);





const port =5000;
app.listen(port,()=>console.log(`server is running at ${port}`))