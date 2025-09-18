'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignupRootPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/signup/phone');
    }, [router]);

    return null;
}
