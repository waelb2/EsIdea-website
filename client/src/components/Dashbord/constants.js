import { useEffect, useState } from 'react';
import {ProjectIcon,RecentsIcon,FavoritesIcon,PublicIcon,TrashIcon} from '../../assets'
export const NavLinks = [
    {
        title : "Projects",
        path:"/Home/Projects",
        icon : ProjectIcon
    },
    {
        title : "Recents",
        path:"/Home/Recents",
        icon : RecentsIcon
    },
    {
        title : "Favorites",
        path:"/Home/Favorites",
        icon : FavoritesIcon
    },
    {
        title : "Public",
        path:"/Home/Public",
        icon : PublicIcon
    },
    {
        title : "Trash",
        path:"/Home/Trash",
        icon : TrashIcon
    }
];
export const useDebounce = (value,delay)=>{
    const [debouncedValue,setDebouncedValue] = useState("");
    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setDebouncedValue(value);
        },delay)
        return ()=>clearTimeout(timeout);
    },[value,delay]);
    return debouncedValue;
}