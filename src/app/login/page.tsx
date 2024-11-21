import { signIn } from '@/auth';
import { PrimaryButton } from '@/components/button';

const LoginPage = () => {
    return (
        <form
            action={async () => {
                'use server';
                await signIn('google');
            }}
        >
            <PrimaryButton type="submit">
                Login with Google
            </PrimaryButton>
        </form>
    );
};

export default LoginPage;
