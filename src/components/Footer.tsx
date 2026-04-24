import React from 'react';
import { Facebook, Instagram, Youtube, Linkedin, Twitter, Send } from 'lucide-react';

const sections = [
  {
    title: "Company",
    links: ["About Us", "Contact Us", "Careers", "Updates", "Account Deletion"]
  },
  {
    title: "Our Centres",
    links: ["New Delhi", "Patna", "Kota", "Noida", "Dhanbad", "Varanasi", "View All"]
  },
  {
    title: "Popular Exams",
    links: ["IIT JEE", "NEET", "GATE", "Defence", "UPSC", "School Prep", "PW NSAT"]
  }
];

const Footer = () => {
  const siteName = localStorage.getItem('admin_site_name') || 'Physics Wallah';

  return (
    <footer className="bg-tertiary-6 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-12 mb-16">
          <div className="xl:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/537952c6-cac8-4284-83a1-4a81818d3ccc.webp" 
                alt={siteName} 
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold text-headings">{siteName}</span>
            </div>
            <p className="text-body-2 text-sm md:text-base mb-10 max-w-md">
              We understand that every student has unique needs and abilities, that’s why our curriculum is designed to adapt to your needs and help you grow!
            </p>
            
            <div className="flex flex-col gap-4 mb-10">
              <span className="text-lg font-bold text-headings">Let’s get social :</span>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, color: "#1877F2" },
                  { icon: Instagram, color: "#E4405F" },
                  { icon: Youtube, color: "#FF0000" },
                  { icon: Linkedin, color: "#0A66C2" },
                  { icon: Twitter, color: "#1DA1F2" },
                  { icon: Send, color: "#0088CC" }
                ].map((social, i) => (
                  <a key={i} href="#" className="hover:opacity-80 transition-opacity">
                    <social.icon className="w-6 h-6" style={{ color: social.color }} />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <a href="#"><img src="https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/597f8a82-2acf-4b27-8f1b-35b6ffda9bc1.webp" className="h-10 rounded-lg" alt="Get it on Google Play" /></a>
              <a href="#"><img src="https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/8055a96b-a723-442d-908a-77f680453abe.webp" className="h-10 rounded-lg" alt="Download on App Store" /></a>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xl font-bold text-headings mb-6">{section.title}</h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-body-2 hover:text-primary transition-colors text-sm md:text-base">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-stroke-light pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 items-center">
            <a href="#" className="text-sm font-medium text-body-2 hover:text-headings">Privacy Policy</a>
            <div className="w-px h-4 bg-stroke-light" />
            <a href="#" className="text-sm font-medium text-body-2 hover:text-headings">Terms of use</a>
            <div className="w-px h-4 bg-stroke-light" />
            <a href="/xyzabc123" className="text-sm font-medium text-primary hover:text-primary-600">Admin Panel</a>
          </div>
          <p className="text-sm text-headings">Copyright © 2026 {siteName} Limited All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
