import { getBrowserSupabase } from '@/lib/supabas'

export async function CreateConversation(currentuserId, otherUserId) {
    const supabase = getBrowserSupabase()
    const { data: existingcov } = await supabase
        .from('conversations')
        .select("*")
        .or(`and(user1_id.eq.${currentuserId}, user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId}, user2_id.eq.${currentuserId}) `)
        .single()

    if (!existingcov) {
        const { data: newconv } = await supabase
            .from("conversations")
            .insert({
                user1_id: currentuserId,
                user2_id: otherUserId
            })
            .select()
            .single();
    }
    

}

export async function getConversations() {
    const supabase = getBrowserSupabase()

    const { data: conversations } = await supabase
        .from('conveersations')
        .select(`*,
            messages (
            content
            created_at
            is_read
            )
        `)
        .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
        .order('updated_at', { ascending: false })

}