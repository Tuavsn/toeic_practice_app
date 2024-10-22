import { useState } from "react";

export default function useAuth() {

    const [loading, setLoading] = useState(false)

    const [user, setUser] = useState(false)

    // useEffect(() => {
        
    // }, [])

    return { loading, user }
}