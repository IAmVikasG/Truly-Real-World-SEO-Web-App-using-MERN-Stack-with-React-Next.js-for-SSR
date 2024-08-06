import Layout from '../components/Layout';
import Link from 'next/link';

const Signup = () =>
{
    return (
        <Layout>
            <h2>Signup page</h2>
            <Link href="/" legacyBehavior>
                Home
            </Link>
        </Layout>
    );
};

export default Signup;
