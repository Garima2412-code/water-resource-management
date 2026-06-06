import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWater } from '../context/WaterContext';
import { Droplet, ShieldAlert, Key, Mail, ShieldCheck, Hammer, User as UserIcon } from 'lucide-react';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole } = useWater();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    if (isLogin) {

      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError("Invalid Email or Password");
        return;
      }

      setUserRole(data.user.role);

      if (data.user.role === "citizen") {
        navigate("/complaints");
      } else {
        navigate("/dashboard");
      }

    }
    else {

      const response = await fetch(
        "http://localhost:5000/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role
          })
        }
      );

      const data = await response.json();

      if (data.success) {

        setIsLogin(true);

        alert(
          "Account created successfully. Please login."
        );

      }

    }
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');

    // Set role in context
    setUserRole(role);

    // Redirect based on role
    if (role === 'citizen') {
      navigate('/complaints');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-civic-bg px-4 py-12">
      <div className="w-full max-w-md bg-white border border-civic-border rounded-xl p-8 shadow-civic">
        {/* Header Brand */}
        <div className="text-center mb-8">
          <Link to="/landing" className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-md bg-brand-600 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">
              Hydro<span className="text-brand-600">Civic</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            {isLogin ? 'Sign in to Portal' : 'Register Portal Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access secure water board monitoring and reporting services.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md text-xs text-red-700 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Active Role Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Your Portal Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`py-2 px-3 border rounded-lg text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${role === 'citizen'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 hover:border-slate-300 text-slate-500'
                  }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('officer')}
                className={`py-2 px-3 border rounded-lg text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${role === 'officer'
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-slate-200 hover:border-slate-300 text-slate-500'
                  }`}
              >
                <Hammer className="w-4 h-4" />
                <span>Officer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 border rounded-lg text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${role === 'admin'
                  ? 'border-teal-600 bg-teal-50 text-teal-800'
                  : 'border-slate-200 hover:border-slate-300 text-slate-500'
                  }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-brand-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@agency.gov"
                className="w-full text-sm pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md text-sm transition-colors mt-2"
          >
            {isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
