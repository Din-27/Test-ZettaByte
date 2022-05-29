const { article, user } = require('../../models')

exports. addArticle = async (req, res) => {
    try {
        let data = await article.create({
            title : req.body.title,
            body : req.body.body,
            published: false,
            idUser : req.user.id,
            include:{
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', "user"]
                }
            },
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

exports.updateArticle = async (req, res) => {
    try {
        let { id } = req.params
        await article.update({
            title : req.body.title,
            body : req.body.body,
        },
        {
            where : {
                id
            }
        })
        let data = await article.findAll({
            where: {
                id
            },
            include:{
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', "email"]
                },
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

exports.deleteArticle = async (req, res) => {
    try{
  
        const {id} = req.params
        await article.destroy({
            where:{
                id
            },
          attributes: {
            exclude: ["createdAt", "updatedAt", "image"]
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

exports.getArticles = async (req, res) =>{
    try {
        const pageAsNumber = Number.parseInt(req.query.page)
        const sizeAsNumber = Number.parseInt(req.query.size)

        let page = 0;
        if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0){
            page = pageAsNumber
        }

        let size = 2;
        if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10){
            size = sizeAsNumber
        }

        let data = await article.findAndCountAll({
            limit : size,
            offset : page * size,
            attributes:{
                exclude: ['updatedAt, createdAt', "image"]
            },
            include:{
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', "email"]
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        res.send({
            status: 'Get articles success',
            content : data.rows,
            totalPage: data.count
        })
    } catch (e) {
        console.log(e)
        res.status(500).send({
            status: 'failed',
            message: 'thats wrong'
        })
    }
}

exports.getArticle = async (req, res) =>{
    try {
        const { id } = req.params
        let data = await article.findOne({
            where: {
                id
            },
            include:{
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', "email"]
                }
            },
            attributes:{
                exclude: ['updatedAt, createdAt', "image"]
            }
        })
        res.send({
            status: 'Get article success',
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