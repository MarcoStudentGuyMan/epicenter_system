import React, { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../supabaseConnect';
import styles from '../styles/AssignAdminRole.module.css'; 

function AssignAdminRole() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null); // Profile picture state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Check if the user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkSession();
  }, []);

  // Handle file change (for profile picture)
  const handleFileChange = (event) => {
    setProfilePic(event.target.files[0]);
  };

  // Function to add the manager/admin to Auth and the MANAGER table
  const handleAddManager = async () => {
    try {
      const password = 'admin2024'; // Default password
      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Bypass confirmation email
        user_metadata: { role: 'admin' }, // Adding user role
      });

      if (authError) {
        throw new Error(`Authentication Error: ${authError.message}`);
      }

      const managerUID = authData.user.id; // Get UID from Auth response

      // Step 2: Fetch latest Manager ID and generate the next one
      const latestManager = await supabase
        .from('MANAGER')
        .select('Manager_id')
        .order('Manager_id', { ascending: false })
        .limit(1)
        .single();

      let newIdNumber = 1;
      if (latestManager.data) {
        const latestId = latestManager.data.Manager_id;
        const idNumber = parseInt(latestId.split('-')[2]);
        newIdNumber = idNumber + 1;
      }
      const newManagerId = `MAN-24-${String(newIdNumber).padStart(3, '0')}`;

      // Step 3: Upload profile picture if provided
      let profilePicUrl = '';
      if (profilePic) {
        const { data, error } = await supabase.storage
          .from('manager-profile-pic')
          .upload(`manager-${Date.now()}-${profilePic.name}`, profilePic);

        if (error) {
          throw error;
        }

        profilePicUrl = supabase.storage.from('manager-profile-pic').getPublicUrl(data.path).data.publicUrl;
      }

      // Step 4: Insert manager details into the MANAGER table
      const { error: insertError } = await supabase
        .from('MANAGER')
        .insert([
          {
            Manager_id: newManagerId,
            Manager_FirstName: firstName,
            Manager_LastName: lastName,
            Contact_Num: contactNumber,
            Manager_Email: email,
            Manager_Password: password,
            Manager_Profile_Pic: profilePicUrl,
            Manager_UID: managerUID,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      alert('Manager added successfully!');
      // Reset fields after successful insertion
      setFirstName('');
      setLastName('');
      setContactNumber('');
      setEmail('');
      setProfilePic(null);
    } catch (error) {
      console.error('Error adding manager:', error.message);
      alert('Failed to add manager. Please try again.');
    }
  };

  // Function to handle login
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setLoginError('Invalid login credentials');
    } else {
      setIsLoggedIn(true);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    window.location.href = '/LoginHere'; // Redirect to login page
  };

  return (
    <div className={styles.adminRoleContainer}>
      {/* Login Modal */}
      {!isLoggedIn && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h2>Secret Admin portal</h2>
      <input
        type="text"
        placeholder="Enter Email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      {loginError && <p className={styles.error}>{loginError}</p>}
      <button className={styles.loginButton} onClick={handleLogin}>
        Login
      </button>
      
      {/* New message below */}
      <p className={styles.warningText}>
        This portal is for admin level only. Go away!
      </p>
    </div>
  </div>
)}


      {isLoggedIn && (
        <>
           <h1 className={styles.heading}>Admin Creation</h1>
          <div className={styles.formGroup}>
            <label>First Name:</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter First Name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Last Name:</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter Last Name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Contact Number:</label>
            <input
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Enter Contact Number"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email Address:</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Profile Picture:</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <button className={styles.submitButton} onClick={handleAddManager}>
            Add Manager/Admin
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default AssignAdminRole;
