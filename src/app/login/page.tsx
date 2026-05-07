import { signIn } from '@/auth';
import { PrimaryButton } from '@/components/button';

const LoginPage = () => {
    return (
        <form
            action={async () => {
                'use server';
                await signIn('github');
            }}
        >
            <PrimaryButton type="submit">
                Login with GitHub
            </PrimaryButton>
        </form>
    );
};

export default LoginPage;
