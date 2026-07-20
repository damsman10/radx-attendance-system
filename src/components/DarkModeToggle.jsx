import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  return (
    <div
      onClick={toggleDarkMode}
      className={`w-11 h-6 flex items-center px-0.5 rounded-full cursor-pointer transition-colors duration-300 
        ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center
          ${isDark ? 'translate-x-5' : 'translate-x-0'}`}
      >
        {isDark ? <Moon size={12} /> : <Sun size={12} />}
      </div>
    </div>
  );
};

export default DarkModeToggle;
