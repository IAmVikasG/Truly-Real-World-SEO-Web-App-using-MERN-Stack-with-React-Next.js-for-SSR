import Layout from '../../components/Layout';
import Private from '../../components/auth/Private';
import ProfileUpdateComponent from '../../components/auth/ProfileUpdateComponent';
import Link from 'next/link';

const UserProfileUpdate = () =>
{
    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <ProfileUpdateComponent />
                    </div>
                </div>
            </Private>
        </Layout>
    );
};

export default UserProfileUpdate;
