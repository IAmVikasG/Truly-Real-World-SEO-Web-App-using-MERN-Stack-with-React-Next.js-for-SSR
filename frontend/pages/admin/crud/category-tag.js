import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import Link from 'next/link';
import CategoryComponent from '../../../components/crud/CategoryComponent';
import TagComponent from '../../../components/crud/TagComponent';

const CategoryTag = () =>
{
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Manage Categories and Tags</h2>
                        </div>
                        <div className="col-md-6">
                            <CategoryComponent />
                        </div>
                        <div className="col-md-6">
                            <TagComponent />
                        </div>
                    </div>
                </div>
            </Admin>
        </Layout>
    );
};

export default CategoryTag;
