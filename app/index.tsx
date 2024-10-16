import Loader from "@/components/loader/Loader";
import useAuth from "@/hooks/auth/useAuth";
import { Redirect } from "expo-router";

export default function index() {
    
    const { loading, user } = useAuth()
    
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <Redirect href={user ? "/(tabs)/" : "/(routes)/welcome-intro"} />
            )}
        </>
    )
}