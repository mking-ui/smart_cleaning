import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const SideBar = () => {
    const pathname = usePathname()
    const menuItems = [
        { name: 'Add Report', path: '/report', icon: assets.add_icon },
        { name: 'Report History', path: '/report/history', icon: assets.product_list_icon },
        { name: 'Settings', path: '/report/settings', icon: assets.order_icon },
    ];

    return (
        <div className="md:w-64 w-20 border-r min-h-screen text-slate-100 bg-emerald-800 border-gray-300 py-4 flex flex-col items-center md:items-stretch">
             {menuItems.map((item) => {
                   const isActive = pathname === item.path;
           
                   return (
                     <Link
                       href={item.path}
                       key={item.name}
                       className={`flex flex-col md:flex-row items-center md:items-center py-3 md:py-2 px-2 md:px-4 gap-1 md:gap-5 text-center md:text-left  transition-all duration-300 ${
                         isActive
                           ? "bg-yellow-400/20 border-r-4 md:border-r-[6px] border-yellow-500"
                           : "hover:bg-yellow-400/30"
                       }`}
                     >
                       <Image
                         src={item.icon}
                         alt={`${item.name.toLowerCase()}_icon`}
                         width={28}
                         height={28}
                         className="w-7 h-7"
                       />
                       <p className="text-[11px] md:text-base font-medium leading-tight">{item.name}</p>
                     </Link>
                   );
                 })}
        </div>
    );
};

export default SideBar;
