import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://oviikwkwuhgahtzubjfr.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjcyNDMxMTRmLWJhNWYtNGIzYy1iMjFmLTgwMjhiMWU0NmQ4YyJ9.eyJwcm9qZWN0SWQiOiJvdmlpa3drd3VoZ2FodHp1YmpmciIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgxNTA0Mjk5LCJleHAiOjIwOTY4NjQyOTksImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.3_YaSG3zmXbajQndXvhS4vTG5CwOjkKE_Cegw0WFuJI';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };