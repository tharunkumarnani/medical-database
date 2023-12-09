const express=require('express')
const {open}=require('sqlite')
const sqlite3=require('sqlite3')
const path=require('path')
const dbPath=path.join(__dirname,"diseaseAndMedicine.db")
const app=express()
app.use(express.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Replace with your domain or '*' for any domain
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));
const PORT = process.env.PORT || 9000;

let db;
const initializeDbAndServer=async()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(PORT,()=>{
            console.log("server running....")
        })
    }catch(e){
        console.log(`Databse Error Message : ${e}`)
    }
}

initializeDbAndServer()
//get all diseases api
app.get('/get-diseases',async(req,res)=>{
    const getAllDiseasesQuery=`
    select * from disease_details;`;
    const allArray=await db.all(getAllDiseasesQuery)
    res.send(allArray)
})
// get disease by id api
app.get('/get-disease-by-id/:diseaseId',async(req,res)=>{
    const {diseaseId}=req.params
    const getDiseaseById=`
    select * from disease_details
    where id=${diseaseId};`;
    const diseaseDetails=await db.get(getDiseaseById)
    res.send(diseaseDetails)
})

// create disease api
app.post('/add-disease',async (req,res)=>{
    const diseaseDetails=req.body
    console.log(diseaseDetails)
    const {id,diseaseName,diseaseSource,byInjection,byTablets,byNatural,imageUrl,videoUrl}=diseaseDetails
    const createDiseaseQuery=`
    INSERT INTO disease_details
    VALUES (${id},'${diseaseName}','${diseaseSource}','${byInjection}','${byTablets}','${byNatural}','${imageUrl}','${videoUrl}');`;
    const queryResponse=await db.run(createDiseaseQuery)
    res.send(queryResponse)
})


// Update disease by id api
app.put('/update-disease/:diseaseId',async(req,res)=>{
    const {diseaseId}=req.params
    const updateDetails=req.body
    const {imageUrl="",videoUrl=""}=updateDetails
    const updateDiseaseById=`
    update disease_details
    set disease_image_url='${imageUrl}',
        video_url='${videoUrl}'
    where id=${diseaseId};`;
    const response=await db.run(updateDiseaseById)
    res.status(200)
    res.send('Disease updated Succesfully --Bhavana Reddy')
})


// Delete disease by id api
app.delete('/delete-disease/:diseaseId',async (req,res)=>{
    const {diseaseId}=req.params
    console.log(diseaseId)
    const deleteDiseaseById=`
    delete from disease_details
    where id=${diseaseId};`
    const response=await db.run(deleteDiseaseById)
    res.status(200)
    res.send("Disease deleted Successfully --Bhavana Reddy")
})