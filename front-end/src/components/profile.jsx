import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from 'react';
import React from "react";
import { jwtDecode } from 'jwt-decode';
import { User, Shield, CheckCircle } from 'lucide-react';


const Profile = () => {
  console.log("test");
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const token = await getAccessTokenSilently();
        const decoded = jwtDecode(token);
        const perms = decoded.permissions;
        setPermissions(perms);
      } catch (error) {
        console.error(error);
      }
    }
    if (isAuthenticated) {
      getPermissions();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #1e40af 100%)',
      padding: '24px'
    },
    maxWidth: {
      maxWidth: '1024px',
      margin: '0 auto'
    },
    profileCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      borderRadius: '24px',
      padding: '32px',
      marginBottom: '32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    profileContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '32px'
    },
    profileImageContainer: {
      position: 'relative'
    },
    profileImage: {
      width: '128px',
      height: '128px',
      borderRadius: '50%',
      border: '4px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      objectFit: 'cover'
    },
    placeholderImage: {
      width: '128px',
      height: '128px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.2)',
      border: '4px solid rgba(255, 255, 255, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statusBadge: {
      position: 'absolute',
      bottom: '-8px',
      right: '-8px',
      background: '#10b981',
      borderRadius: '50%',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    profileInfo: {
      textAlign: 'center',
      flex: '1'
    },
    userName: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '8px',
      margin: '0'
    },
    userEmail: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '1.125rem',
      marginBottom: '16px'
    },
    verifiedBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(255, 255, 255, 0.2)',
      padding: '8px 16px',
      borderRadius: '50px'
    },
    accessCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px'
    },
    iconContainer: {
      padding: '12px',
      background: 'rgba(249, 115, 22, 0.2)',
      borderRadius: '12px'
    },
    sectionTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: 'white',
      margin: '0'
    },
    permissionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px'
    },
    permissionCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(8px)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    },
    permissionCardHover: {
      background: 'rgba(255, 255, 255, 0.2)',
      transform: 'scale(1.02)'
    },
    permissionContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    permissionIcon: {
      width: '40px',
      height: '40px',
      background: 'rgba(249, 115, 22, 0.2)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    permissionText: {
      color: 'white',
      fontWeight: '500',
      textTransform: 'capitalize',
      margin: '0'
    },
    permissionStatus: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '0.875rem',
      margin: '0'
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 0'
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
      marginTop: '32px'
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '8px',
      margin: '0 0 8px 0'
    },
    statLabel: {
      color: 'rgba(255, 255, 255, 0.7)',
      margin: '0'
    }
  };

  const [hoveredCard, setHoveredCard] = useState(null);


  return (
    isAuthenticated && (
      <div style={styles.container}>
        {/* Font Awesome CDN */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <div style={styles.maxWidth}>
          {/* Profile Card */}
          <div style={styles.profileCard}>
            <div style={styles.profileContent}>
              {/* Profile Image */}
              <div style={styles.profileImageContainer}>
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user?.name}
                    style={styles.profileImage}
                  />
                ) : (
                  <div style={styles.placeholderImage}>
                    <i className="fas fa-user" style={{fontSize: '4rem', color: 'rgba(255, 255, 255, 0.7)'}}></i>
                  </div>
                )}
                <div style={styles.statusBadge}>
                  <i className="fas fa-check-circle" style={{fontSize: '1.5rem', color: 'white'}}></i>
                </div>
              </div>

              {/* Profile Info */}
              <div style={styles.profileInfo}>
                <h1 style={styles.userName}>
                  {user?.name || 'Welcome'}
                </h1>
                <p style={styles.userEmail}>
                  {user?.email}
                </p>
                <div style={styles.verifiedBadge}>
                  <i className="fas fa-shield-alt" style={{color: 'white'}}></i>
                  <span style={{color: 'white', fontWeight: '500'}}>Verified Account</span>
                </div>
              </div>
            </div>
          </div>

          {/* Access Level Section */}
          <div style={styles.accessCard}>
            <div style={styles.sectionHeader}>
              <div style={styles.iconContainer}>
                <i className="fas fa-shield-alt" style={{fontSize: '2rem', color: '#fed7aa'}}></i>
              </div>
              <h2 style={styles.sectionTitle}>Access Level</h2>
            </div>

            {permissions.length > 0 ? (
              <div style={styles.permissionsGrid}>
                {permissions.map((perm, index) => (
                  <div 
                    key={index}
                    style={{
                      ...styles.permissionCard,
                      ...(hoveredCard === index ? styles.permissionCardHover : {})
                    }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div style={styles.permissionContent}>
                      <div style={styles.permissionIcon}>
                        <i className="fas fa-check-circle" style={{color: '#fed7aa'}}></i>
                      </div>
                      <div>
                        <p style={styles.permissionText}>
                          {perm.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p style={styles.permissionStatus}>Active</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <i className="fas fa-shield-alt" style={{fontSize: '2rem', color: 'rgba(255, 255, 255, 0.5)'}}></i>
                </div>
                <p style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.125rem', margin: '0'}}>No permissions assigned</p>
                <p style={{color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem', marginTop: '8px'}}>Contact your administrator for access</p>
              </div>
            )}
          </div>

          {/* Additional Stats/Info Section */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{permissions.length}</div>
              <div style={styles.statLabel}>Permissions</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>Active</div>
              <div style={styles.statLabel}>Status</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>Admin</div>
              <div style={styles.statLabel}>Role Level</div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};





// const Profile = () => {
//   console.log("test");
//   const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
//   const [permissions, setPermissions] = useState([]);

//   useEffect( () => { 
//     const getPermissions = async () => {
//         try {
//             const token = await getAccessTokenSilently();
//             const decoded = jwtDecode(token);
//             const perms = decoded.permissions;
//             setPermissions(perms);
//         } catch (error) {
//             console.error(error);
//         }
//     }
//     if(isAuthenticated) {
//         getPermissions();
//     }

//   }, [isAuthenticated, getAccessTokenSilently]);

  
//   return (
//     isAuthenticated && (
//       <article className="column">
//         {user?.picture && <img src={user.picture} alt={user?.name} />}
//         <h2>{user?.name}</h2>
//         <h1>Access Level: </h1>
//         <ul>
//           {permissions.map((perm, index) => (
//             <li key={index}>{perm}</li>
//           ))}
//         </ul>

//       </article>
//     )
    
//   );
// };

export default Profile;