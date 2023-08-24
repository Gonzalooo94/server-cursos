const mongoose = require("mongoose");
const Course = require("../models/course");
const image = require("../utils/image");

async function createCourse(req, res) {
    const course = new Course(req.body);
    const imagePath = image.getFilePath(req.files.miniature);
    course.miniature = imagePath;
    course.save((error, courseStored)=>{
        if(error){
            res.status(400).send({msg :"curso no creado"})
        }else{
            res.status(201).send({msg: "curso creado"})
    }})
}

 function getCourse(req, res ) {

    const { page = 1, limit =10} = req.query;
    const option = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    Course.paginate({}, option, (error,courses )=>{
        if(error){
            res.status(400).send({msg: "no hay cursos que mostrar"})
        }else{
            res.status(200).send(courses);
        }

    });

    
}

function updateCourse(req, res){
    const {id} = req.params;
    const courseData = req.body;
        if(req.files.miniature){
            const imagePath = image.getFilePath(req.files.miniature);
            courseData.miniature = imagePath;
        }
        Course.findByIdAndUpdate({_id: id}, courseData , (error) => {
            if(error){
                res.status(400).send({msg:"no actualizo Curso"})
            }else{
                res.status(200).send({msg:"se actualizó Curso"});
            }
        });
}
function deleteCourse(req,res){
    const {id} = req.params;
    Course.findByIdAndDelete(id, (error)=>{
        if(error){
            res.status(400).send({msg:"no se elimino el curso"})
        }else{
            res.status(200).send({msg:"curso elminado"})
        }
    })
}



module.exports = {
    createCourse,
    getCourse,
    updateCourse,
    deleteCourse,

}