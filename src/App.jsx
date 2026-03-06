import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  Monitor, 
  Smartphone, 
  Scissors, 
  Landmark, 
  Printer, 
  Fingerprint, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Mail, 
  CheckCircle,
  ArrowRight,
  Clock,
  Facebook,
  Instagram,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Cpu,
  PenTool,
  Globe,
  Keyboard,
  BarChart,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Save,
  Edit3,
  XCircle,
  Settings,
  FileText,
  Layout,
  Type,
  Users,
  Image as ImageIcon,
  Upload,
  CreditCard,
  Coffee,
  Wrench,
  Layers,
  Filter,
  Twitter,
  Youtube,
  Linkedin,
  Link as LinkIcon,
  Eye,
  EyeOff,
  List,
  Images,
  Send
} from 'lucide-react';

// --- FIREBASE INITIALIZATION ---
// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: "AIzaSyB4gaMHsMjOsFX1elmX-5kq7DWYOpJyeQc",
  authDomain: "tongdamcomputers.firebaseapp.com",
  projectId: "tongdamcomputers",
  storageBucket: "tongdamcomputers.firebasestorage.app",
  messagingSenderId: "779811048439",
  appId: "1:779811048439:web:cab28a7fbef5ce89b17cf2",
  measurementId: "G-SGXSSDXFW4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.projectId; 
// ------------------------------------

// Icon mapping for dynamic rendering
const ICON_MAP = {
  Monitor, BookOpen, Cpu, BarChart, PenTool, Globe, Keyboard, Smartphone, Scissors, Landmark, Fingerprint, Printer, FileText, CheckCircle, Clock, CreditCard, Users, Coffee, Wrench, Layers, Twitter, Youtube, Linkedin, Link: LinkIcon, Facebook, Instagram, Images
};

// --- SUB-COMPONENTS ---

