import { General,Users,Tags,Logs,FeedBacks, request } from "../../assets";
export const AdminNavLinks = [
    {
        title : "Statistics",
        path:"/Admin/Statistics",
        icon : General
    },
    {
        title : "Tags",
        path:"/Admin/Tags",
        icon : Tags
    },
    {
        title : "Users",
        path:"/Admin/Users",
        icon : Users
    },
    {
        title : "Feed backs",
        path:"/Admin/FeedBacks",
        icon : FeedBacks
    },
    {
        title : "Logs",
        path:"/Admin/Logs",
        icon : Logs
    },{
        title : "Public projects requests",
        path:"/Admin/PublicProjectRequests",
        icon : request
    }
];