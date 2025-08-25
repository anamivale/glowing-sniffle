import { useEffect } from "react"

export default function GetUser(setError, setLoading, setUser, supabase, router) {
    useEffect(() => {
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (error) {
                    setError('Failed to get user session')
                    router.push('/login')
                    return
                }
                if (!session) {
                    router.push('/login')
                    return
                }
                setUser(session.user)
            } catch (err) {
                setError('An unexpected error occurred')
                router.push('/login')
            } finally {
                setLoading(false)
            }
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_OUT' || !session) {
                    setUser(null)
                    router.push('/login')
                } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    setUser(session.user)
                }
                setLoading(false)
            }
        )

        getInitialSession()
        return () => {
            subscription.unsubscribe()
        }
    }, [router, supabase.auth])
}