const AdminLogin = ({ adminUser, setAdminUser, adminPass, setAdminPass, handleLogin, loginError, navigateTo, siteConfig }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 pt-20">
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-200">
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
           {siteConfig.logoType === 'image' && siteConfig.logoUrl ? (
             <img src={siteConfig.logoUrl} alt="Logo" className="w-full h-full object-cover" />
           ) : (
             <Lock className="text-blue-600" size={32} />
           )}
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Admin Login</h2>
        <p className="text-slate-500">{siteConfig.name} {siteConfig.suffix} CMS</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <input 
            type="text" 
            value={adminUser}
            onChange={(e) => setAdminUser(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Enter username"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Enter password"
          />
        </div>
        {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          Login to Dashboard
        </button>
        <button type="button" onClick={() => navigateTo('home')} className="w-full text-slate-500 text-sm hover:text-blue-600">
          Return to Website
        </button>
      </form>
    </div>
  </div>
);

const AdminDashboard = ({ 
  courses, setCourses, 
  pages, setPages,
  instituteInfo, setInstituteInfo,
  siteConfig, setSiteConfig,
  users, setUsers,
  socials, setSocials,
  menuConfig, setMenuConfig,
  sliderImages, setSliderImages,
  galleryImages, setGalleryImages,
  currentUser,
  handleLogout 
}) => {
  const [activeTab, setActiveTab] = useState('settings');
  
  const [editingPageId, setEditingPageId] = useState(null);
  const [pageForm, setPageForm] = useState({ id: '', title: '', description: '', icon: 'FileText' });

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseCategoryFilter, setCourseCategoryFilter] = useState('all');
  const [courseForm, setCourseForm] = useState({ name: '', desc: '', icon: 'Monitor', category: 'computer' });

  const [newUserForm, setNewUserForm] = useState({ username: '', password: '' });
  const [passwordForm, setPasswordForm] = useState({ userId: '', newPassword: '' });

  const [newLink, setNewLink] = useState({ label: '', url: '' });
  const [newSocial, setNewSocial] = useState({ platform: '', url: '', icon: 'Facebook' });

  const [newSliderUrl, setNewSliderUrl] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const handleSavePage = () => {
    if (pageForm.title && pageForm.description) {
      if (editingPageId) {
        setPages(pages.map(p => p.id === editingPageId ? { ...p, ...pageForm, id: editingPageId } : p));
        setEditingPageId(null);
      } else {
        const newId = pageForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();
        setPages([...pages, { ...pageForm, id: newId }]);
      }
      setPageForm({ id: '', title: '', description: '', icon: 'FileText' });
    }
  };

  const handleEditPage = (page) => {
    setEditingPageId(page.id);
    setPageForm({ ...page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePage = (id) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      setPages(pages.filter(p => p.id !== id));
      if (editingPageId === id) {
        setEditingPageId(null);
        setPageForm({ id: '', title: '', description: '', icon: 'FileText' });
      }
    }
  };

  const handleSaveCourse = () => {
    if (courseForm.name && courseForm.desc) {
      if (editingCourseId) {
        setCourses(courses.map(c => c.id === editingCourseId ? { ...c, ...courseForm } : c));
        setEditingCourseId(null);
      } else {
        setCourses([...courses, { id: Date.now(), ...courseForm }]);
      }
      setCourseForm({ name: '', desc: '', icon: 'Monitor', category: courseForm.category });
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourseId(course.id);
    setCourseForm({ name: course.name, desc: course.desc, icon: course.icon, category: course.category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) { alert("Image size exceeds 800KB. Please compress it or use an image URL."); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteConfig({ ...siteConfig, logoUrl: reader.result, logoType: 'image' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) { alert("Favicon size exceeds 800KB. Please compress it."); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteConfig({ ...siteConfig, faviconUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = () => {
    if (newUserForm.username && newUserForm.password) {
        if (users.some(u => u.username === newUserForm.username)) {
            alert("Username already exists!");
            return;
        }
        setUsers([...users, { id: Date.now(), ...newUserForm }]);
        setNewUserForm({ username: '', password: '' });
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
        const userToDelete = users.find(u => u.id === id);
        if (userToDelete.username === 'admin') {
            alert("Cannot delete the main admin user.");
            return;
        }
        setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleChangePassword = () => {
      if (passwordForm.userId && passwordForm.newPassword) {
          setUsers(users.map(u => u.id === parseInt(passwordForm.userId) ? { ...u, password: passwordForm.newPassword } : u));
          setPasswordForm({ userId: '', newPassword: '' });
          alert("Password updated successfully!");
      }
  };

  const handleToggleMenu = (id) => {
    setMenuConfig(menuConfig.map(item => item.id === id ? { ...item, visible: !item.visible } : item));
  };

  const handleUpdateMenuLabel = (id, newLabel) => {
    setMenuConfig(menuConfig.map(item => item.id === id ? { ...item, label: newLabel } : item));
  };

  const handleAddCustomLink = () => {
    if (newLink.label && newLink.url) {
      setMenuConfig([...menuConfig, { 
        id: Date.now(), 
        label: newLink.label, 
        type: 'custom', 
        url: newLink.url, 
        visible: true 
      }]);
      setNewLink({ label: '', url: '' });
    }
  };

  const handleDeleteMenu = (id) => {
    if (window.confirm("Delete this menu item?")) {
      setMenuConfig(menuConfig.filter(m => m.id !== id));
    }
  };

  const handleAddSocial = () => {
    if (newSocial.platform && newSocial.url) {
      setSocials([...socials, { id: Date.now(), ...newSocial }]);
      setNewSocial({ platform: '', url: '', icon: 'Facebook' });
    }
  };

  const handleDeleteSocial = (id) => {
    setSocials(socials.filter(s => s.id !== id));
  };

  const handleUpdateSocialUrl = (id, newUrl) => {
    setSocials(socials.map(s => s.id === id ? { ...s, url: newUrl } : s));
  };

  const handleAddSliderUrl = () => {
    if (newSliderUrl) {
      setSliderImages([...sliderImages, { id: Date.now(), url: newSliderUrl }]);
      setNewSliderUrl('');
    }
  };

  const handleSliderUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) { alert("Image size exceeds 800KB. Please compress it or use an image URL."); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSliderImages([...sliderImages, { id: Date.now(), url: reader.result }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSliderImage = (id) => {
    setSliderImages(sliderImages.filter(img => img.id !== id));
  };

  const handleAddGalleryUrl = () => {
    if (newGalleryUrl) {
      setGalleryImages([...galleryImages, { id: Date.now(), url: newGalleryUrl }]);
      setNewGalleryUrl('');
    }
  };

  const handleGalleryUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) { alert("Image size exceeds 800KB. Please compress it or use an image URL."); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryImages([...galleryImages, { id: Date.now(), url: reader.result }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveGalleryImage = (id) => {
    setGalleryImages(galleryImages.filter(img => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500">Welcome, {currentUser} | Manage {siteConfig.name}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-700 font-semibold bg-white px-4 py-2 rounded-lg shadow">
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'slider', label: 'Home Slider', icon: ImageIcon },
              { id: 'gallery', label: 'Gallery', icon: Images },
              { id: 'menus', label: 'Menus & Socials', icon: List },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'pages', label: 'Pages', icon: Layout },
              { id: 'institutes', label: 'Institute Info', icon: Type },
              { id: 'courses', label: 'Computer Courses', icon: BookOpen },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[150px] py-4 text-center font-semibold flex items-center justify-center transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={18} className="mr-2" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            
            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><Settings className="mr-2" size={20}/> Website Identity</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Company Name (Part 1)</label>
                      <input 
                        value={siteConfig.name}
                        onChange={(e) => setSiteConfig({...siteConfig, name: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Suffix (Part 2)</label>
                      <input 
                        value={siteConfig.suffix}
                        onChange={(e) => setSiteConfig({...siteConfig, suffix: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                   <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><ImageIcon className="mr-2" size={20}/> Logo Configuration</h3>
                   
                   <div className="mb-4">
                     <label className="block text-sm font-bold text-slate-700 mb-2">Logo Type</label>
                     <div className="flex space-x-4">
                       <button 
                        onClick={() => setSiteConfig({...siteConfig, logoType: 'icon'})}
                        className={`px-4 py-2 rounded-lg border ${siteConfig.logoType === 'icon' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'}`}
                       >
                         Use Icon Library
                       </button>
                       <button 
                        onClick={() => setSiteConfig({...siteConfig, logoType: 'image'})}
                        className={`px-4 py-2 rounded-lg border ${siteConfig.logoType === 'image' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'}`}
                       >
                         Use Custom Image
                       </button>
                     </div>
                   </div>

                   {siteConfig.logoType === 'icon' ? (
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Select Icon</label>
                         <select 
                          value={siteConfig.icon}
                          onChange={(e) => setSiteConfig({...siteConfig, icon: e.target.value})}
                          className="w-full p-2 border rounded"
                        >
                          {Object.keys(ICON_MAP).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                      </div>
                   ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Upload Image (PNG/JPG)</label>
                          <div className="flex items-center space-x-2">
                            <label className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg shadow-sm border border-blue-200 cursor-pointer hover:bg-blue-50">
                                <Upload size={18} className="mr-2" /> Choose File
                                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                            </label>
                            <span className="text-xs text-slate-500">or</span>
                            <input 
                              type="text" 
                              placeholder="Paste Image URL"
                              value={siteConfig.logoUrl || ''}
                              onChange={(e) => setSiteConfig({...siteConfig, logoUrl: e.target.value})}
                              className="flex-grow p-2 border rounded"
                            />
                          </div>
                        </div>
                      </div>
                   )}

                   <div className="mt-6 p-4 bg-slate-200 rounded-lg flex items-center justify-center">
                      <div className="bg-white px-6 py-3 rounded-lg shadow-sm flex items-center">
                         <span className="text-xs text-slate-400 mr-3 uppercase font-bold tracking-wider">Preview:</span>
                         <div className="flex items-center">
                           {siteConfig.logoType === 'image' && siteConfig.logoUrl ? (
                              <img src={siteConfig.logoUrl} alt="Logo Preview" className="h-8 w-auto mr-2 object-contain" />
                           ) : (
                              React.createElement(ICON_MAP[siteConfig.icon] || Monitor, { size: 24, className: "mr-2 text-blue-900" })
                           )}
                           <span className="text-xl font-bold text-blue-900">{siteConfig.name}<span className="text-blue-600">{siteConfig.suffix}</span></span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                   <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><ImageIcon className="mr-2" size={20}/> Favicon Configuration</h3>
                   
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Upload Favicon (PNG/JPG/ICO)</label>
                       <div className="flex items-center space-x-2">
                         <label className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg shadow-sm border border-blue-200 cursor-pointer hover:bg-blue-50">
                             <Upload size={18} className="mr-2" /> Choose File
                             <input type="file" accept="image/*,.ico" onChange={handleFaviconUpload} className="hidden" />
                         </label>
                         <span className="text-xs text-slate-500">or</span>
                         <input 
                           type="text" 
                           placeholder="Paste Favicon URL"
                           value={siteConfig.faviconUrl || ''}
                           onChange={(e) => setSiteConfig({...siteConfig, faviconUrl: e.target.value})}
                           className="flex-grow p-2 border rounded"
                         />
                       </div>
                     </div>
                   </div>

                   {siteConfig.faviconUrl && (
                     <div className="mt-6 p-4 bg-slate-200 rounded-lg flex items-center justify-center">
                        <div className="bg-white px-6 py-3 rounded-lg shadow-sm flex items-center">
                           <span className="text-xs text-slate-400 mr-3 uppercase font-bold tracking-wider">Preview:</span>
                           <div className="flex items-center border p-1 rounded bg-slate-100">
                              <img src={siteConfig.faviconUrl} alt="Favicon Preview" className="h-4 w-4 object-contain" />
                           </div>
                           <span className="ml-2 text-sm text-slate-600">Browser Tab</span>
                        </div>
                     </div>
                   )}
                </div>
              </div>
            )}

            {/* SLIDER TAB */}
            {activeTab === 'slider' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><ImageIcon className="mr-2" size={20}/> Manage Homepage Slider</h3>
                  
                  <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">Add New Image</h4>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <input 
                        type="text" 
                        placeholder="Paste Image URL (https://...)" 
                        value={newSliderUrl}
                        onChange={(e) => setNewSliderUrl(e.target.value)}
                        className="flex-grow p-2 border rounded w-full md:w-auto"
                      />
                      <button onClick={handleAddSliderUrl} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full md:w-auto font-medium">Add URL</button>
                      <span className="text-slate-400 font-bold">OR</span>
                      <label className="flex items-center px-6 py-2 bg-white text-blue-600 rounded-lg shadow-sm border border-blue-200 cursor-pointer hover:bg-blue-50 w-full md:w-auto justify-center font-medium">
                          <Upload size={18} className="mr-2" /> Upload File
                          <input type="file" accept="image/*" onChange={handleSliderUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3">Current Slider Images ({sliderImages.length})</h4>
                    {sliderImages.length === 0 ? (
                      <p className="text-slate-500 italic text-sm">No images added. The slider will be hidden on the homepage.</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sliderImages.map((img, index) => (
                          <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-[4/3] bg-slate-100">
                             <img src={img.url} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <button 
                                 onClick={() => handleRemoveSliderImage(img.id)} 
                                 className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transform scale-75 group-hover:scale-100 transition-transform"
                                 title="Delete Image"
                               >
                                 <Trash2 size={20}/>
                               </button>
                             </div>
                             <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">#{index + 1}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><Images className="mr-2" size={20}/> Manage Photo Gallery</h3>
                  
                  <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">Add New Image</h4>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <input 
                        type="text" 
                        placeholder="Paste Image URL (https://...)" 
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        className="flex-grow p-2 border rounded w-full md:w-auto"
                      />
                      <button onClick={handleAddGalleryUrl} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full md:w-auto font-medium">Add URL</button>
                      <span className="text-slate-400 font-bold">OR</span>
                      <label className="flex items-center px-6 py-2 bg-white text-blue-600 rounded-lg shadow-sm border border-blue-200 cursor-pointer hover:bg-blue-50 w-full md:w-auto justify-center font-medium">
                          <Upload size={18} className="mr-2" /> Upload File
                          <input type="file" accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3">Current Gallery Images ({galleryImages.length})</h4>
                    {galleryImages.length === 0 ? (
                      <p className="text-slate-500 italic text-sm">No images added to the gallery.</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryImages.map((img, index) => (
                          <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-square bg-slate-100">
                             <img src={img.url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <button 
                                 onClick={() => handleRemoveGalleryImage(img.id)} 
                                 className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transform scale-75 group-hover:scale-100 transition-transform"
                                 title="Delete Image"
                               >
                                 <Trash2 size={20}/>
                               </button>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MENUS & SOCIALS TAB */}
            {activeTab === 'menus' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><List size={20} className="mr-2"/> Header Menu Items</h3>
                    <div className="space-y-3 mb-6">
                      {menuConfig.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border">
                          <button 
                            onClick={() => handleToggleMenu(item.id)} 
                            className={`p-1 rounded ${item.visible ? 'text-green-600 bg-green-100' : 'text-slate-400 bg-slate-200'}`}
                            title={item.visible ? "Visible" : "Hidden"}
                          >
                            {item.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <input 
                            value={item.label}
                            onChange={(e) => handleUpdateMenuLabel(item.id, e.target.value)}
                            className="flex-grow p-1 bg-transparent border-b border-transparent focus:border-blue-500 outline-none"
                          />
                          {item.type === 'custom' && (
                             <button onClick={() => handleDeleteMenu(item.id)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                          )}
                          <span className="text-xs text-slate-400 uppercase">{item.type.includes('dropdown') ? 'Dropdown' : 'Link'}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-bold text-slate-700 mb-3">Add Custom External Link</h4>
                      <div className="flex space-x-2">
                        <input 
                          placeholder="Label (e.g. Google)" 
                          value={newLink.label}
                          onChange={(e) => setNewLink({...newLink, label: e.target.value})}
                          className="flex-1 p-2 border rounded"
                        />
                        <input 
                          placeholder="https://..." 
                          value={newLink.url}
                          onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                          className="flex-1 p-2 border rounded"
                        />
                        <button onClick={handleAddCustomLink} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"><Plus size={20}/></button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><Globe size={20} className="mr-2"/> Social Media Icons</h3>
                    
                    <div className="space-y-4 mb-6">
                      {socials.map((social) => (
                        <div key={social.id} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border">
                           <div className="bg-slate-200 p-2 rounded text-slate-600">
                              {React.createElement(ICON_MAP[social.icon] || Globe, { size: 18 })}
                           </div>
                           <div className="flex-grow">
                             <div className="text-xs font-bold text-slate-500 mb-1">{social.platform}</div>
                             <input 
                               value={social.url}
                               onChange={(e) => handleUpdateSocialUrl(social.id, e.target.value)}
                               className="w-full text-sm p-1 border rounded"
                               placeholder="https://..."
                             />
                           </div>
                           <button onClick={() => handleDeleteSocial(social.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-bold text-slate-700 mb-3">Add New Social Link</h4>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                         <input 
                            placeholder="Platform Name" 
                            value={newSocial.platform}
                            onChange={(e) => setNewSocial({...newSocial, platform: e.target.value})}
                            className="p-2 border rounded"
                         />
                         <select 
                            value={newSocial.icon}
                            onChange={(e) => setNewSocial({...newSocial, icon: e.target.value})}
                            className="p-2 border rounded"
                         >
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Youtube">Youtube</option>
                            <option value="Linkedin">Linkedin</option>
                            <option value="Globe">Website/Globe</option>
                         </select>
                      </div>
                      <div className="flex space-x-2">
                        <input 
                            placeholder="Profile URL (https://...)" 
                            value={newSocial.url}
                            onChange={(e) => setNewSocial({...newSocial, url: e.target.value})}
                            className="flex-grow p-2 border rounded"
                         />
                        <button onClick={handleAddSocial} className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Add</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                   <h3 className="text-lg font-bold text-slate-800 mb-4">Manage Administrators</h3>
                   <div className="bg-white border rounded-xl overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                          <tr>
                            <th className="p-4 font-semibold text-slate-600">Username</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {users.map(u => (
                            <tr key={u.id}>
                              <td className="p-4 font-medium text-slate-800 flex items-center">
                                <Users size={16} className="mr-2 text-blue-500" /> {u.username}
                              </td>
                              <td className="p-4 text-right">
                                <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center"><Plus size={18} className="mr-2"/> Add New Admin</h4>
                      <div className="space-y-3">
                         <input 
                            placeholder="Username" 
                            value={newUserForm.username}
                            onChange={(e) => setNewUserForm({...newUserForm, username: e.target.value})}
                            className="w-full p-2 border rounded"
                         />
                         <input 
                            type="password"
                            placeholder="Password" 
                            value={newUserForm.password}
                            onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                            className="w-full p-2 border rounded"
                         />
                         <button onClick={handleAddUser} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">Add User</button>
                      </div>
                   </div>

                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center"><Lock size={18} className="mr-2"/> Update Password</h4>
                      <div className="space-y-3">
                         <select 
                            value={passwordForm.userId}
                            onChange={(e) => setPasswordForm({...passwordForm, userId: e.target.value})}
                            className="w-full p-2 border rounded"
                         >
                            <option value="">Select User</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                         </select>
                         <input 
                            type="password"
                            placeholder="New Password" 
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            className="w-full p-2 border rounded"
                         />
                         <button onClick={handleChangePassword} className="w-full bg-slate-800 text-white py-2 rounded-lg font-bold hover:bg-slate-900">Update Password</button>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* PAGES TAB */}
            {activeTab === 'pages' && (
              <div>
                <div className={`mb-8 p-6 rounded-xl border ${editingPageId ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    {editingPageId ? <><Edit3 size={20} className="mr-2" /> Edit Page</> : <><Plus size={20} className="mr-2" /> Add New Page</>}
                  </h3>
                  <div className="grid gap-4 mb-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <input 
                              placeholder="Page Title (e.g. Terms & Conditions)" 
                              value={pageForm.title}
                              onChange={(e) => setPageForm({...pageForm, title: e.target.value})}
                              className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <select 
                              value={pageForm.icon}
                              onChange={(e) => setPageForm({...pageForm, icon: e.target.value})}
                              className="w-full p-2 border rounded"
                            >
                              {Object.keys(ICON_MAP).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                            </select>
                        </div>
                    </div>
                    <textarea 
                      placeholder="Page Content. You can write multiple paragraphs." 
                      value={pageForm.description}
                      onChange={(e) => setPageForm({...pageForm, description: e.target.value})}
                      className="w-full p-2 border rounded h-32"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={handleSavePage} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                      <Save size={18} className="mr-2" /> {editingPageId ? 'Update Page' : 'Create Page'}
                    </button>
                    {editingPageId && (
                      <button onClick={() => { setEditingPageId(null); setPageForm({ id: '', title: '', description: '', icon: 'FileText' }); }} className="bg-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-400 flex items-center">
                        <XCircle size={18} className="mr-2" /> Cancel
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pages.map(page => (
                    <div key={page.id} className={`bg-white border p-6 rounded-xl shadow-sm relative group ${editingPageId === page.id ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg mr-3">
                           {React.createElement(ICON_MAP[page.icon] || FileText, { size: 24, className: "text-blue-600" })}
                        </div>
                        <h4 className="font-bold text-lg text-slate-800">{page.title}</h4>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-3 mb-4">{page.description}</p>
                      <div className="flex justify-end space-x-2 mt-auto">
                        <button onClick={() => handleEditPage(page)} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-medium transition-colors">Edit</button>
                        <button onClick={() => handleDeletePage(page.id)} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded text-sm font-medium transition-colors">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INSTITUTES TAB */}
            {activeTab === 'institutes' && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg text-blue-800 mb-4 border border-blue-200">
                    <p className="text-sm"><strong>Note:</strong> Update descriptions and bullet points for single-course institutes here. For "Computer Training", manage individual courses in the "Computer Courses" tab.</p>
                </div>
                {Object.keys(instituteInfo).map(key => (
                  <div key={key} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 capitalize flex items-center">
                        {key} Training Institute
                        {key === 'computer' && <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Grid Layout</span>}
                        {key !== 'computer' && <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">List Layout</span>}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                        <input 
                          value={instituteInfo[key].title}
                          onChange={(e) => setInstituteInfo({...instituteInfo, [key]: {...instituteInfo[key], title: e.target.value}})}
                          className="w-full p-2 border rounded bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                        <textarea 
                          value={instituteInfo[key].desc}
                          onChange={(e) => setInstituteInfo({...instituteInfo, [key]: {...instituteInfo[key], desc: e.target.value}})}
                          className="w-full p-2 border rounded h-24 bg-slate-50"
                        />
                      </div>
                      {key !== 'computer' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course Highlights / Syllabus Points</label>
                            <p className="text-xs text-slate-400 mb-2">Enter each point on a new line.</p>
                            <textarea 
                              value={instituteInfo[key].points || ''}
                              onChange={(e) => setInstituteInfo({...instituteInfo, [key]: {...instituteInfo[key], points: e.target.value}})}
                              className="w-full p-2 border rounded h-32 bg-slate-50 font-mono text-sm"
                              placeholder="Point 1&#10;Point 2&#10;Point 3"
                            />
                          </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* COURSES TAB (COMPUTER ONLY) */}
            {activeTab === 'courses' && (
              <div>
                <div className={`mb-8 p-6 rounded-xl border ${editingCourseId ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    {editingCourseId ? <><Edit3 size={20} className="mr-2" /> Edit Computer Course</> : <><Plus size={20} className="mr-2" /> Add New Computer Course</>}
                  </h3>
                  <div className="grid gap-4 mb-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course Name</label>
                            <input 
                              placeholder="e.g. Diploma in Computer Application" 
                              value={courseForm.name}
                              onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                              className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Icon</label>
                            <select 
                              value={courseForm.icon}
                              onChange={(e) => setCourseForm({...courseForm, icon: e.target.value})}
                              className="w-full p-2 border rounded"
                            >
                              {Object.keys(ICON_MAP).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description / Details</label>
                        <input 
                          placeholder="Brief description or list key features" 
                          value={courseForm.desc}
                          onChange={(e) => setCourseForm({...courseForm, desc: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={handleSaveCourse} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                      <Save size={18} className="mr-2" /> {editingCourseId ? 'Update Course' : 'Add Course'}
                    </button>
                    {editingCourseId && (
                      <button onClick={() => { setEditingCourseId(null); setCourseForm({ name: '', desc: '', icon: 'Monitor' }); }} className="bg-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-400 flex items-center">
                        <XCircle size={18} className="mr-2" /> Cancel
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {courses.length === 0 && <p className="text-slate-500 italic">No computer courses found.</p>}
                  {courses.map(course => (
                    <div key={course.id} className={`flex items-center justify-between bg-white border p-4 rounded-lg shadow-sm ${editingCourseId === course.id ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}>
                      <div className="flex items-center">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-4">
                            {React.createElement(ICON_MAP[course.icon] || Monitor, { size: 20 })}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{course.name}</p>
                          <p className="text-sm text-slate-500">{course.desc}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditCourse(course)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Edit">
                          <Edit3 size={20} />
                        </button>
                        <button onClick={() => handleDeleteCourse(course.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADDITIONAL COMPONENTS ---
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(interval);
  }, [images.length]);

  const goToNext = () => setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  const goToPrev = () => setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] bg-slate-900 overflow-hidden">
      {images.map((img, index) => (
        <div 
          key={img.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0 z-0'}`}
        >
          <img src={img.url} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10 pointer-events-none"></div>

      {images.length > 1 && (
        <>
          <button 
            onClick={goToPrev} 
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/80 transition-colors z-10 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24}/>
          </button>
          <button 
            onClick={goToNext} 
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/80 transition-colors z-10 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={24}/>
          </button>
          
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
             {images.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentIndex(idx)} 
                  className={`w-3 h-3 rounded-full transition-all duration-300 shadow-md ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`} 
                  aria-label={`Go to slide ${idx + 1}`}
                />
             ))}
          </div>
        </>
      )}
    </div>
  );
};

const GalleryFullPage = ({ images, navigateTo }) => {
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <button onClick={() => navigateTo('home')} className="flex items-center text-blue-600 font-semibold mb-6 hover:underline">
          <ChevronLeft size={20} /> Back to Home
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="bg-blue-600 p-10 text-white text-center">
            <Images size={48} className="mx-auto mb-4 text-blue-200" />
            <h1 className="text-4xl font-bold">Photo Gallery</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mt-4">A glimpse into our campus, events, and daily activities.</p>
          </div>
          
          <div className="p-10">
            {images.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No images available in the gallery.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((img, index) => (
                  <div key={img.id} className="aspect-square rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-shadow group">
                    <img src={img.url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DynamicPageView = ({ page, navigateTo }) => {
  const Icon = ICON_MAP[page.icon] || FileText;
  
  const renderContent = (text) => {
    return text.split('\n').map((str, index) => (
      str.trim() ? <p key={index} className="mb-4 text-slate-700 leading-relaxed">{str}</p> : <br key={index} />
    ));
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <button onClick={() => navigateTo('home')} className="flex items-center text-blue-600 font-semibold mb-6 hover:underline">
          <ChevronLeft size={20} /> Back to Home
        </button>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-10 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <Icon size={48} className="text-white/80" />
              <h1 className="text-4xl font-bold">{page.title}</h1>
            </div>
          </div>
          <div className="p-10">
            <div className="text-lg">
              {renderContent(page.description)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstitutePage = ({ type, data, courses, navigateTo }) => {
  const isComputer = type === 'computer';
  const isMobile = type === 'mobile';
  const isHotel = type === 'hotel';
  const isTailoring = type === 'tailoring';
  
  let bgClass, textClass, Icon;

  if (isComputer) {
    bgClass = 'bg-blue-600';
    textClass = 'text-blue-600';
    Icon = Monitor;
  } else if (isMobile) {
    bgClass = 'bg-indigo-600';
    textClass = 'text-indigo-600';
    Icon = Smartphone;
  } else if (isHotel) {
    bgClass = 'bg-orange-600';
    textClass = 'text-orange-600';
    Icon = Coffee;
  } else {
    bgClass = 'bg-pink-600';
    textClass = 'text-pink-600';
    Icon = Scissors;
  }

  // Parse points from string to array
  const pointsList = data.points ? data.points.split('\n').filter(p => p.trim() !== '') : [];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <button onClick={() => navigateTo('home')} className={`flex items-center ${textClass} font-semibold mb-6 hover:underline`}>
          <ChevronLeft size={20} /> Back to Home
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className={`${bgClass} p-10 text-white`}>
            <div className="flex items-center space-x-4 mb-4">
              <Icon size={48} className="text-white/80" />
              <h1 className="text-4xl font-bold">{data.title}</h1>
            </div>
            <p className="text-white/90 text-lg max-w-2xl">{data.desc}</p>
          </div>
          
          <div className="p-10">
            
            {isComputer ? (
              <>
                <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4">Our Course Catalog</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {courses.map((course) => {
                    const CourseIcon = ICON_MAP[course.icon] || Monitor;
                    return (
                      <div key={course.id} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                        <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                          <CourseIcon size={24} className="text-blue-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{course.name}</h3>
                        <p className="text-slate-600 text-sm">{course.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Course Highlights</h2>
                <div className={`p-8 rounded-xl border ${isMobile ? 'bg-indigo-50 border-indigo-200' : isHotel ? 'bg-orange-50 border-orange-200' : 'bg-pink-50 border-pink-200'}`}>
                    {pointsList.length > 0 ? (
                        <ul className="space-y-3 text-slate-700">
                          {pointsList.map((point, index) => (
                             <li key={index} className="flex items-start">
                               <CheckCircle className={`${isMobile ? 'text-indigo-500' : isHotel ? 'text-orange-500' : 'text-pink-500'} mr-3 mt-1 flex-shrink-0`} size={20}/> 
                               <span className="font-medium text-lg">{point}</span>
                             </li>
                          ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 italic">No detailed points added yet.</p>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactPage = ({ navigateTo }) => {
  const [formStatus, setFormStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.target);
    
    // --- DIRECT EMAIL SENDER ---
    formData.append("access_key", "1dfef1ee-dcd4-4e73-8088-27762c6afff5"); 
    
    formData.append("subject", `New Inquiry from ${formData.get('name')} (Tongdam Website)`);
    formData.append("from_name", "Tongdam Website Contact Form");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        setFormStatus('success');
        e.target.reset(); // Clear the form
        setTimeout(() => setFormStatus('idle'), 5000); // Go back to normal after 5 seconds
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      setFormStatus('error');
    }
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <button onClick={() => navigateTo('home')} className="flex items-center text-blue-600 font-semibold mb-6 hover:underline">
          <ChevronLeft size={20} /> Back to Home
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
          
          <div className="bg-blue-900 text-white p-10 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
                <p className="text-blue-200 mb-10">We'd love to hear from you. Our friendly team is always here to chat.</p>
                
                <div className="space-y-8">
                    <div className="flex items-start">
                        <Phone size={24} className="mr-4 text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-lg mb-2">Call Us</h3>
                            <div className="space-y-1">
                                <a href="tel:+918974840121" className="block text-blue-100 hover:text-white transition-colors">+91 89748 40121</a>
                                <a href="tel:+918732069731" className="block text-blue-100 hover:text-white transition-colors">+91 87320 69731</a>
                                <a href="tel:+916009271392" className="block text-blue-100 hover:text-white transition-colors">+91 60092 71392</a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-start">
                        <Mail size={24} className="mr-4 text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-lg mb-1">Email Us</h3>
                            <p className="text-blue-100 break-all">tongdamcomputertc@gmail.com</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <MapPin size={24} className="mr-4 text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                            <p className="text-blue-100">Damkam Bazar, New Lamka,<br/>Churachandpur, Manipur 795128</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-800 rounded-full opacity-50 z-0"></div>
            <div className="absolute top-10 -right-10 w-32 h-32 bg-blue-800 rounded-full opacity-50 z-0"></div>
          </div>
          
          <div className="p-10 md:w-3/5 bg-white">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                   <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                       <input type="text" name="name" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 transition-all" placeholder="John Doe" />
                   </div>
                   <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                       <input type="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 transition-all" placeholder="john@example.com" />
                   </div>
               </div>
               <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                   <textarea name="message" required rows="5" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 transition-all resize-none" placeholder="How can we help you?"></textarea>
               </div>
               
               <button 
                  type="submit" 
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className={`font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center w-full md:w-auto
                    ${formStatus === 'success' ? 'bg-green-500 hover:bg-green-600 text-white' : 
                      formStatus === 'error' ? 'bg-red-500 hover:bg-red-600 text-white' : 
                      'bg-blue-600 hover:bg-blue-700 text-white'}
                    ${formStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
               >
                   {formStatus === 'submitting' && <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>}
                   {formStatus === 'idle' && <Send size={18} className="mr-2" />}
                   {formStatus === 'success' && <CheckCircle size={18} className="mr-2" />}
                   {formStatus === 'error' && <XCircle size={18} className="mr-2" />}
                   
                   {formStatus === 'idle' && 'Send Message'}
                   {formStatus === 'submitting' && 'Sending...'}
                   {formStatus === 'success' && 'Message Sent!'}
                   {formStatus === 'error' && 'Try Again'}
               </button>

               {formStatus === 'success' && (
                 <p className="text-sm text-green-600 font-medium">Thank you! Your message has been sent directly to our inbox.</p>
               )}
               {formStatus === 'error' && (
                 <p className="text-sm text-red-600 font-medium">Oops, something went wrong. Please check your internet connection and try again.</p>
               )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [isDbReady, setIsDbReady] = useState(false);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [authUser, setAuthUser] = useState(null);

  // --- DEFAULT DATA STATES ---
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', password: 'admin123' }
  ]);

  const [siteConfig, setSiteConfig] = useState({
    name: "Tongdam",
    suffix: "Computers",
    icon: "Monitor",
    logoType: "icon",
    logoUrl: "",
    faviconUrl: "" 
  });

  const [socials, setSocials] = useState([
    { id: 1, platform: 'Facebook', url: '#', icon: 'Facebook' },
    { id: 2, platform: 'Instagram', url: '#', icon: 'Instagram' }
  ]);

  const [menuConfig, setMenuConfig] = useState([
    { id: 'home', label: 'Home', type: 'internal', target: 'home', visible: true },
    { id: 'training', label: 'Training', type: 'dropdown-training', visible: true },
    { id: 'services', label: 'Services', type: 'dropdown-services', visible: true },
    { id: 'gallery', label: 'Gallery', type: 'internal', target: 'gallery', visible: true },
    { id: 'contact', label: 'Contact Us', type: 'internal', target: 'contact', visible: true },
  ]);

  const [sliderImages, setSliderImages] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' },
    { id: 2, url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' },
    { id: 3, url: 'https://images.unsplash.com/photo-1555529771-835f59bfc5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' }
  ]);

  const [galleryImages, setGalleryImages] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80' },
    { id: 2, url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80' },
    { id: 3, url: 'https://images.unsplash.com/photo-1555529771-835f59bfc5bc?w=800&q=80' },
    { id: 4, url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80' },
    { id: 5, url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80' },
    { id: 6, url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80' },
  ]);

  const [instituteInfo, setInstituteInfo] = useState({
    computer: { 
        title: "Computer Training Centre", 
        desc: "Equipping you with the digital skills needed for today's job market. From basic literacy to advanced development, we have a course for everyone." 
    },
    mobile: { 
        title: "Mobile Repairing Institute", 
        desc: "Advanced training in smartphone technology. Learn chip-level repairing for Android and iPhones.",
        points: "Hardware Repairing - Component identification & soldering\nSoftware Repairing - Flashing, unlocking, formatting\nAdvanced Troubleshooting - Diagnosing dead phones & water damage"
    },
    tailoring: { 
        title: "Tailoring Institute", 
        desc: "Diploma in Tailoring (6 Months Course). Unleash your creativity and learn the art of fashion design.",
        points: "Measurements & Cutting Techniques\nStitching & Finishing\nGarment Construction\nEmbroidery Basics"
    },
    hotel: { 
        title: "Tongdam Institute of Hotel Management", 
        desc: "Prepare for a career in the hospitality industry with our comprehensive 1-year diploma course.",
        points: "Front Office Management\nHousekeeping & Maintenance\nFood & Beverage Service\nCommunication & Soft Skills\nInternship Opportunities"
    }
  });

  const [courses, setCourses] = useState([
    { id: 1, name: "Computer Basics", icon: "Monitor", desc: "Introduction to computers, OS, and basic operations." },
    { id: 2, name: "DCA", icon: "BookOpen", desc: "Diploma in Computer Applications - 6 months." },
    { id: 3, name: "ADCA", icon: "Cpu", desc: "Adv. Diploma in Computer Applications - 1 year." },
    { id: 4, name: "Tally Prime", icon: "BarChart", desc: "Accounting with GST compliance." },
    { id: 5, name: "Graphic Design", icon: "PenTool", desc: "Photoshop, CorelDraw, and design principles." },
    { id: 6, name: "Web Dev", icon: "Globe", desc: "HTML, CSS, JS, and website building." },
  ]);

  const [pages, setPages] = useState([
    { 
      id: 'banking', 
      title: "CSP UCO Bank Services", 
      icon: 'Landmark',
      description: "As an authorized Customer Service Point (CSP) for UCO Bank, we bring essential banking services closer to your doorstep.\n\nServices include:\n- Account Opening (Savings/Current)\n- Cash Deposit & Withdrawal\n- Money Transfer\n- Social Security Schemes (PMJJBY, PMSBY, APY)" 
    },
    { 
      id: 'aadhaar', 
      title: "Aadhaar Services", 
      icon: 'Fingerprint',
      description: "We provide comprehensive Aadhaar related services to ensure your identification documents are always up to date.\n\nAvailable Services:\n- PVC Card Printing (Smart Card)\n- Biometric Updates (Photo, Fingerprint, Iris)\n- Demographic Updates (Name, Address, DOB)\n- New Enrolment Assistance" 
    },
    { 
      id: 'dtp', 
      title: "DTP & Printing Works", 
      icon: 'Printer',
      description: "Professional desktop publishing and high-quality printing services for all your personal and business needs.\n\n- Resume / CV Creation\n- English, Hindi & Local Language Typing\n- High Speed Xerox (B&W / Color)\n- Passport Size Photos (Urgent)" 
    },
    {
      id: 'pan',
      title: "PAN Card Services",
      icon: 'CreditCard',
      description: "Hassle-free PAN card services for individuals and businesses.\n\n- New PAN Card Application\n- Correction in existing PAN\n- Lost PAN Card recovery\n- Link PAN with Aadhaar"
    },
    {
      id: 'voter',
      title: "Voter Card Services",
      icon: 'Users',
      description: "Get your Voter ID card updated or apply for a new one.\n\n- New Voter Registration\n- Correction of Name/Address\n- Constituency Transposition\n- Digital Voter ID Download"
    },
    {
      id: 'birth',
      title: "Birth Certificate",
      icon: 'FileText',
      description: "Assistance with Birth Certificate applications and corrections.\n\n- New Birth Certificate Application\n- Delayed Registration Assistance\n- Corrections and Updates"
    }
  ]);

  // --- FIREBASE SYNC HOOKS ---
  useEffect(() => {
    if (!auth) return;

    const initAuth = async () => {
        try {
            if (typeof window !== 'undefined' && window.__initial_auth_token) {
                await signInWithCustomToken(auth, window.__initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
        } catch (error) {
            console.error("Auth error:", error);
        }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setAuthUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
      if (!db) {
          setIsDbReady(true);
          return;
      }
      
      if (!authUser) return;

      const publicDataRef = collection(db, 'artifacts', appId, 'public', 'data', 'website_state');
      
      const unsubscribe = onSnapshot(publicDataRef, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
              if (change.type === 'added' || change.type === 'modified') {
                  const docData = change.doc.data().data;
                  switch (change.doc.id) {
                      case 'siteConfig': setSiteConfig(docData); break;
                      case 'instituteInfo': setInstituteInfo(docData); break;
                      case 'courses': setCourses(docData); break;
                      case 'pages': setPages(docData); break;
                      case 'socials': setSocials(docData); break;
                      case 'menuConfig': setMenuConfig(docData); break;
                      case 'sliderImages': setSliderImages(docData); break;
                      case 'galleryImages': setGalleryImages(docData); break;
                      case 'users': setUsers(docData); break;
                  }
              }
          });
          setIsDbReady(true);
      }, (error) => {
          console.error("Firebase sync error:", error);
          setIsDbReady(true);
      });

      return () => unsubscribe();
  }, [db, authUser, appId]);

  // --- WRAPPED SETTERS FOR FIREBASE ---
  const saveStateToFirebase = async (docId, data) => {
      if (db && authUser) {
          try {
              const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'website_state', docId);
              await setDoc(docRef, { data });
          } catch (e) {
              console.error(`Error saving ${docId}:`, e);
          }
      }
  };

  const handleSetSiteConfig = (data) => { setSiteConfig(data); saveStateToFirebase('siteConfig', data); };
  const handleSetInstituteInfo = (data) => { setInstituteInfo(data); saveStateToFirebase('instituteInfo', data); };
  const handleSetCourses = (data) => { setCourses(data); saveStateToFirebase('courses', data); };
  const handleSetPages = (data) => { setPages(data); saveStateToFirebase('pages', data); };
  const handleSetSocials = (data) => { setSocials(data); saveStateToFirebase('socials', data); };
  const handleSetMenuConfig = (data) => { setMenuConfig(data); saveStateToFirebase('menuConfig', data); };
  const handleSetSliderImages = (data) => { setSliderImages(data); saveStateToFirebase('sliderImages', data); };
  const handleSetGalleryImages = (data) => { setGalleryImages(data); saveStateToFirebase('galleryImages', data); };
  const handleSetUsers = (data) => { setUsers(data); saveStateToFirebase('users', data); };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (siteConfig.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = siteConfig.faviconUrl;
    }
  }, [siteConfig.faviconUrl]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigateTo = (view) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = users.find(u => u.username === adminUser && u.password === adminPass);
    if (foundUser) {
      setIsAdmin(true);
      setCurrentUser(foundUser.username);
      setCurrentView('admin-dashboard');
      setLoginError('');
      setAdminUser('');
      setAdminPass('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentUser('');
    setCurrentView('home');
  };

  const currentPageObj = pages.find(p => p.id === currentView);
  const isNavSolid = scrolled || currentView !== 'home';

  const Logo = ({ lightMode = false }) => {
    const graphic = (siteConfig.logoType === 'image' && siteConfig.logoUrl) ? (
      <img src={siteConfig.logoUrl} alt="Logo" className="h-10 w-auto object-contain rounded-lg" />
    ) : (
      <div className="bg-blue-600 text-white p-2 rounded-lg">
        {React.createElement(ICON_MAP[siteConfig.icon] || Monitor, { size: 24 })}
      </div>
    );

    return (
      <div className="flex items-center">
        {graphic}
        <span className={`text-2xl font-bold ml-2 ${lightMode ? 'text-white' : (isNavSolid ? 'text-blue-900' : 'text-white')}`}>
          {siteConfig.name}<span className="text-blue-600">{siteConfig.suffix}</span>
        </span>
      </div>
    );
  };

  const handleScrollToSection = (id) => {
      if (currentView !== 'home') {
          navigateTo('home');
          setTimeout(() => {
             document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      } else {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
  };

  if (!isDbReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading Website...</p>
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col">
      
      {currentView !== 'login' && (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isNavSolid ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => navigateTo('home')}
            >
               <Logo />
            </div>

            <div className="hidden md:flex space-x-6 items-center">
              {isAdmin ? (
                <>
                  <button onClick={() => navigateTo('home')} className={`font-medium hover:text-blue-500 transition-colors ${isNavSolid ? 'text-slate-600' : 'text-white'}`}>Website Home</button>
                  <button onClick={() => navigateTo('admin-dashboard')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">Dashboard</button>
                </>
              ) : (
                <>
                  {menuConfig.map((item) => {
                    if (!item.visible) return null;

                    if (item.type === 'internal') {
                      return (
                        <button key={item.id} onClick={() => navigateTo(item.target)} className={`font-medium hover:text-blue-500 transition-colors ${isNavSolid ? 'text-slate-600' : 'text-white'}`}>
                          {item.label}
                        </button>
                      );
                    } 
                    else if (item.type === 'dropdown-training') {
                      return (
                        <div key={item.id} className="relative group">
                           <button 
                             onClick={() => handleScrollToSection('institutes')}
                             className={`font-medium hover:text-blue-500 transition-colors flex items-center ${isNavSolid ? 'text-slate-600' : 'text-white'}`}
                           >
                             {item.label} <ChevronDown size={16} className="ml-1" />
                           </button>
                           <div className="absolute top-full left-0 pt-2 w-56 hidden group-hover:block z-50">
                              <div className="bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden">
                                <button onClick={(e) => { e.stopPropagation(); navigateTo('computer'); }} className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 border-b">Computer Training</button>
                                <button onClick={(e) => { e.stopPropagation(); navigateTo('mobile'); }} className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 border-b">Mobile Repairing</button>
                                <button onClick={(e) => { e.stopPropagation(); navigateTo('tailoring'); }} className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 border-b">Tailoring Institute</button>
                                <button onClick={(e) => { e.stopPropagation(); navigateTo('hotel'); }} className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600">Hotel Management</button>
                              </div>
                           </div>
                        </div>
                      );
                    }
                    else if (item.type === 'dropdown-services') {
                      return (
                        <div key={item.id} className="relative group">
                           <button 
                             onClick={() => handleScrollToSection('services-section')}
                             className={`font-medium hover:text-blue-500 transition-colors flex items-center ${isNavSolid ? 'text-slate-600' : 'text-white'}`}
                           >
                             {item.label} <ChevronDown size={16} className="ml-1" />
                           </button>
                           <div className="absolute top-full right-0 pt-2 w-48 hidden group-hover:block z-50">
                              <div className="bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden">
                                {pages.map(page => (
                                  <button 
                                    key={page.id}
                                    onClick={(e) => { e.stopPropagation(); navigateTo(page.id); }}
                                    className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 border-b last:border-0"
                                  >
                                    {page.title}
                                  </button>
                                ))}
                              </div>
                           </div>
                        </div>
                      );
                    }
                    else if (item.type === 'custom') {
                      return (
                        <a 
                          key={item.id} 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`font-medium hover:text-blue-500 transition-colors ${isNavSolid ? 'text-slate-600' : 'text-white'}`}
                        >
                          {item.label}
                        </a>
                      );
                    }
                    return null;
                  })}
                </>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={toggleMenu} className={`${isNavSolid ? 'text-slate-800' : 'text-white'}`}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg border-t h-screen overflow-y-auto pb-20">
              <div className="flex flex-col p-4 space-y-4">
                <button onClick={() => navigateTo('home')} className="text-left text-slate-800 font-bold py-2 border-b">Home</button>
                {isAdmin ? (
                  <button onClick={() => navigateTo('admin-dashboard')} className="text-left text-blue-600 font-bold py-2">Dashboard</button>
                ) : (
                  <>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Institutes</p>
                    <button onClick={() => navigateTo('computer')} className="block text-left text-slate-600 hover:text-blue-600">Computer Training</button>
                    <button onClick={() => navigateTo('mobile')} className="block text-left text-slate-600 hover:text-blue-600">Mobile Repairing</button>
                    <button onClick={() => navigateTo('tailoring')} className="block text-left text-slate-600 hover:text-blue-600">Tailoring Institute</button>
                    <button onClick={() => navigateTo('hotel')} className="block text-left text-slate-600 hover:text-blue-600">Hotel Management</button>
                    <div className="pt-2">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Services & More</p>
                       {pages.map(page => (
                          <button key={page.id} onClick={() => navigateTo(page.id)} className="block w-full text-left py-2 text-slate-600 hover:text-blue-600">
                            {page.title}
                          </button>
                       ))}
                    </div>
                    <div className="pt-2 border-t mt-2">
                      {menuConfig.filter(i => (i.type === 'custom' || i.id === 'gallery' || i.id === 'contact') && i.visible).map(item => (
                         item.type === 'custom' ? (
                            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block w-full text-left py-2 text-slate-600 hover:text-blue-600 font-medium">
                               {item.label}
                             </a>
                         ) : (
                            <button key={item.id} onClick={() => navigateTo(item.target)} className="block w-full text-left py-2 text-slate-600 hover:text-blue-600 font-medium">
                               {item.label}
                             </button>
                         )
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      )}

      <div className="flex-grow">
        {currentView === 'home' && (
          <>
            <section className="relative pt-32 pb-20 lg:py-0 lg:min-h-screen flex items-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 z-0"></div>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 transform -skew-x-12 translate-x-20"></div>
              
              <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-3/5 mb-10 md:mb-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                      Empowering Your Future Through <span className="text-yellow-400">Technology</span> & Skills
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
                      {siteConfig.name} {siteConfig.suffix} is your one-stop destination for Computer Training, Repairing, and Public Services.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                      <button 
                        onClick={() => navigateTo('computer')}
                        className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 flex items-center justify-center"
                      >
                        Explore Courses <ArrowRight className="ml-2" size={20} />
                      </button>
                      <button 
                         onClick={() => {
                          const element = document.getElementById('services-section');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold py-3 px-8 rounded-full transition-colors"
                      >
                        Our Services
                      </button>
                    </div>
                  </div>
                  <div className="md:w-2/5 flex justify-center">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-2xl">
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => navigateTo('computer')} className="bg-blue-800/80 hover:bg-blue-700 p-4 rounded-xl text-white text-center transition-colors">
                          <Monitor className="mx-auto mb-2" size={32} />
                          <span className="text-sm font-semibold">Computer<br/>Training</span>
                        </button>
                        <button onClick={() => navigateTo('mobile')} className="bg-blue-800/80 hover:bg-blue-700 p-4 rounded-xl text-white text-center transition-colors">
                          <Smartphone className="mx-auto mb-2" size={32} />
                          <span className="text-sm font-semibold">Mobile<br/>Repairing</span>
                        </button>
                        <button onClick={() => navigateTo('tailoring')} className="bg-blue-800/80 hover:bg-blue-700 p-4 rounded-xl text-white text-center transition-colors">
                          <Scissors className="mx-auto mb-2" size={32} />
                          <span className="text-sm font-semibold">Tailoring<br/>Institute</span>
                        </button>
                        <button onClick={() => navigateTo('hotel')} className="bg-blue-800/80 hover:bg-blue-700 p-4 rounded-xl text-white text-center transition-colors">
                          <Coffee className="mx-auto mb-2" size={32} />
                          <span className="text-sm font-semibold">Hotel<br/>Mgmt</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {sliderImages.length > 0 && (
               <ImageSlider images={sliderImages} />
            )}

            <section id="institutes" className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <span className="text-blue-600 font-semibold tracking-wider uppercase">Skill Development</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Our Training Institutes</h2>
                  <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div 
                    onClick={() => navigateTo('computer')}
                    className="group bg-slate-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 cursor-pointer"
                  >
                    <div className="bg-blue-600 h-2"></div>
                    <div className="p-8">
                      <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                        <Monitor className="text-blue-600 group-hover:text-white" size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 flex items-center">
                        Computer Training 
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-3 text-sm">{instituteInfo.computer.desc}</p>
                      <span className="text-blue-600 font-semibold text-sm flex items-center">View details <ArrowRight size={16} className="ml-1" /></span>
                    </div>
                  </div>

                  <div 
                    onClick={() => navigateTo('mobile')}
                    className="group bg-slate-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 cursor-pointer"
                  >
                    <div className="bg-indigo-600 h-2"></div>
                    <div className="p-8">
                      <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                        <Smartphone className="text-indigo-600 group-hover:text-white" size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 flex items-center">
                        Mobile Repairing 
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-3 text-sm">{instituteInfo.mobile.desc}</p>
                      <span className="text-indigo-600 font-semibold text-sm flex items-center">View details <ArrowRight size={16} className="ml-1" /></span>
                    </div>
                  </div>

                  <div 
                    onClick={() => navigateTo('tailoring')}
                    className="group bg-slate-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 cursor-pointer"
                  >
                    <div className="bg-pink-600 h-2"></div>
                    <div className="p-8">
                      <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors duration-300">
                        <Scissors className="text-pink-600 group-hover:text-white" size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 flex items-center">
                        Tailoring Institute 
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-3 text-sm">{instituteInfo.tailoring.desc}</p>
                      <span className="text-pink-600 font-semibold text-sm flex items-center">View details <ArrowRight size={16} className="ml-1" /></span>
                    </div>
                  </div>

                  <div 
                    onClick={() => navigateTo('hotel')}
                    className="group bg-slate-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 cursor-pointer"
                  >
                    <div className="bg-orange-600 h-2"></div>
                    <div className="p-8">
                      <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors duration-300">
                        <Coffee className="text-orange-600 group-hover:text-white" size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 flex items-center">
                        Hotel Management 
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-3 text-sm">{instituteInfo.hotel.desc}</p>
                      <span className="text-orange-600 font-semibold text-sm flex items-center">View details <ArrowRight size={16} className="ml-1" /></span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="services-section" className="py-20 bg-slate-100">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center mb-16">
                  <div className="md:w-1/2 mb-8 md:mb-0">
                    <span className="text-blue-600 font-semibold tracking-wider uppercase">{siteConfig.name} Works</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Services & Information</h2>
                    <p className="mt-4 text-slate-600 text-lg">Essential services provided by our center.</p>
                    <div className="w-20 h-1 bg-yellow-500 mt-4 rounded-full"></div>
                  </div>
                </div>

                {pages.length === 0 ? (
                  <div className="text-center text-slate-500 p-8">No services listed yet. Check back later!</div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-10">
                    {pages.map((page, index) => {
                      const PageIcon = ICON_MAP[page.icon] || FileText;
                      const borderColors = ['border-yellow-500', 'border-red-500', 'border-blue-500', 'border-green-500', 'border-purple-500'];
                      const iconColors = ['text-yellow-600', 'text-red-600', 'text-blue-600', 'text-green-600', 'text-purple-600'];
                      const bgColors = ['bg-yellow-100', 'bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100'];
                      const colorIndex = index % borderColors.length;

                      return (
                        <div 
                          key={page.id}
                          onClick={() => navigateTo(page.id)}
                          className={`bg-white p-8 rounded-xl shadow-md flex items-start space-x-4 border-l-4 ${borderColors[colorIndex]} cursor-pointer hover:bg-slate-50 transition-colors`}
                        >
                          <div className={`${bgColors[colorIndex]} p-3 rounded-lg ${iconColors[colorIndex]} shrink-0`}>
                            <PageIcon size={32} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-800">{page.title}</h3>
                            <p className="text-slate-600 mt-2 text-sm line-clamp-2">{page.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
            
            {galleryImages.length > 0 && (
              <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-12">
                    <span className="text-blue-600 font-semibold tracking-wider uppercase">Our Moments</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Photo Gallery</h2>
                    <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.slice(0, 8).map((img, index) => (
                      <div key={img.id} className="aspect-square rounded-xl overflow-hidden shadow-sm border border-slate-100 group relative cursor-pointer" onClick={() => navigateTo('gallery')}>
                        <img src={img.url} alt={`Gallery Preview ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300 flex items-center justify-center">
                           <Images size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {galleryImages.length > 8 && (
                    <div className="mt-10 text-center">
                      <button onClick={() => navigateTo('gallery')} className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-8 rounded-full transition-colors">
                        View All Images
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="py-20 bg-blue-900 text-white">
              <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className="lg:w-1/2 text-center lg:text-left">
                     <h2 className="text-3xl md:text-4xl font-bold mb-6">Visit Us Today</h2>
                     <p className="mb-8 text-blue-100 text-lg">Damkam Bazar, New Lamka, Churachandpur, Manipur 795128</p>
                     <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                        <a 
                          href="https://maps.app.goo.gl/vd9YVhPfxup3gA797" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg flex items-center justify-center"
                        >
                          <MapPin size={20} className="mr-2" /> Get Directions
                        </a>
                        <button onClick={() => navigateTo('contact')} className="bg-white text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center">
                          <Phone size={20} className="mr-2" /> Contact Us
                        </button>
                     </div>
                  </div>
                  <div className="lg:w-1/2 w-full h-[350px] rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-800 bg-blue-800">
                     <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d624.3551729806268!2d93.69377250527891!3d24.33332537763038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374eb36af5860bb3%3A0x3737bac498652e8b!2sTongdam%20Computer%20Training%20Centre!5e0!3m2!1sen!2sin!4v1772762911761!5m2!1sen!2sin" 
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Tongdam Computers Location"
                     ></iframe>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === 'login' && (
          <AdminLogin 
            adminUser={adminUser} 
            setAdminUser={setAdminUser} 
            adminPass={adminPass} 
            setAdminPass={setAdminPass} 
            handleLogin={handleLogin} 
            loginError={loginError} 
            navigateTo={navigateTo}
            siteConfig={siteConfig} 
          />
        )}
        
        {currentView === 'admin-dashboard' && isAdmin && (
          <AdminDashboard 
            courses={courses} setCourses={handleSetCourses} 
            pages={pages} setPages={handleSetPages}
            instituteInfo={instituteInfo} setInstituteInfo={handleSetInstituteInfo}
            siteConfig={siteConfig} setSiteConfig={handleSetSiteConfig}
            users={users} setUsers={handleSetUsers}
            socials={socials} setSocials={handleSetSocials}
            menuConfig={menuConfig} setMenuConfig={handleSetMenuConfig}
            sliderImages={sliderImages} setSliderImages={handleSetSliderImages}
            galleryImages={galleryImages} setGalleryImages={handleSetGalleryImages}
            currentUser={currentUser}
            handleLogout={handleLogout} 
          />
        )}

        {currentView === 'gallery' && (
          <GalleryFullPage images={galleryImages} navigateTo={navigateTo} />
        )}

        {currentView === 'computer' && (
          <InstitutePage type="computer" data={instituteInfo.computer} courses={courses} navigateTo={navigateTo} />
        )}
        
        {currentView === 'mobile' && (
          <InstitutePage type="mobile" data={instituteInfo.mobile} courses={courses} navigateTo={navigateTo} />
        )}
        
        {currentView === 'tailoring' && (
          <InstitutePage type="tailoring" data={instituteInfo.tailoring} courses={courses} navigateTo={navigateTo} />
        )}

        {currentView === 'hotel' && (
          <InstitutePage type="hotel" data={instituteInfo.hotel} courses={courses} navigateTo={navigateTo} />
        )}

        {currentView === 'contact' && (
          <ContactPage navigateTo={navigateTo} />
        )}

        {currentPageObj && (
           <DynamicPageView page={currentPageObj} navigateTo={navigateTo} />
        )}

      </div>

      {currentView !== 'login' && (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <div 
                  className="flex items-center cursor-pointer mb-4"
                  onClick={() => navigateTo('home')}
                >
                   {siteConfig.logoType === 'image' && siteConfig.logoUrl ? (
                      <div className="flex items-center">
                         <img src={siteConfig.logoUrl} alt="Logo" className="h-8 w-auto mr-2 object-contain" />
                         <span className="text-xl font-bold text-white">{siteConfig.name}<span className="text-blue-500">{siteConfig.suffix}</span></span>
                      </div>
                   ) : (
                      <>
                        <Monitor size={20} className="mr-2 text-white" />
                        <span className="text-xl font-bold text-white">{siteConfig.name}<span className="text-blue-500">{siteConfig.suffix}</span></span>
                      </>
                   )}
                </div>
                <p className="text-sm">Empowering the community with technology, skills, and essential services under one roof.</p>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-4">Our Institutes</h3>
                <ul className="space-y-2 text-sm">
                  <li><button onClick={() => navigateTo('computer')} className="hover:text-blue-400">Computer Training</button></li>
                  <li><button onClick={() => navigateTo('mobile')} className="hover:text-blue-400">Mobile Repairing</button></li>
                  <li><button onClick={() => navigateTo('tailoring')} className="hover:text-blue-400">Tailoring Institute</button></li>
                  <li><button onClick={() => navigateTo('hotel')} className="hover:text-blue-400">Hotel Management</button></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold mb-4">Services & More</h3>
                <ul className="space-y-2 text-sm">
                  {pages.slice(0, 5).map(page => (
                    <li key={page.id}><button onClick={() => navigateTo(page.id)} className="hover:text-blue-400">{page.title}</button></li>
                  ))}
                  {pages.length > 5 && <li>...and more</li>}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold mb-4">Connect</h3>
                <div className="flex space-x-4 mb-6">
                  {socials.map((social) => (
                    <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                      {React.createElement(ICON_MAP[social.icon] || Globe, { size: 20 })}
                    </a>
                  ))}
                </div>
                
                <button onClick={() => navigateTo('login')} className="text-sm hover:text-white flex items-center text-slate-500 transition-colors">
                  <Lock size={14} className="mr-2" /> Staff Login
                </button>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-8 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} {siteConfig.name} {siteConfig.suffix}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;