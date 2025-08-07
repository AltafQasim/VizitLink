import { supabase } from '../lib/supabase'
import { Button } from './ui/button';

export default function GoogleAuthButton() {
    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({ provider: 'google' });
    };

    return (
        <Button onClick={handleGoogleLogin} variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-3 transition-colors duration-200">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">G</div>
            <span className="text-gray-700 font-medium text-base">Sign up with Google</span>
        </Button>
    );
}