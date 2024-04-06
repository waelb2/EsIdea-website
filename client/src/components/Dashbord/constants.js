import {ProjectIcon,RecentsIcon,FavoritesIcon,PublicIcon,TrashIcon, ChangePFP, ChangePassIcon, HelpIcon, FeedBackIcon, LogoutIcon, OpenProj, Edit, MoveFavorite, TrashBlack, Publish, ExportProj, Colaborators} from '../../assets'
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
export const userDetails = [
    {
        icon:ChangePFP,
        title:"Change pfp"
    },{
        icon:ChangePassIcon,
        title:"Change password"
    },{
        icon:HelpIcon,
        title:"Help"
    },{
        icon:FeedBackIcon,
        title:"Feedback"
    },{
        icon:LogoutIcon,
        title:"Log out"
    }
]
export const projectDetails = [
    {
        title:"Open",
        icon:OpenProj,
        line:false
    },
    {
        title:"Edit file info",
        icon:Edit,
        line:true
    },
    {
        title:"Move to favorites",
        icon:MoveFavorite,
        line:false
    },
    {
        title:"Move to trash",
        icon:TrashBlack,
        line:false
    },
    {
        title:"Publish",
        icon:Publish,
        line:true
    },
    {
        title:"Export",
        icon:ExportProj,
        line:true
    },
    {
        title:"Colaborators",
        icon:Colaborators,
        line:false
    }
]