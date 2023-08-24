const mongoose= require("mongoose");
const Newsletter = require("../models/newsletter");

function suscribeEmail(req, res){
    const {email} = req.body;
    const newsletter = new Newsletter({
        email: email.toLowerCase(),
    });

    if(!email)res.status(400).send({msg:"llenar el campo con email valido"});

    newsletter.save((error, email) => {
        if(error){
            res.status(400).send({msg:"no se suscribio correo"})
       
        }else{
            res.status(200).send(email);
        }
    });
}

function getEmails(req,res){
const{page = 1 , limit = 10} = req.query;
const options = {
    page:parseInt(page),
    limit: parseInt(limit),
    
};
Newsletter.paginate({}, options, (error,emailStored)=>{
    if(error){
        res.status(400).send({msg:"no se pueden mostrar emails"})
    }else{
        res.status(200).send(emailStored);
    }
})
}
function emailDelete(req,res){
    const {id} = req.params;
    Newsletter.findByIdAndDelete(id, (error)=>{
        if(error){
            res.status(400).send({msg:"no se pudeo eliminar correo"})
        }else{
            res.status(200).send({msg:"correo eliminado"})
        }
    })
}

module.exports= {
    suscribeEmail,
    getEmails,
    emailDelete

};

