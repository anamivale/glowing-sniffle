export function IsUserOnline(id){
    const {isUserOnline } = usePresence(id, id)
    
    return isUserOnline
}