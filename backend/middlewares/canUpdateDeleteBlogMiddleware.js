const Blog = require('../models/blogModel'); // Import the Blog model to interact with blog-related data in the database
const responseHandler = require('../utils/responseHandler');


exports.canUpdateDeleteBlog = async (req, res, next) =>
{
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOne({ slug }).exec();
    if (!blog) return responseHandler(res, null, 'Blog not found.', 404);

    let authorizedUser = blog.postedBy._id.toString() === req.profile._id.toString();
    if (!authorizedUser) return responseHandler(res, null, 'You are not authorized.', 401);

    next();
};
