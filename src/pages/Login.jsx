import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Heart, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    setEmail('doctor@sssh.com');
    setPassword('demo1234');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[52%] bg-primary-900 flex-col relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-teal-700/30 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="https://eecpsssh.com/assets/images/logo-2.png"
              alt="Shree Swami Samarth Hospital Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden flex-shrink-0 w-10 h-10 bg-white/15 rounded-xl items-center justify-center border border-white/20">
              <span className="text-white text-xs font-bold">SSSH</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Shree Swami Samarth Hospital</p>
              <p className="text-white/60 text-xs">Nagpur, Maharashtra</p>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-medium mb-6">
                <Heart size={12} className="text-red-400" />
                <span>Vidarbha's Largest EECP Centre</span>
              </div>
              <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                Prescription<br />
                Management<br />
                <span className="text-teal-400">System</span>
              </h1>
              <p className="text-white/70 text-base leading-relaxed max-w-sm">
                Securely manage patient records, prescriptions, and clinical workflows in one unified platform.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              {[
                'Digital prescription creation & management',
                'Complete patient history & medical records',
                'Prescription templates & medicine library',
                'PDF generation & secure record keeping',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-teal-500/20 border border-teal-400/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  </div>
                  <p className="text-white/70 text-sm">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Lock size={12} />
            <span>Secure Medical Records System · TEDflex Engineering</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-16 py-10">
        <div className="max-w-sm w-full mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img
              src="https://eecpsssh.com/assets/images/logo.png"
              alt="Shree Swami Samarth Hospital"
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="text-slate-900 font-bold text-sm">Shree Swami Samarth Hospital</p>
              <p className="text-slate-500 text-xs">Prescription Management</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm">Sign in to access your dashboard</p>
          </div>

          {/* Demo credentials hint */}
          <div
            className="mb-6 p-3.5 bg-primary-50 border border-primary-200 rounded-xl cursor-pointer hover:bg-primary-100 transition-colors"
            onClick={handleDemoLogin}
          >
            <div className="flex items-center gap-2 mb-1">
              <Shield size={13} className="text-primary-700" />
              <span className="text-xs font-semibold text-primary-900">Demo Login</span>
              <span className="text-xs text-primary-600">(Click to auto-fill)</span>
            </div>
            <p className="text-xs text-primary-700">Email: <strong>doctor@sssh.com</strong> · Password: <strong>demo1234</strong></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label">Email / Mobile Number</label>
              <input
                id="login-email"
                type="text"
                className="form-input"
                placeholder="Enter email or mobile number"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-primary-900 rounded"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary-900 font-medium hover:underline">
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base font-semibold"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-slate-400 text-xs">
            <Lock size={12} />
            <span>🔒 Secure Medical Records · All data is encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
