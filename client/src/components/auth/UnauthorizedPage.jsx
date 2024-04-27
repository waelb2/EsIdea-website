import { useNavigate } from "react-router-dom"

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <>
        <div>Unauthorized </div>
        <button onClick={goBack}>Go back</button>
        </>
    )
}

export default UnauthorizedPage