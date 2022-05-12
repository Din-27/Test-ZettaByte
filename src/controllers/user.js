const { user } = require('../../models')
const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    const schema = joi.object({
        email: joi.string().min(5).required(),
        password: joi.string().min(8).required(),
        name: joi.string().min(3).required(),

    });
    const {error} = schema.validate(req.body)
    if(error)
    return res.status(400).send({
        error: {
            message: error.details[0].message,
        }
    })
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const newUser = await user.create({
        name : req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: "customer",
      })
      const token = jwt.sign({id:newUser.id}, process.env.TOKEN_KEY)
      res.status(200).send({
          status: 'success',
          data:{
            name: newUser.name,
            token
          }
      })
      
    } catch (e) {
      console.log(e);
      res.send({
        status: "failed",
        message: "thats wrong",
      });
    }
  };

  exports.login = async (req, res) => {
        const schema = joi.object({
        email: joi.string().email().min(5).required(),
        password: joi.string().min(8).required()
    })
    const {error} = schema.validate(req.body)
        if(error)
        return res.status(400).send({
            error: {
                message: error.details[0].message
            }
        })
    try{
        const userLogin = await user.findOne({
            where:{
                email: req.body.email,
            },
            attributes:{
                exclude: ['status', 'createdAt', 'updatedAt']
            }
        })
        const isValid = await bcrypt.compare(req.body.password, userLogin.password)
        if(!isValid){
            return res.status(400).send({
                status : 'failed',
                message: 'email and password not match'
            })
        }
        const token = jwt.sign({id:userLogin.id}, process.env.TOKEN_KEY)
        res.status(200).send({
            status: 'success',
            data:{
                user:{
                name: userLogin.name,
                email: userLogin.email,
                role: userLogin.role,
                image: userLogin.image,
                token
                }
            }
        })
    }catch (e) {
        console.log(e);
        res.send({
          status: "failed",
          message: "errorr",
        });
    }
    
}

exports.getUsers = async (req, res) => {
  try {
    let users = await user.findAll({
      attributes: {
        exclude:['status', 'password', 'createdAt', 'updatedAt']
      }
    })
    res.send({
      status: "Success",
      data : {
        users
      }
    })
  } catch (e) {
    console.log(e);
    res.send({
      status: "failed",
      message: "thats wrong",
    });
  }
}

exports.getUser = async (req, res) => {
  try{

      const {id} = req.params
      const data = await user.findOne({
          where:{
              id
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "role", "password"]
          }
      })
      res.send({
          status: 'success',
          data
      })
  }catch (error) {
          console.log(error)
          res.send({
              status: 'failed',
              message: 'Server Error'
          })
  }
}
