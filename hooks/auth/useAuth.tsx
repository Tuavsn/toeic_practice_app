import { useState } from "react";

export default function useAuth() {

    const [loading, setLoading] = useState(true)

    const [user, setUser] = useState(true)

    // useEffect(() => {
        
    // }, [])

    return { loading, user }
}