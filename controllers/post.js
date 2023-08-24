const Post = require("../models/post");
const image = require("../utils/image");

function createPost(req, res){
    const post = new Post(req.body);
    post.created_at = new Date();

    const imagePath = image.getFilePath(req.files.miniature);
    post.miniature = imagePath;
    post.save((error, postStored) => {
        if(error) {
            res.status(400).send({msg: "Error al crear un blog"})
        }else{
            res.status(200).send(postStored);
        }
    });
}

function getPosts(req, res){
    const {page=1 , limit = 10 }= req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { created_at:"desc"},
    };
    Post.paginate({}, options,(error, postsStored)=>{
        if(error){
            res.status(400).send({msg:"no existen post"})
        }else{
            res.status(200).send(postsStored);
        }
    })
}



function updatePost(req,res) {
    const {id} = req.params;
    const postData = req.body;
    if(req.files.miniature) {
        const imagePath = image.getFilePath(req.files.miniature);// esto se hace cuando hay imagenes en la actualizacion de un fichero
        postData.miniature = imagePath;
    }
    Post.findByIdAndUpdate( {_id: id},postData, (error) => {
        if(error){
            res.status(400).send({msg: "error al actualizar el post"})
        }else{
            res.status(200).send({msg: " actualizado correctamente el post"})
        }
    } )
}

function deletePost(req,res) {
    const {id} = req.params;
    Post.findByIdAndDelete(id, (error)=> {
        if(error){
            res.status(400).send({msg:"no se elimino post"})
    }else{
        res.status(200).send({msg:"post eliminado con exito"})
    }
    })

} 

function getPost(req,res){
    const {path}=req.params;
    Post.findOne({path}, (error, postStored) =>{
        if(error){
            res.status(500).send({msg:"error del server"});
        }else if(!postStored){
            res.status(400).send({msg:"no existe post"});
        }else{
            res.status(200).send(postStored);
            console.log();
        }
    })
}

function seekPost(req,res){
    const {title}=req.params;
    Post.findOne({title}, (error,postseek)=>{
        if(error){
            res.status(500).send({msg:"error del server"});
        }else if(!postseek){
            res.status(400).send({msg:"no existe post"});
        }else{
            res.status(200).send(postseek);
            
        }
    })
}


module.exports={
    createPost,
    getPosts,
    updatePost,
    deletePost,
    getPost,
    seekPost
    
    
};