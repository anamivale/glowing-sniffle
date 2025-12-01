import { getBrowserSupabase } from "@/lib/supabas"

export async function getConvMessages(conversation_id) {
    const supabase = getBrowserSupabase()
    const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .eq('conversation_id', conversation_id)
        .order("created_at", { ascending: true })

    return messages


}


export async function insertMessage(conversation_id, sender_id, content) {
    const supabase = getBrowserSupabase()
    const { data, error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversation_id,
            sender_id: sender_id,
            content: content

        })
    return {data,  error }
}