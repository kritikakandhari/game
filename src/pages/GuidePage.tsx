import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GuidePage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">How to Play & Earn</h1>
                <p className="text-purple-200/60">Complete guide to FGC Money Match</p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">1. Create an Account</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-300">
                        Sign up and verify your email. Connect your game accounts in your profile to get started.
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">2. Find or Create a Match</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-300">
                        Go to the "Find a Match" page to see open challenges. You can also create your own match with custom stakes and rules.
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">3. Compete & Win</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-300">
                        Play the match according to the rules. Report the score accurately. Winners automatically receive the prize pot.
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
