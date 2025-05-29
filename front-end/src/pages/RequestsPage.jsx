import React, { useEffect, useState } from 'react';
import '../styles/App.css'; 
import '../styles/HomePage.css'
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import InfoPopup from '../components/InfoPopup';


const RequestsPage = () => {
  const [name, setName] = useState();
  const [role, setRole] = useState();
  const [affiliation, setAffiliation] = useState();
  const [funding, setFunding] = useState();
  const [intention, setIntention] = useState();
  const [share, setShare] = useState();
  const [when, setWhen] = useState();
  const [area, setArea] = useState();
  const [target, setTarget] = useState();
  const [data, setData] = useState();
  const { user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();

  // Prefill form from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      // Set each field if URL parameter exists
      setName(params.get('name') || '');
      setRole(params.get('role') || '');
      setAffiliation(params.get('affiliation') || '');
      setFunding(params.get('funding') || '');
      setIntention(params.get('intention') || '');
      setShare(params.get('share') || '');
      setWhen(params.get('when') || '');
      setArea(params.get('area') || '');
      setTarget(params.get('target') || '');
      setData(params.get('data') || '');
    }
  }, []);

  const sendMail = async () => {
    try {
      const token = await getAccessTokenSilently();
      const email = user.email;
      await axios.get("/api/user/send-email", {
        params: {
          email,
          name,
          role,
          affiliation,
          funding,
          intention,
          share,
          when,
          area,
          target,
          data,
        },
      });
      console.log("done");
    } catch (error) {
      console.error('error', error);
    }
  };


// Generate prefilled URL for presentation
const generateDemoUrl = () => {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  
  params.set('name', 'Dr. Jane Smith');
  params.set('role', 'Faculty Researcher');
  params.set('affiliation', 'Stanford University');
  params.set('funding', 'NSF Grant #12345');
  params.set('intention', 'Academic publication and policy recommendations');
  params.set('share', 'Conference presentation in Q3 2024, followed by public report');
  params.set('when', 'December 2024');
  params.set('area', 'California Bay Area');
  params.set('target', 'Low-income urban communities');
  params.set('data', 'Python with Pandas and R');
  
  return `${baseUrl}?${params.toString()}`;
};



  return (    
    <div class="home-container">
      <div className='form-container'>
      <h2 className="about-title">Request Form 
        <InfoPopup>
          <p style={{ textAlign: 'center' , margin: '0 20px', fontSize: '22px', padding: '70px 0'}}>
          To request Registered User permissions, fill out the fields and click send email. This will send an email to an admin with the inputted information. An email will also be sent to the email address of the current user account.
          Registered Users will be able to access the Upload/Delete Data page for changing data. 
          </p>
        </InfoPopup>
      </h2>

      {/* For presentation: show the demo URL */}
             {process.env.NODE_ENV === 'development' && (
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
            <p>Demo URL: <a href={generateDemoUrl()}>{generateDemoUrl()}</a></p>
          </div>
        )}

      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Role (e.g., Student, Postdoc, Faculty, Researcher, Policy Analyst, other)"
        onChange={(e) => setRole(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Affiliation (e.g., Academic, Government, Non-Profit, Private Sector, other)"
        onChange={(e) => setAffiliation(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Funding Source (if applicable)"
        onChange={(e) => setFunding(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Data Use Intentions (e.g., Publication, Policy Report, Internal Analysis, other)"
        onChange={(e) => setIntention(e.target.value)}
      />
      <br />
      <textarea
        placeholder="How and when will you share your findings with community members and organizations?"
        onChange={(e) => setShare(e.target.value)}
      />
      <br />
      <textarea
        placeholder="When will you complete the final document based on this research?"
        onChange={(e) => setWhen(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Which geographic area of the US are you interested in exploring?"
        onChange={(e) => setArea(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Target Population"
        onChange={(e) => setTarget(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Data analysis program"
        onChange={(e) => setData(e.target.value)}
      />
      <br />
      <button class="send" onClick={sendMail}>Send Email</button>
      </div>
    </div>
  );
}

export default RequestsPage;