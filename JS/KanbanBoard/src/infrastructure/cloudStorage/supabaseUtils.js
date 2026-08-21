import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey)

// Function to sign up a new user with email and password
export async function signUpWithEmail(email, password) {
    const { user, session, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    return { user, session, error };
}
  
// Function to sign in an existing user with email and password
export async function signInWithEmail(email, password) {
    const { data, error }  = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    return { data, error };
}
  
// Function to sign out the current user
export async function signOut() {
    const { error } = await supabase.auth.signOut();
  
    return { error };
}
