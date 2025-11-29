import { IsUserOnline } from '@/hooks/usePresence'
import React from 'react'

function UserOnlineStatus() {
    const { isOnline } = IsUserOnline(id)
    return (
        <div>
            <div className='flex items-center gap-2'>
                <span>{isOnline ? '🟢 Online' : '⚫ Offline'}</span>

            </div>

        </div>
    )
}

export default UserOnlineStatus

