import { useLocation } from "react-router-dom";
import useUser from "../../hooks/useUser"
import AdminBrainStorming from "../Admin Brainstorming/AdminBrainstorming";
import AdminBrainWriting from "../Admin Brainwriting/AdmingBrainwriting";
import BrainStorming from "./BrainStorming";
import BrainWriting from "./BrainWriting";

const Ideation = () => {
    const { user } = useUser();
    const location = useLocation();
    const { project } = location.state;

    if(!project) throw new Error("where is the project!!!!!!!!!!!");

    const isCoordinator = user.email === project.coordinator.email;

    return (
        <>
            {
                isCoordinator
                ? project.IdeationMethod === "brainstorming" ? <AdminBrainStorming project={project}/> : <AdminBrainWriting project={project}/>
                : project.IdeationMethod === "brainstorming" ? <BrainStorming project={project}/> : <BrainWriting project={project}/>
            }
        </>

    )
}

export default Ideation