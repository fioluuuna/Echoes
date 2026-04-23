import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError('请填写用户名、邮箱和密码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password,
        nickname: nickname || username,
      });

      if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        navigate('/');
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        '注册失败，请稍后重试';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🌊 Echoes</h1>
          <p className="text-gray-400">开启你的心灵回响之旅</p>
        </div>

        <div className="bg-[#16213e] rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white text-center">注册</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-300 text-sm mb-1">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0f3460] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0f3460] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="请输入邮箱"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">昵称（选填）</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-[#0f3460] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="给自己起个名字吧"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0f3460] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="请输入密码"
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? '注册中...' : '注册'}
          </button>

          <p className="text-gray-400 text-sm text-center">
            已有账号？{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300">
              去登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}