import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, User, Trophy, Activity, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuth } from '@/auth/AuthProvider';

// Reuse types from MatchesPage for consistency
type Match = {
    id: string;
    match_type: string;
    status: string;
    stake_cents: number;
    total_pot_cents: number;
    best_of: number;
    created_at: string;
    completed_at: string | null;
    winner_id: string | null;
    participants: Array<{
        user_id: string;
        username?: string;
    }>;
};

type MatchListResponse = {
    data: Match[];
};

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch recent matches
    const { data: matchesData, isLoading: matchesLoading } = useQuery<MatchListResponse>({
        queryKey: ['my-matches', 'recent'],
        queryFn: async () => {
            const response = await api.get('/matches/me', {
                params: { limit: 5 } // Fetch only 5 recent matches
            });
            return response.data;
        },
        enabled: !!user,
    });

    const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
            CREATED: 'secondary',
            ACCEPTED: 'default',
            IN_PROGRESS: 'default',
            COMPLETED: 'default',
            CANCELLED: 'outline',
            DISPUTED: 'outline',
        };
        return variants[status] || 'secondary';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                <p className="text-purple-200/60">Welcome back, {user?.email || 'Player'}!</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        variant="outline"
                        className="w-full h-32 flex flex-col gap-3 bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-white/10 hover:border-pink-500/50 hover:bg-purple-900/60 transition-all"
                        onClick={() => navigate('/app/guide')}
                    >
                        <BookOpen className="h-8 w-8 text-pink-400" />
                        <span className="text-lg font-semibold text-white">View Guide</span>
                        <span className="text-xs text-purple-200/60 font-normal">Learn how to play & earn</span>
                    </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        variant="outline"
                        className="w-full h-32 flex flex-col gap-3 bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-white/10 hover:border-pink-500/50 hover:bg-purple-900/60 transition-all"
                        onClick={() => navigate('/app/discover')}
                    >
                        <Search className="h-8 w-8 text-purple-400" />
                        <span className="text-lg font-semibold text-white">Find a Match</span>
                        <span className="text-xs text-purple-200/60 font-normal">Browse open challenges</span>
                    </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        variant="outline"
                        className="w-full h-32 flex flex-col gap-3 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-white/10 hover:border-pink-500/50 hover:bg-purple-900/60 transition-all"
                        onClick={() => navigate('/app/profile')}
                    >
                        <User className="h-8 w-8 text-blue-400" />
                        <span className="text-lg font-semibold text-white">View Profile</span>
                        <span className="text-xs text-purple-200/60 font-normal">Check stats & settings</span>
                    </Button>
                </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-200">Rating</CardTitle>
                        <Trophy className="h-4 w-4 text-amber-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">1500</div>
                        <p className="text-xs text-gray-400 mt-1">Top 15%</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-200">Win Rate</CardTitle>
                        <Activity className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">0%</div>
                        <p className="text-xs text-gray-400 mt-1">No matches played</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-200">Total Earnings</CardTitle>
                        <div className="h-4 w-4 text-teal-400 font-bold flex items-center justify-center">$</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">$0.00</div>
                        <p className="text-xs text-gray-400 mt-1">Lifetime</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Matches */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl text-white">Recent Match History</CardTitle>
                        <CardDescription className="text-gray-400">Your latest competitive matches</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/app/matches')} className="text-purple-300 hover:text-purple-200">
                        View All
                    </Button>
                </CardHeader>
                <CardContent>
                    {matchesLoading ? (
                        <div className="text-center py-8 text-gray-400">Loading history...</div>
                    ) : matchesData?.data && matchesData.data.length > 0 ? (
                        <div className="space-y-4">
                            {matchesData.data.map((match) => (
                                <div key={match.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${match.winner_id === user?.id ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'}`}>
                                            <Trophy className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{match.match_type.replace('_', ' ')}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <span>{formatCurrency(match.stake_cents)} Stake</span>
                                                <span>•</span>
                                                <span>{formatDate(match.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusBadge(match.status)}>
                                        {match.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/5 mb-4">
                                <Clock className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-white">No matches yet</h3>
                            <p className="text-gray-400 mt-1 mb-4">You haven't played any matches yet.</p>
                            <Button onClick={() => navigate('/app/discover')} className="bg-gradient-to-r from-pink-500 to-purple-600">
                                Find a Match
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
