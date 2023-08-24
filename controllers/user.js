const User = require("../models/user");
const bycript = require("bcryptjs");
const image = require("../utils/image");
const { error } = require("console");
const fs = require("fs").promises;


async function getMe(req , res) {
    const { user_id } = req.user;
    const response  = await User.findById(user_id);
    if(!response){
        res.status(400).send({ msg: " no ha encontrado usuario"});
    } else {
        res.status(200).send(response);
    }

}

async function getUsers(req,res) {
    const {active} = req.query;
    let response = null
    if(active === undefined){
        response = await User.find();
               
    } else {
        response = await User.find({active});
        
    }  
    
    res.status(200).send({ response});
}

async function createUser(req,res) {
    const { password } = req.body;
    const user = new User({...req.body, active: false,});
    const salt = bycript.genSaltSync(10);
    const hasPassword = bycript.hashSync(password, salt);
   
   user.password = hasPassword;
   if(req.files.avatar){
    // controlador del avatar
    const imagePath = image.getFilePath(req.files.avatar);
    user.avatar = imagePath;

    try {
        const userStore = await user.save();
        return res.status(200).sand(userStore);
    } catch (error) {
        await fs.unlink(req.files.avatar.path);// si el susuario no se crea porque existe u otro motivo, borrar del servidor (img) que se ha enviado
        return res.status(400).send({ msg: " foto de avatar existen u otro motivo" })
    }
    
   }

   user.save((error, userStored) => {
    if(error) {
        res.status(400).send({ msg: "error al crear usuario"});
    } else {
        res.status(201).send(userStored);
    }
   })  
    

}
// Actualizar usuario
async function updateUser(req,res) {
    const { id } = req.params;
    const userData =req.body;

    // password
    if(userData.password){
        const salt = bycript.genSaltSync(10);
        const hasPassword = bycript.hashSync(userData.password, salt);
        userData.password = hasPassword;
    } else {
        delete userData.password;
    }
    // avatar

    if(req.files.avatar) {
        const imagePath = image.getFilePath(req.files.avatar);
        userData.avatar= imagePath;
    }

    User.findByIdAndUpdate({_id: id}, userData, (error ) => {
        if(error){
            res.status(400).send({msg: "error al actualizar" })

        } else {
            res.status(200).send({msg:"actualización correcta"});
        }
    })
}

async function deleteUser(req,res) {
    const { id } = req.params;
    User.findByIdAndDelete(id, (error) => {
        if(error) {
            res.status(400).send({ msg :"usuario no eliminado"});
        } else {
            res.status(200).send({ msg :"usuario eliminado"});
        }
    });

}

module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser,

};