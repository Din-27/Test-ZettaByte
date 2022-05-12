const { article, user } = require('../../models')

const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: tutorial } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, tutorial, totalPages, currentPage };
};

exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    article.findAndCountAll({ where: condition, limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  };

  exports.findAllPublished = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    article.findAndCountAll({ where: { published: true }, limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  };

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
        let data = await article.findAll({
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