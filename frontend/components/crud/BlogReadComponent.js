import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { list, removeBlog } from '../../actions/blog';
import moment from 'moment';

const BlogReadComponent = ({username}) =>
{
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState('');
    const token = getCookie('token');

    useEffect(() =>
    {
        loadBlogs();
    }, []);

    const loadBlogs = () =>
    {
        list(username).then(result =>
        {
            const { data, message, success } = result;
            if (!success)
            {
                console.log(message);
            } else
            {
                setBlogs(data);
            }
        });
    };

    const deleteBlog = slug =>
    {
        removeBlog(slug, token).then(result =>
        {
            const { data, message, success } = result;
            if (!success)
            {
                console.log(message);
            } else
            {
                setMessage(message);
                loadBlogs();
            }
        });
    };

    const deleteConfirm = slug =>
    {
        let answer = window.confirm('Are you sure you want to delete your blog?');
        if (answer)
        {
            deleteBlog(slug);
        }
    };

    const showAllBlogs = () =>
    {
        return blogs.map((blog, i) =>
        {
            return (
                <div key={i} className="pb-5">
                    <h3>{blog.title}</h3>
                    <p className="mark">
                        Written by {blog.postedBy.name} | Published on {moment(blog.updatedAt).fromNow()}
                    </p>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteConfirm(blog.slug)}>
                        Delete
                    </button>
                    {showUpdateButton(blog)}
                </div>
            );
        });
    };

    const showUpdateButton = blog =>
    {
        if (isAuth() && isAuth().role === 0)
        {
            return (
                <Link href={`/user/crud/${blog.slug}`} className="btn ml-2 btn-sm btn-warning">
                    Update
                </Link>
            );
        } else if (isAuth() && isAuth().role === 1)
        {
            return (
                <Link href={`/admin/crud/${blog.slug}`} className="ml-2 btn btn-sm btn-warning">
                    Update
                </Link>
            );
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    {message && <div className="alert alert-warning">{message}</div>}
                    {showAllBlogs()}
                </div>
            </div>
        </>
    );
};

export default BlogReadComponent;
