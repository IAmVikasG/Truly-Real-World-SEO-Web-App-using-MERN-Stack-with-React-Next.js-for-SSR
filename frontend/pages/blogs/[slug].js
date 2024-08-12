import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useEffect, useState } from 'react';
import { singleBlog, listRelated } from '../../actions/blog';
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
import Parser from 'html-react-parser';
import moment from 'moment';
import SmallCard from '../../components/blog/SmallCard';



const SingleBlog = ({ blog, query }) =>
{
    const [related, setRelated] = useState([]);

    const head = () => (
        <Head>
            <title>
                {blog.title} | {APP_NAME}
            </title>
            <meta name="description" content={blog.mdesc} />
            <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
            <meta property="og:title" content={`${blog.title}| ${APP_NAME}`} />
            <meta property="og:description" content={blog.mdesc} />
            <meta property="og:type" content="webiste" />
            <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
            <meta property="og:image:secure_url" ccontent={`${API}/blog/photo/${blog.slug}`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />
        </Head>
    );

    const loadRelated = () =>
    {
        listRelated({ blog }).then(result =>
        {
            const { success, data, message } = result;
            if (!success)
            {
                console.log(message);
            } else
            {
                setRelated(data);
            }
        });
    };

    useEffect(() =>
    {
        loadRelated();
    }, []);

    const showBlogCategories = blog =>
    {
        blog.categories.map((c, i) => (
            <Link key={i} href={`/categories/${c.slug}`} className="btn btn-primary mr-1 ml-1 mt-3">
                {c.name}
            </Link>
        ));
    }

    const showBlogTags = blog =>
    {
        blog.tags.map((t, i) => (
            <Link key={i} href={`/tags/${t.slug}`} className="btn btn-outline-primary mr-1 ml-1 mt-3">
                {t.name}
            </Link>
        ));
    }

    const showRelatedBlog = () =>
    {
        return related.map((blog, i) => (
            <div className="col-md-4" key={i}>
                <article>
                    <SmallCard blog={blog} />
                </article>
            </div>
        ));
    };

    return (
        <>
            {head()}
            <Layout>
                <main>
                    <article>
                        <div className="container-fluid">
                            <section>
                                <div className="row" style={{ marginTop: '-30px' }}>
                                    <img
                                        src={`${API}/blog/photo/${blog.slug}`}
                                        alt={blog.title}
                                        className="img img-fluid featured-image"
                                    />
                                </div>
                            </section>

                            <section>
                                <p className="lead mt-3 mark">
                                    Written by{' '}
                                    <Link href={`/profile/${blog.postedBy.username}`}>
                                        {blog.postedBy.username}
                                    </Link>{' '}
                                    | Published {moment(blog.updatedAt).fromNow()}
                                </p>

                                <div className="pb-3">
                                    {showBlogCategories(blog)}
                                    {showBlogTags(blog)}
                                    <br />
                                    <br />
                                </div>
                            </section>
                        </div>

                        <div className="container">
                            <section>
                                <div className="col-md-12 lead">{Parser(blog.body)}</div>
                            </section>
                        </div>

                        <div className="container">
                            <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
                            <div className="row">{showRelatedBlog()}</div>
                        </div>

                        <div className="container pb-5">
                            <p>show comments</p>
                        </div>
                    </article>
                </main>
            </Layout>
        </>
    );
};

SingleBlog.getInitialProps = ({ query }) =>
{

    return singleBlog(query.slug).then(result =>
    {
        const { success, data, message } = result;
        if (!success)
        {
            console.log(message);
        } else
        {
            // console.log('GET INITIAL PROPS IN SINGLE BLOG', data);
            return { blog: data, query };
        }
    });
};

export default SingleBlog;
