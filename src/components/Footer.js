import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white p-4 mt-8 shadow-inner">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} 你的名字. 保留所有权利.</p>
        <p className="text-sm text-gray-400 mt-1">
          使用 React 和 Node.js 构建
        </p>
      </div>
    </footer>
  );
};

export default Footer;