import Layout from '../../../components/Layout';
import Private from '../../../components/auth/Private';
import BlogCreateComponent from '../../../components/crud/BlogCreateComponent';
import Link from 'next/link';

const CreateBlog = () =>
{
    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Create a new blog</h2>
                        </div>
                        <div className="col-md-12">
                            <BlogCreateComponent />
                        </div>
                    </div>
                </div>
            </Private>
        </Layout>
    );
};

export default CreateBlog;
