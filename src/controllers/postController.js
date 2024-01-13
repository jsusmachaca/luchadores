import { validateToken } from "../config/config.js";
import { post } from "../models/postModel.js";
import { postValidation } from "../schemas/postSchema.js";



export class postController {
    static async getAllPosts(req, res) {
        try {
            const posts = await post.getAll()
            if (posts.error) throw new Error('error to show posts')
            return res.json(posts)
        } catch(error){
            return res.status(401).json({error: error.message})
        }
    }

    static async getUserPosts(req, res) {
        const authorization = req.headers.authorization
        let token = null
        try {
            if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')
            token = authorization.substring(7)
            const decodeToken = validateToken(token)
            if (decodeToken === null) throw new Error('invalid token')
            const posts = await post.findByUser(decodeToken.user_id)
            return res.json(posts)
        } catch(error) {
            return res.status(401).json({error: error.message})
        }
    }

    static async getPost(req, res) {
        try {
            const { id } = req.query

            if (id === undefined) throw new Error('must provide id')

            const posts = await post.findById(id)
            if(posts === null) throw new Error('post not found') 
            if(posts.error) throw new Error('error to get post')

            return res.json(posts)
        
        } catch(error) {
            return res.status(401).json({error: error.message})
        }
    }

    static async createPost(req, res) {
        const authorization = req.headers.authorization
        let token = null
        try {
            if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')
            token = authorization.substring(7)
            const decodeToken = validateToken(token)
            if (decodeToken === null) throw new Error('invalid token')

            const results = postValidation(req.body)

            if(results.error) return res.status(400).json({error: results.error.issues[0].message})

            const posts = await post.createPost({user_id: decodeToken.user_id, post: results.data})
            if(posts.error) throw new Error('error to publish post')
            return res.json(posts)
        
        } catch(error) {
            return res.status(401).json({error: error.message})
        }
    }

    static async deletePost(req, res) {
        const authorization = req.headers.authorization
        let token = null
        try {
            if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')
            token = authorization.substring(7)

            const decodeToken = validateToken(token)
            if (decodeToken === null) throw new Error('invalid token')

            const { id } = req.qury

            if (id === undefined) throw new Error('must provide id')

            const posts = await post.deletePost({id: id, user_id: decodeToken.user_id})
            if(posts.error) throw new Error('error to delete post')

            return res.json(posts)
        
        } catch(error) {
            return res.status(401).json({error: error.message})
        }
    }
}