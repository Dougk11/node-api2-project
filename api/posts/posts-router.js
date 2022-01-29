// implement your posts router here
const express = require('express')

const router = express.Router()
const Post = require('./posts-model')

router.get('/', (req, res) => {
    Post.find()
        .then(post=> {
            res.status(200).json(post)
        })
        .catch(err => {
            res.status(504).json({message: err.message })
        })
})

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post=> {
            if(!post) {
                res.status(404).json({message: 'does not exist'})
            } else {
                res.status(200).json(post)
            }
        })
})

router.post('/', (req, res) => {
    Post.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err=> {
            res.status(400).json({message: 'an error occurred'})
        })
})

router.put('/:id', (req, res)=> {
    const updatedPost = req.body;
    updatedPost.id = Number(req.params.id)

    if (!req.body.title || !req.body.contents) {
        res.status(400).json({message: 'Please provide title and contents'})
    } else {
        Post.update(req.params.id, req.body)
        .then(post=> {
            if (post) {
            res.status(201).json(updatedPost)
        } else {
            res.status(404).json({message: 'post with specified id does not exist'})
        }})
        .catch(err=> {
            res.status(500).json({message: 'problem retrieving the information with specified id'})
        })
    }
    
})

router.delete('/:id', async (req, res) => {
    const deletedPost = await Post.findById(req.params.id)

    Post.remove(req.params.id)
        .then(count=> {
            if (count > 0 ) {
                res.status(200).json(deletedPost)
        
            } else {
                res.status(404).json({message: "The post with specified id does not exist"})
            }
        })
        .catch(err=> {
            res.status(500).json({message: 'The post could not be removed'})
        })
})


router.get('/:id/comments', async (req, res)=> {
    const comments = await Post.findPostComments(req.params.id)
    try {
    if (comments.length > 0 ) {
        res.status(200).json(comments)
    } else {
        res.status(404).json({message: 'the post with specified id does not exist'})
    }
    } catch (error) {
        res.status(500).json({message: "The comments could not be retrieved"})
    }
})
module.exports = router;