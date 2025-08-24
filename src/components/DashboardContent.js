"use client";

import { useAuth } from '../context/AuthContext';
import { FaInstagram, FaFacebook, FaEnvelope, FaWhatsapp, FaTiktok, FaLinkedin, FaSnapchatGhost } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { BsShop } from "react-icons/bs";
import { MdOutlineAdd } from "react-icons/md";

const socialColorsMap = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  email: '#EA4335',
  whatsapp: '#25D366',
  tiktok: '#000000',
  linkedin: '#0A66C2',
  snapchat: '#FFFC00',
};

export default function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r px-6 py-6 flex flex-col">
        <div className="mb-8">
          <span className="text-lg font-semibold">{user?.email?.split('@')[0] || 'User'}</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <a className="flex items-center px-3 py-2 rounded-lg bg-purple-100 text-purple-700 font-medium" href="#">
                <span className="mr-2">My Linktree</span>
              </a>
            </li>
            <li>
              <a className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                <span className="mr-2">Links</span>
              </a>
            </li>
            <li>
              <a className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                <BsShop className="mr-2" /> Shop
              </a>
            </li>
            <li>
              <a className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                <span className="mr-2">Design</span>
              </a>
            </li>
            <li>
              <a className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                <span className="mr-2">Audience</span>
              </a>
            </li>
            <li>
              <a className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                <span className="mr-2">Insights</span>
              </a>
            </li>
          </ul>
        </nav>
        {/* Tools */}
        <div className="mt-8">
          <div className="bg-green-50 rounded-lg p-3 mb-4">
            <span className="text-xs text-green-700 font-medium">New growth tools</span>
            <a href="#" className="block text-xs text-purple-700 font-semibold mt-1">Get started →</a>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-purple-700 mb-1">Your setup checklist</div>
              <div className="text-xs text-gray-700">5 of 6 complete</div>
            </div>
            <button className="ml-2 px-3 py-1 bg-purple-600 text-white text-xs rounded-full font-semibold">Finish setup</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start py-10 px-4 bg-gray-50">
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8">
          {/* Profile & Links */}
          <div className="flex-1 bg-white rounded-2xl shadow p-8 flex flex-col items-center">
            {/* Profile */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center mb-3">
                <span className="text-4xl font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-900">@{user?.email?.split('@')[0] || 'user'}</span>
              <span className="text-gray-500 text-sm">Add bio</span>
              {/* Socials */}
              <div className="flex items-center gap-3 mt-3">
                <FaInstagram 
                  className="hover:scale-110 cursor-pointer transition-transform" 
                  size={20} 
                  style={{ color: socialColorsMap.instagram }}
                />
                <FaFacebook 
                  className="hover:scale-110 cursor-pointer transition-transform" 
                  size={20} 
                  style={{ color: socialColorsMap.facebook }}
                />
                <FaEnvelope 
                  className="hover:scale-110 cursor-pointer transition-transform" 
                  size={20} 
                  style={{ color: socialColorsMap.email }}
                />
                <FaWhatsapp 
                  className="hover:scale-110 cursor-pointer transition-transform" 
                  size={20} 
                  style={{ color: socialColorsMap.whatsapp }}
                />
                <FaTiktok 
                  className="hover:scale-110 cursor-pointer transition-transform" 
                  size={20} 
                  style={{ color: socialColorsMap.tiktok }}
                />
                <button className="flex items-center text-gray-600 hover:text-gray-900 px-2">
                  <FiMoreHorizontal size={20} />
                  <span className="ml-1 text-xs">3 more</span>
                </button>
              </div>
            </div>
            {/* Add Button */}
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl text-lg flex items-center justify-center mb-4">
              <MdOutlineAdd className="mr-2" size={22} /> Add
            </button>
            {/* Add Collection */}
            <button className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-xl mb-2">
              Add collection
            </button>
            {/* View Archive */}
            <button className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-xl mb-6">
              View archive
            </button>
            {/* Shop Card */}
            <div className="w-full bg-gray-100 rounded-xl flex items-center justify-between p-4 mb-2">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mr-4 border">
                  {/* Product Image Placeholder */}
                  <img src="https://via.placeholder.com/48x48.png?text=Product" alt="Product" className="rounded" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">See Full Shop</div>
                  <div className="text-xs text-gray-500">1 Product</div>
                </div>
              </div>
              <div>
                <input type="checkbox" checked className="accent-purple-600 w-5 h-5" readOnly />
              </div>
            </div>
            {/* Shop Link */}
            <div className="w-full flex justify-end">
              <a href="#" className="text-xs text-gray-600 underline">See Full Shop</a>
            </div>
          </div>

          {/* Mobile Preview */}
          <div className="w-full md:w-80 flex flex-col items-center">
            <div className="bg-black rounded-3xl shadow-lg p-4 w-full max-w-xs relative">
              {/* Top bar */}
              <div className="flex justify-between items-center mb-2">
                <span className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs">✱</span>
                <button className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/></svg>
                </button>
              </div>
              {/* Profile */}
              <div className="flex flex-col items-center mt-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-white">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-white text-sm font-semibold mb-1">@{user?.email?.split('@')[0] || 'user'}</span>
                {/* Tabs */}
                <div className="flex gap-2 mb-3">
                  <button className="bg-white text-black px-4 py-1 rounded-full font-semibold text-xs">Links</button>
                  <button className="bg-gray-800 text-white px-4 py-1 rounded-full font-semibold text-xs">Shop</button>
                </div>
                {/* Product Card */}
                <div className="bg-white rounded-xl w-full flex flex-col items-center p-3 mb-3">
                  <img src="https://via.placeholder.com/80x80.png?text=Product" alt="Product" className="rounded mb-2" />
                  <div className="font-semibold text-gray-900 text-sm">See Full Shop</div>
                  <div className="text-xs text-gray-500">1 Product</div>
                </div>
                {/* Socials */}
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <FaInstagram 
                    className="hover:scale-110 cursor-pointer transition-transform" 
                    size={18} 
                    style={{ color: socialColorsMap.instagram }}
                  />
                  <FaFacebook 
                    className="hover:scale-110 cursor-pointer transition-transform" 
                    size={18} 
                    style={{ color: socialColorsMap.facebook }}
                  />
                  <FaTiktok 
                    className="hover:scale-110 cursor-pointer transition-transform" 
                    size={18} 
                    style={{ color: socialColorsMap.tiktok }}
                  />
                  <FaWhatsapp 
                    className="hover:scale-110 cursor-pointer transition-transform" 
                    size={18} 
                    style={{ color: socialColorsMap.whatsapp }}
                  />
                  <FaLinkedin 
                    className="hover:scale-110 cursor-pointer transition-transform" 
                    size={18} 
                    style={{ color: socialColorsMap.linkedin }}
                  />
                  <FaEnvelope 
                    className="hover:scale-110 cursor-pointer transition-transform" 
                    size={18} 
                    style={{ color: socialColorsMap.email }}
                  />
                  <FaSnapchatGhost 
                    className="hover:scale-110 cursor-pointer transition-transform" 
                    size={18} 
                    style={{ color: socialColorsMap.snapchat }}
                  />
                </div>
              </div>
              {/* Hide logo */}
              <div className="mt-4 flex justify-center">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  Hide Linktree logo <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 17v.01M12 7v6m0 8a10 10 0 100-20 10 10 0 000 20z" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="ml-1">🔒</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
