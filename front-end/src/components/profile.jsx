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

  return (
    isAuthenticated && (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative">
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user?.name}
                    className="w-32 h-32 rounded-full border-4 border-white/30 shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
                    <User className="w-16 h-16 text-white/70" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {user?.name || 'Welcome'}
                </h1>
                <p className="text-white/80 text-lg mb-4">
                  {user?.email}
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Verified Account</span>
                </div>
              </div>
            </div>
          </div>

          {/* Access Level Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Shield className="w-8 h-8 text-orange-300" />
              </div>
              <h2 className="text-3xl font-bold text-white">Access Level</h2>
            </div>

            {permissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {permissions.map((perm, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-orange-300" />
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">
                          {perm.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-white/60 text-sm">Active</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white/50" />
                </div>
                <p className="text-white/70 text-lg">No permissions assigned</p>
                <p className="text-white/50 text-sm mt-2">Contact your administrator for access</p>
              </div>
            )}
          </div>

          {/* Additional Stats/Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-white mb-2">{permissions.length}</div>
              <div className="text-white/70">Permissions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-white mb-2">Active</div>
              <div className="text-white/70">Status</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-white mb-2">Admin</div>
              <div className="text-white/70">Role Level</div>
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