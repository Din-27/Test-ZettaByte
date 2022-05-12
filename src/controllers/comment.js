const { article, user, comment } = require('../../models')

exports. addComment = async (req, res) => {
    try {
        let data = await comment.create({
            description : req.body.description,
            include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', "email"]
                    },
                    model: article,
                    as: 'article',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', "image"]
                    }
                },
            ],
            attributes: {
              exclude: ["createdAt", "updatedAt", "image", "idUser"]
            }
          })
          res.send({
            status: "success",
            data
        })
    } catch (e) {
        console.log(e)
            res.send({
                status: 'failed',
                message: 'Server Error'
            })
    }
}

exports.updateComment = async (req, res) => {
    try {
        let { id } = req.params
        await comment.update({
            description : req.body.description
        },
        {
            where : {
                id
            }
        })
        let data = await comment.findAll({
            where: {
                id
            },
            include:{
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', "email"]
                },
                model: article,
                as: 'article',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', "image"]
                }
            },
            attributes: {
              exclude: ["createdAt", "updatedAt", "image", "idUser"]
            }
          })
          res.send({
            status: "success",
            data
          });
    } catch (e) {
        console.log(e)
        res.status(500).send({
            status: 'failed',
            message: 'thats wrong'
        })
    }
}

exports.deleteComment = async (req, res) => {
    try{
  
        const {id} = req.params
        await comment.destroy({
            where:{
                id
            },
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        })
        res.send({
            status: 'delete success',
            data: {
              id:id
            }
        })
    }catch (error) {
            console.log(error)
            res.send({
                status: 'failed',
                message: 'Server Error'
            })
    }
}

exports.getComments = async (req, res) =>{
    try {
        let data
        data = await comment.findAll({
            include: [
                {
                    user,
                    model: article,
                    as: 'article',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', "image"]
                    }
                },
            ],
            attributes:{
                exclude: ["updatedAt", "createdAt"]
            },
        })
        res.send({
            status: 'Get comments success',
            data
        })
    } catch (e) {
        console.log(e)
        res.status(500).send({
            status: 'failed',
            message: 'thats wrong'
        })
    }
}

exports.getComment = async (req, res) =>{
    try {
        const { id } = req.params
        let data = await comment.findOne({
            where: {
                id
            },
            include:{
                model: article,
                as: 'article',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', "image"]
                }
            },
            attributes:{
                exclude: ['updatedAt, createdAt']
            }
        })
        res.send({
            status: 'Get comment success',
            data
        })
    } catch (e) {
        console.log(e)
        res.status(500).send({
            status: 'failed',
            message: 'thats wrong'
        })
    }
}