import Link from 'next/link';
import Parser from 'html-react-parser';
import moment from 'moment';
import { API } from '../../config';

const SmallCard = ({ blog }) =>
{
    return (
        <div className="card">
            <section>
                <Link href={`/blogs/${blog.slug}`}>
                    <img
                        className="img img-fluid"
                        style={{ height: '250px', width: '100%' }}
                        src={`${API}/blog/photo/${blog.slug}`}
                        alt={blog.title}
                    />
                </Link>
            </section>

            <div className="card-body">
                <section>
                    <Link href={`/blogs/${blog.slug}`}>
                        <h5 className="card-title">{blog.title}</h5>
                    </Link>
                    <p className="card-text">{blog.excerpt ? Parser(blog.excerpt): ''}</p>
                </section>
            </div>

            <div className="card-body">
                Posted {moment(blog.updatedAt).fromNow()} by{' '}
                <Link href={`/profile/${blog.postedBy.username}`}>
                    {blog.postedBy.username}
                </Link>
            </div>
        </div>
    );
};

export default SmallCard;
