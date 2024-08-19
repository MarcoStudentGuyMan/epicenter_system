import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vnwxutipllobsnupbouk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZud3h1dGlwbGxvYnNudXBib3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI3MDY4MjcsImV4cCI6MjAzODI4MjgyN30.VJRUreBVy5jZA7piH_6yhXm9VtWWlPMDFtTbB7_NXf8';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;