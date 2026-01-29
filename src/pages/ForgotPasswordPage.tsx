import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageLayout } from '@/components/layout/PageLayout';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                throw error;
            }

            setIsSubmitted(true);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageLayout>
            <div className="flex min-h-screen items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <Button
                        variant="ghost"
                        className="mb-6 -ml-2 text-purple-200 hover:bg-white/10"
                        onClick={() => navigate('/login')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                    </Button>

                    <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-8 shadow-2xl">
                        {/* Decorative elements */}
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
                        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

                        <div className="relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="mb-8"
                            >
                                <h1 className="text-3xl font-bold tracking-tight text-white">Reset Password</h1>
                                <p className="mt-2 text-purple-200/80">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </motion.div>

                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="rounded-xl bg-green-500/10 border border-green-500/20 p-6 text-center"
                                >
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 mb-4">
                                        <CheckCircle className="h-6 w-6 text-green-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-2">Check your email</h3>
                                    <p className="text-purple-200/80 text-sm">
                                        We've sent a password reset link to <span className="font-semibold text-white">{email}</span>.
                                    </p>
                                    <Button
                                        onClick={() => navigate('/login')}
                                        className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white"
                                    >
                                        Return to Login
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-purple-200/90">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-purple-200/50" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-purple-200/50 focus:border-blue-400/50 focus-visible:ring-blue-500/50"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center">
                                                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Sending Link...
                                            </span>
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </PageLayout>
    );
}
